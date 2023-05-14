import { json } from '@sveltejs/kit'

interface Claim {
    account: string
    timestamp: number
    amount: number
}

let claims: Claim[] = [
    { account: 'ban_3banobotojqz8pkm1uectwb8baqjkfhq38e6fbwdrp51qjnwemepzc4ytowy', timestamp: 1680321320462, amount: 1 },
    { account: 'ban_36aauqwe6s3dibw9c3j1yxwxtz88bnxwjhjhao1tad3hjzyhgjf9urn1ctzw', timestamp: 1683367108069, amount: 8 },
]


export async function GET(request: Request) {
    function updateAccount(account: string) {
        claims = claims.map((claim) => {
            if (claim.account === account) {
                return {
                    ...claim,
                    amount: claim.amount + 1,
                    timestamp: Date.now(),
                }
            }
            return claim
        })
        // save attribute: avg time between claims?
    }

    function getClaimInfo(account: string) {
        return claims.filter(claim => claim.account === account)
    }

    function getAll() {
        return claims
    }
    const response = claims
    return json(response)
}