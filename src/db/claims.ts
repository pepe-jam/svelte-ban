// import db from '$/db/mongo'

// interface Claim {
//     account: string
//     timestamp: number
//     amount: number
// }

// export const claims = db.collection<Claim>('claims')

// export async function updateAccount(account: string) {
//     const amount = (await claims.findOne({ 'account': account }))?.amount || 0
//     await claims.replaceOne({ account: account }, { account: account, timestamp: Date.now(), amount: amount + 1 }, { upsert: true })
//     // save attribute: avg time between claims?
// }

// export async function getClaimInfo(account: string) {
//     return (await claims.findOne({ account: account }))
// }

// export async function getAll() {
//     const document = await claims.find().toArray()
//     console.log('claims content:\n' + document)
// }