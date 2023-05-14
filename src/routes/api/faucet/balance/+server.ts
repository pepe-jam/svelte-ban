import { json} from '@sveltejs/kit'
import { PUBLIC_FAUCET_ADDRESS } from '$env/static/public'
import { getAccountBalance } from '$/requests/node'

// use svelte error

export async function GET(request: Request) {
    const balance = await getAccountBalance(PUBLIC_FAUCET_ADDRESS)
    return json(balance)
}