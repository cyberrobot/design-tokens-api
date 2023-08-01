import { type Import } from '@prisma/client'

export default function ListTokens({ tokens }: {
  tokens: Import[]
}) {
  return (
    <span className="text-accent">{tokens.map(token => token.name).join(', ')}</span>
  )
}
