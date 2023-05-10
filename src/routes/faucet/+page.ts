import type { PageLoad } from './$types';
import { PUBLIC_FAUCET_ADDRESS } from '$env/static/public'

export const load = (async ({ fetch }) => {
    const getIp = async () => {
        const result = await fetch('/api/ip')
        const ip = await result.json()
        return {
            ip: ip
        }
    }

    const getFaucetAddress = () => {
        return {
            FAUCET_ADDRESS: PUBLIC_FAUCET_ADDRESS,
        }
    }

    return {
        ip: getIp(),
        faucetAddress: getFaucetAddress()
    }

}) satisfies PageLoad