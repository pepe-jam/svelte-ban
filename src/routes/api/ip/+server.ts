import { json} from '@sveltejs/kit'

export async function GET(request: Request) {
    let ip
    try {
        ip = request.headers.get('x-forwarded-for')
    } catch (e) {
        console.error("User IP could not be extracted from 'x-forwarded-for' header")
    }
    if (!ip) ip = await getIP()
    return json(ip)
}

async function getIP() {
    const url = 'https://api.ipify.org?format=json'
    const result = await fetch(url)
    const ip = (await result.json()).ip
    return ip
}