import { json} from '@sveltejs/kit'
import { FAUCET_SEED } from '$env/static/private'
import { PUBLIC_FAUCET_ADDRESS } from '$env/static/public'
import { sendBanano, receiveBanano, getAccountBalance } from '$/requests/node'

// use svelte error

export async function GET(request: Request) {
    const receivedBlocks = await receiveBanano(PUBLIC_FAUCET_ADDRESS, FAUCET_SEED)
    return json(receivedBlocks)
}