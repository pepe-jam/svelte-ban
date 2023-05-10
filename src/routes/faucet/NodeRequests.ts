import { BananoUtil } from '@bananocoin/bananojs'
import { BigNumber } from 'bignumber.js'

type AccountInfo = {
  frontier: string
  open_block: string
  representative_block: string
  balance: string
  modified_timestamp: string
  block_count: string
  account_version: string
  confirmation_height: string
  confirmation_height_frontier: string
  representative: string,
}

type SignedBlock = {
  hash: string,
  block: {
    type: string,
    account: string,
    previous: string,
    representative: string,
    balance: string,
    link: string,
    link_as_account: string,
    signature: string,
    work: string
  }
}

type BlockInfo = {
  block_account: string,
  amount: string,
  balance: string,
  height: string,
  local_timestamp: string,
  successor: string,
  confirmed: string,
  contents: SignedBlock,
  subtype: string
}

const BANANODEAPIS = { 'Ptera': 'https://booster.dev-ptera.com/banano-rpc', 'Kalium': 'https://kaliumapi.appditto.com/api' }

const LOGGING = true

export function bananoDecimalToRaw(banano: string) {
  const rawFactor = BigNumber('1e29');
  const _banano = BigNumber(banano)
  const raw = _banano.times(rawFactor).toString(10)
  return raw
}

export function rawToBananoDecimal(raw: string) {
  const bananoFactor = BigNumber('1e-29');
  const _raw = BigNumber(raw)
  const banano = _raw.times(bananoFactor).toString(10)
  return banano
}

function getPrivateKey(FAUCET_SEED: string) {
  return BananoUtil.getPrivateKey(FAUCET_SEED, 0)
}

export async function sendBanano(account: string, seed: string, toAddress: string, amount: string) {
  try {
    const signedBlock = await createTransaction(account, seed, toAddress, amount, 'send')
    const blockHash = await broadcastTransaction(signedBlock, 'send')
    return blockHash
  } catch (error) {
    console.error(error)
  }
}

export async function receiveBanano(account: string, seed: string) {
  let receivedBlocks: string[] = []
  const receiveableBlocks = await getReceivableBlocks(account)
  for (let i = 0; i < receiveableBlocks.length; i++) {
    const blockHash = receiveableBlocks[i]
    receivedBlocks.push(await receiveBlock(account, seed, blockHash))
  }
  return receivedBlocks
}

async function createTransaction(account: string, seed: string, link: string, amount: string, type: 'send' | 'receive') {
  const accountInfo = await getAccountInfo(account)

  const representative = accountInfo.representative
  let remaining = BigNumber('0')
  if (type === 'send') {
    remaining = BigNumber(accountInfo.balance).minus(BigNumber(amount))
  } else {
    remaining = BigNumber(accountInfo.balance).plus(BigNumber(amount))
  }
  const remainingDecimal = remaining.toString(10)

  const request = {
    action: 'block_create',
    json_block: 'true',
    type: 'state',
    previous: accountInfo.frontier,
    account: account,
    representative: representative,
    balance: remainingDecimal,
    link: link,
    key: getPrivateKey(seed)
  }
  return (await requestFromNode(request, BANANODEAPIS.Ptera)).block
}

async function broadcastTransaction(signedBlock: SignedBlock, subtype: 'send' | 'receive') {
  const request = {
    action: 'process',
    json_block: 'true',
    subtype: subtype,
    block: signedBlock
  }
  return (await requestFromNode(request, BANANODEAPIS.Ptera)).hash
}

async function getReceivableBlocks(account: string): Promise<string[]> {
  const request = {
    action: 'receivable',
    account: account,
  }
  return (await requestFromNode(request, BANANODEAPIS.Kalium)).blocks
}

async function receiveBlock(account: string, seed: string, blockHash: string) {
  const blockInfo = await getBlockInfo(blockHash)
  const amount = blockInfo.amount

  const signedBlock = await createTransaction(account, seed, blockHash, amount, 'receive')
  const broadcastedBlockHash = await broadcastTransaction(signedBlock, 'receive')
  return broadcastedBlockHash
}

async function getBlockInfo(blockHash: string): Promise<BlockInfo> {
  const request = {
    action: 'block_info',
    json_block: 'true',
    hash: blockHash
  }
  return (await requestFromNode(request, BANANODEAPIS.Kalium))
}

export async function getWork(frontier: string) {
  const request = {
    action: 'work_generate',
    hash: frontier
  }
  return (await requestFromNode(request, BANANODEAPIS.Ptera)).work
}


export async function getAccountBalance(account: string) {
  const request = {
    action: 'account_balance',
    account: account
  }
  const balance_decimal = (await requestFromNode(request, BANANODEAPIS.Ptera)).balance_decimal
  return Number(balance_decimal).toFixed(2)
}

async function getAccountInfo(account: string): Promise<AccountInfo> {
  const request = {
    action: 'account_info',
    account: account,
    representative: true
  }
  return await requestFromNode(request, BANANODEAPIS.Ptera)
}

export async function faucetDry(account: string) {
  const balance = Number(await getAccountBalance(account))
  return balance < 1
}

export async function unopenedAccount(account: string) {
  const request = {
    action: 'account_history',
    account: account,
    count: 1
  }
  return (await requestFromNode(request, BANANODEAPIS.Kalium)).history !== ''
}

// TODO fill blacklist
const blacklist: Array<string> = ['ban_36aauqwe6s3dibw9c3j1yxwxtz88bnxwjhjhao1tad3hjzyhgjf9urn1ctzw']
export async function relatedToBlacklist(account: string) {
  if (blacklist.includes(account)) return true
  const request = {
    action: 'account_history',
    account: account,
    count: -1
  }
  const history = (await requestFromNode(request, BANANODEAPIS.Kalium)).history

  if (history) {
    for (let i = 0; i < history.length; i++) {
      if (history[i].type === 'send' && blacklist.includes(history[i].account)) {
        return true
      }
    }
  }
  return false
}

async function requestFromNode(request: object, apiUrl: string) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  }

  try {
    const response = await fetch(apiUrl, options)
    const result = await response.json()

    if (LOGGING) {
      console.log('REQUEST')
      console.log(JSON.stringify(request))
      console.log('RESULT')
      console.log(JSON.stringify(result))
    }

    return result
  } catch (error) {
    console.error(error)
  }
}
