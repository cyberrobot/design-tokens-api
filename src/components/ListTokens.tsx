import { type FileImport } from '@prisma/client'

export default function ListTokens({ tokens }: {
  tokens: FileImport[]
}) {
  return (
    <span className="text-accent">{tokens.map(token => token.name).join(', ')}</span>
  )
}
