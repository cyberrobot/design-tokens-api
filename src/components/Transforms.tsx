import Link from 'next/link';
import { useEffect } from 'react';
import { FaRegWindowRestore } from 'react-icons/fa6';
import { useTransformsStore } from '~/stores/use-transforms';
import { api } from '~/utils/api';

export default function Transforms({ importId }: { importId: string }) {
  const query = api.transforms.getTransforms.useQuery({
    importId,
    count: 1
  });
  const transformId: string = useTransformsStore(state => state.currentTransformId)

  useEffect(() => {
    const refetch = async () => {
      await query.refetch()
    }
    if (transformId && query.data?.[0]?.id !== transformId) {
      refetch().catch(err => console.log(err))
    }
  }, [query, query.data, transformId])


  return (
    <div>{query.data?.map((transform, tI) => {
      return <div key={`transform-${tI}`}>
        <div className="text-gray-400 mb-2">Id: {transform.id}</div>
        <div className="text-gray-400 mb-2">Created: {transform.createdAt.toLocaleDateString()} - {transform.createdAt.toLocaleTimeString()}</div>
        <div className="flex gap-6">
          {transform.platforms.map((platform, pI) => {
            return (
              <div key={`platform-${pI}`}>
                <h3 className="text-lg font-bold tracking-tight mb-2">{platform.name}</h3>
                <div>{platform.formats.map((format, fI) => {
                  return (
                    <div key={`format-${fI}`} className="mb-2">
                      {format.url && <div className="w-full flex gap-1 items-center"><Link href={format.url} target='_blank' className="link link-hover whitespace-nowrap">{format.name}</Link><span className="text-gray-400"><FaRegWindowRestore size="12" /></span></div>}
                    </div>
                  )
                })}</div>

              </div>
            )
          })}
        </div>
      </div>
    })}
      <div className="border-t-[1px] border-gray-500 mt-4 -ml-4 -mr-4 p-4 pb-0">
        <Link href={`/tokens/${importId}/transforms`} className="link link-hover">All transforms</Link>
      </div>
    </div>
  )
}
