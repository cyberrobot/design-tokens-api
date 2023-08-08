import { Highlight, themes } from "prism-react-renderer"

export default function TokenContent({ body }: { body: string }) {
  return (
    <Highlight theme={themes.vsDark} code={body} language='jsx'>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style} className="p-4 rounded-md">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="mr-4 select-none">{i + 1}</span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}
