import { useRef } from 'react';
import { host } from '~/constants';
import CopyToClipboard from './CopyToClipboard';

export default function EndpointDisplay({ query }: { query: unknown }) {
  const trpcQuery = {
    "0": {
      json: query
    }
  }
  const spanRef = useRef<HTMLDivElement>(null);
  const url = `${host}/api/trpc/tokens.getToken?batch=1&input=${JSON.stringify(trpcQuery).trim()}`;
  return (
    <div className='p-4'>
      <div className='mb-2'>Change the export config to update the endpoint query parameters.</div>
      <div className='mb-2'>GET</div>
      <div ref={spanRef} className='relative border-[1px] border-base-200 rounded-md p-4 pr-14 text-sm break-all'>
        <div className="absolute top-0 right-0 inline-block">
          <CopyToClipboard content={url} styles='rounded-tr-md rounded-tl-none rounded-br-none' />
        </div>
        {url}
      </div>
    </div>
  )
}
