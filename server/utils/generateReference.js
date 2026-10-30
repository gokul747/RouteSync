import { randomBytes } from 'node:crypto'
export default function generateReference(){return `RS-${new Date().getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`}
