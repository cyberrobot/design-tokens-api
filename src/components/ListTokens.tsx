import { type Imports } from '@prisma/client'

export default function ListTokens({ tokens }: {
  tokens: Imports[]
}) {
  return (
    <span className="text-accent">{tokens.map(token => token.name).join(', ')}</span>
  )
}
