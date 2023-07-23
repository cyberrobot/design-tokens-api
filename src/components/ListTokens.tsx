
export default function ListTokens({ tokens }: {
  tokens: {
    id: string
  }[]
}) {
  return (
    <span className="text-accent">{tokens.map(token => token.id).join(', ')}</span>
  )
}
