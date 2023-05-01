import { json} from '@sveltejs/kit'

export async function GET(request: Request) {
    let ip = request.headers?.get('x-forwarded-for')?.split(',')[0]
    if (!ip) ip = await getIP()
    return json(ip)
}

async function getIP() {
    const url = 'https://api.ipify.org?format=json'
    const result = await fetch(url)
    const ip = (await result.json()).ip
    return ip
}