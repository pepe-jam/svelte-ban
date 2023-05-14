import blake from 'blakejs'

const SEED_ALPHABET_REGEX_STR = '^[0123456789abcdefABCDEF]{64}$'

export function getPrivateKey(seed: string, seedIndex: number) {
    if (seed === undefined) {
        throw Error('seed is a required parameter.')
    }
    if (seedIndex === undefined) {
        throw Error('seedIndex is a required parameter.')
    }
    const isValid = seedValid(seed)
    if (!isValid.valid) {
        throw Error(`Invalid BANANO seed '${seed}', ${isValid.message}`)
    }
    const seedBytes = hexToBytes(seed)
    const accountBytes = generateAccountSecretKeyBytes(seedBytes, seedIndex)
    return bytesToHex(accountBytes)
}

function seedValid(seed: string) {
    const regex = new RegExp(SEED_ALPHABET_REGEX_STR)
    const isValid = regex.test(seed)
    return {valid: isValid, message: isValid ? '' : `does not match regex '${SEED_ALPHABET_REGEX_STR}'`}
}

function generateAccountSecretKeyBytes(seedBytes: Uint8Array, accountIndex: number) {
    const accountBytes = hexToUint8(decToHex(accountIndex, 4))
    const context = blake.blake2bInit(32)
    blake.blake2bUpdate(context, seedBytes)
    blake.blake2bUpdate(context, accountBytes)
    const newKey = blake.blake2bFinal(context)
    return newKey
}

function hexToBytes(hex: string) {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16)
    }
    return bytes
}

function bytesToHex(bytes: Uint8Array) {
    return Array.prototype.map
        .call(bytes, (x) => ('00' + x.toString(16)).slice(-2))
        .join('')
        .toUpperCase()
}

function hexToUint8(hexValue: string) {
    const length = (hexValue.length / 2) | 0
    const uint8 = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
        uint8[i] = parseInt(hexValue.substr(i * 2, 2), 16)
    }
    return uint8
}

function decToHex(decValue: number, byteCount = 4) {
    const dec = decValue.toString().split('')
    const sum = []
    let hex = ''
    const hexArray = []
    let i
    let s
    while (dec.length) {
      s = 1 * Number(dec.shift())
      for (i = 0; s || i < sum.length; i++) {
        s += (sum[i] || 0) * 10
        sum[i] = s % 16
        s = (s - sum[i]) / 16
      }
    }
    while (sum.length) {
      hexArray.push(sum.pop()!.toString(16))
    }

    hex = hexArray.join('')

    if (hex.length % 2 != 0) {
      hex = '0' + hex
    }

    if (byteCount > hex.length / 2) {
      const diff = byteCount - hex.length / 2
      for (let j = 0; j < diff; j++) {
        hex = '00' + hex
      }
    }
    return hex
  }