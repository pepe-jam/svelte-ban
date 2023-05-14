import { error, json } from '@sveltejs/kit'
import { getClaimInfo, updateAccount } from '$/db/claims'
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

export async function GET(request: Request): Promise<Response> {
    const params = new URL(request.url).searchParams

    // const cookies = cookie.parse(request.headers.cookie || '')
    // cookies.set('ct', Date.now(), {
    //     path: '/',
    //     httpOnly: true,
    //     sameSite: 'strict',
    //     secure: !dev,
    //     maxAge: 60 * 60 * 24 * 30
    // });
    // console.log(request.headers.cookie)
    const account = params.get('address')!
    const ticket = await checkTicket(account)
    if (!ticket.valid) return json(ticket.error)
    // const block = await sendBanano(PUBLIC_FAUCET_ADDRESS, FAUCET_SEED, ticket.account, ticket.amount)
    // write new cookie
    //
    await updateAccount(account)
    return json(ticket)
    // return json(block)
}

async function checkTicket(account: string | null): Promise<ClaimTicket> {
    console.log('account:', account)
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
    //
    // check db timestamp
    const claim = await getClaimInfo(account)
    if (claim?.timestamp) {
        const remaining = (claim?.timestamp + Number(PUBLIC_CLAIM_COOLDOWN)) - Date.now()
        if (remaining > 0) {
            return finishTicket(account, `claim not yet available, ${toReadable(remaining)} left`)
        }
    }
    // console.log(info)
    return finishTicket(account)
}

function finishTicket(account: string, error?: string): ClaimTicket {
    error = error ? 'error: ' + error : error
    return {
        account: account,
        amount: account ? calcAmount(account) : '0',
        valid: !error,
        error: error,
    }
}

function calcAmount(account: string): string {
    // check if account unopened
    // check other stuff
    let reward = (0.019).toString()
    return bananoDecimalToRaw(reward)
}

function toReadable(ms: number): string {
    return new Date(ms).toLocaleTimeString('de-DE')
}

//set
// res.cookie('ban_time', String(Date.now()), {maxAge: 86400, sameSite: true});
// check
// if (req.cookies['ban_time']) {
//     if (Number(req.cookies['ban_time']) + claim_freq > Date.now()) {