import { claims } from '$/db/claims'
import type { PageServerLoad } from './$types'

export const load = (async ({ cookies, getClientAddress }) => {
    const getSomeDbClaims = async () => {
        const dbClaims = await claims.find({}, { limit: 10, projection: { _id: 0 } }).toArray()
        return {
            claims: dbClaims
        }
    }

    const getClaimTime = () => {
        const ct = cookies.get('ct')
        return {
            ct: ct
        }
    }

    const setClaimTime = () => {
        cookies.set('ct', Date.now().toString(), { path: '/' })
    }

    return {
        someClaims: getSomeDbClaims(),
        lastClaimTime: getClaimTime(),
        setClaimTime: setClaimTime(),
    }
}) satisfies PageServerLoad