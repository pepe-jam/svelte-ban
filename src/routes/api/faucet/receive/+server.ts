import { json} from '@sveltejs/kit'
import { FAUCET_SEED } from '$env/static/private'
import { PUBLIC_FAUCET_ADDRESS } from '$env/static/public'
import { receiveBanano } from 'requests/node'

export async function GET(request: Request) {
    try {
        const receivedBlocks = await receiveBanano(PUBLIC_FAUCET_ADDRESS, FAUCET_SEED)
        return json(receivedBlocks)
    }
    catch (error) {
        console.error(error)
    }
}