import { claims } from '$/db/claims'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async function () {
    const data = await claims.find({}, { limit: 10, projection: { _id: 0 } }).toArray()
    console.log('data ', data)
    return {
        claims: data
    }
}

