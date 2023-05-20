import { error, json } from '@sveltejs/kit'
// import { getClaimInfo, updateAccount } from '$/db/claims'
import { BananoUtil } from '@bananocoin/bananojs'
import { FAUCET_SEED } from '$env/static/private'
import { PUBLIC_FAUCET_ADDRESS, PUBLIC_CLAIM_COOLDOWN } from '$env/static/public'
import { sendBanano, bananoDecimalToRaw, relatedToBlacklist } from '$/requests/node'

type ClaimTicket = {
    account?: string,
    amount?: string,
    valid: boolean,
    error?: string,
}

///// after captcha hash acc + captcha something and have timelimit in which this ticket can be claimed? 
// use svelte error

export async function GET(request): Promise<Response> {
    const params = new URL(request.url).searchParams

    const account = params.get('address')!
    const ct = Number(request.cookies.get('ct')) || 0
    const ticket = await checkTicket(account, ct)
    if (!ticket.valid) return json(ticket.error)
    // const block = await sendBanano(PUBLIC_FAUCET_ADDRESS, FAUCET_SEED, ticket.account, ticket.amount)
    // set the new cookie to header
    // let response = json(block)
    let response = json(ticket)
    response.headers.append('set-cookie', `ct=${encodeURIComponent(Date.now())}; Path=/; Max-Age=${PUBLIC_CLAIM_COOLDOWN}; Secure; SameSite=Strict`)
    // update account in db
    // await updateAccount(account)
    return response
}

async function checkTicket(account: string | null, ct: number): Promise<ClaimTicket> {
    // check if banano address given
    if (!account) {
        return finishTicket('', 'no banano address was given')
    }
    // check if banano address is valid
    const validAddress = BananoUtil.getBananoAccountValidationInfo(account).valid
    if (!validAddress) {
        return finishTicket(account, 'invalid banano address was given')
    }
    // check if banano address is related to the blacklist
    // if (await relatedToBlacklist(account)) {
    //     return finishTicket(account, 'banano address not viable')
    // }
    //
    // check the users' cookie
    if (Number(ct) + Number(PUBLIC_CLAIM_COOLDOWN) > Date.now()) {
        const remaining = getRemaining(ct)
        console.log(remaining)
        return finishTicket(account, `claim not yet available, ${remaining} remaining`)
    }
    //
    // check db timestamp
    // const claim = await getClaimInfo(account)
    // if (claim?.timestamp) {
    //     const remaining = calcRemaining(claim.timestamp)
    //     if (remaining > 0) {
    //         return finishTicket(account, `claim not yet available, ${toReadable(remaining)} remaining`)
    //     }
    // }
    return finishTicket(account)
}

function finishTicket(account: string, error?: string): ClaimTicket {
    error = error ? 'error: ' + error : error
    return {
        account: account,
        amount: account ? getClaimAmount(account) : '0',
        valid: !error,
        error: error,
    }
}

function getClaimAmount(account: string): string {
    // check if account unopened
    // check other stuff
    let reward = (0.019).toString()
    return bananoDecimalToRaw(reward)
}

function getRemaining(timestamp: number): string {
    const nextClaim = timestamp + Number(PUBLIC_CLAIM_COOLDOWN)
    const remaining = nextClaim - Date.now()
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
    return `Remaining time: ${hours}:${minutes}:${seconds}`
}

function toReadable(ms: number): string {
    return new Date(Date.now() + ms).toLocaleTimeString('de-DE')
}
