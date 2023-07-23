import ListTokens from './ListTokens'

export default function TokenContent({ token, body }: { token: string, body: string }) {
  return (
    <>
      <div className="my-4">
        <ListTokens tokens={[{ id: token }]} />
      </div>
      <pre className="text-sm py-4">{body}</pre></>
  )
}
