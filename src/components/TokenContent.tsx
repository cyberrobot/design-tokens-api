import { type Imports } from '@prisma/client'
import ListTokens from './ListTokens'

export default function TokenContent({ token, body }: { token: Imports, body: string }) {
  return (
    <>
      <div className="my-4">
        <ListTokens tokens={[token]} />
      </div>
      <pre className="text-sm py-4">{body}</pre></>
  )
}
