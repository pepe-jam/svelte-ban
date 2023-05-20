import type { PageLoad } from './$types';
import { PUBLIC_FAUCET_ADDRESS } from '$env/static/public'

export const load = (async ({ fetch, data }) => {
    const getIp = async () => {
        const result = await fetch('/api/ip')
        const ip = await result.json()
        return ip
    }

    const getFaucetAddress = () => {
        return PUBLIC_FAUCET_ADDRESS
    }

    return {
        ip: await getIp(),
        faucetAddress: getFaucetAddress(),
        ct: data.ct,
    }
}) satisfies PageLoad