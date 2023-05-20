import { json } from '@sveltejs/kit'

export async function GET(request: Request) {
    let ip = request.headers?.get('x-forwarded-for')?.split(',')[0]
    if (!ip) ip = await getIP()
    return json(ip)
}

async function getIP() {
    const url = 'https://api.ipify.org?format=json'
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        return data.ip
    }
    catch (error) {
        console.error(error)
        return '0.0.0.0'
    }
}