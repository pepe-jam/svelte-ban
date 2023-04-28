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
const FAUCET_SEED = '00A01A82FFE177A1D9ACD4DF3C3CBA770FE50FF33CAA83A256FC0A6D71C5C611'
const FAUCET_ADDRESS = 'ban_36aauqwe6s3dibw9c3j1yxwxtz88bnxwjhjhao1tad3hjzyhgjf9urn1ctzw'

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

function getPrivateKey() {
  return BananoUtil.getPrivateKey(FAUCET_SEED, 0)
}

export async function sendBanano(toAddress: string, amount: string) {
  try {
    const signedBlock = await createTransaction(toAddress, amount, 'send')
    const blockHash = await broadcastTransaction(signedBlock, 'send')
    return blockHash
  } catch (error) {
    console.error(error)
  }
}

export async function receiveBanano() {
  const account = FAUCET_ADDRESS

  let receivedBlocks: string[] = []
  const receiveableBlocks = await getReceivableBlocks(account)
  for (let i = 0; i < receiveableBlocks.length; i++) {
    const blockHash = receiveableBlocks[i]
    receivedBlocks.push(await receiveBlock(blockHash))
  }
  return receivedBlocks
}

async function createTransaction(link: string, amount: string, type: 'send' | 'receive') {
  const account = await getAccountInfo(FAUCET_ADDRESS)

  const representative = account.representative
  let remaining = BigNumber('0')
  if (type === 'send') {
    remaining = BigNumber(account.balance).minus(BigNumber(amount))
  } else {
    remaining = BigNumber(account.balance).plus(BigNumber(amount))
  }
  const remainingDecimal = remaining.toString(10)

  const request = {
    action: 'block_create',
    json_block: 'true',
    type: 'state',
    previous: account.frontier,
    account: FAUCET_ADDRESS,
    representative: representative,
    balance: remainingDecimal,
    link: link,
    key: getPrivateKey()
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

async function receiveBlock(blockHash: string) {
  const blockInfo = await getBlockInfo(blockHash)
  const amount = blockInfo.amount

  const signedBlock = await createTransaction(blockHash, amount, 'receive')
  const ownBlockHash = await broadcastTransaction(signedBlock, 'receive')
  return ownBlockHash
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

export async function getFaucetBalance() {
  return await getAccountBalance(FAUCET_ADDRESS)
}

export async function getAccountBalance(account: string) {
  const request = {
    action: 'account_balance',
    account: account
  }
  const balance_decimal = (await requestFromNode(request, BANANODEAPIS.Ptera)).balance_decimal
  return Number(balance_decimal).toFixed(2)
}

export async function getAccountInfo(account: string): Promise<AccountInfo> {
  const request = {
    action: 'account_info',
    account: account,
    representative: true
  }
  return await requestFromNode(request, BANANODEAPIS.Ptera)
}

async function faucetDry() {
  const balance = Number(await getFaucetBalance())
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
const blacklist: Array<string> = []
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

export async function requestFromNode(request: object, apiUrl: string) {
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
