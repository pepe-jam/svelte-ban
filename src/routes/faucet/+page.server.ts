// import { claims } from 'db/claims'
import type { PageServerLoad } from './$types'

export const load = (async ({ cookies }) => {

    const getClaimTime = () => {
        const ct = cookies.get('ct') || '0'
        return ct
    }

    return {
        ct: getClaimTime(),
    }
}) satisfies PageServerLoad