import { Highlight, themes } from "prism-react-renderer";

export default function TokenContent({ body }: { body: string }) {
  const isEmpty = !body.trim();

  if (isEmpty) {
    return (
      <div className="rounded-md p-4 px-0">
        <span className="text-gray-400">No token found</span>
      </div>
    );
  }

  return (
    <Highlight theme={themes.vsDark} code={body} language="jsx">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre style={style} className="overflow-auto rounded-md p-4">
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
  );
}
