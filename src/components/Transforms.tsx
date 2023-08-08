import Link from 'next/link';
import { useEffect } from 'react';
import { useTransformsStore } from '~/stores/use-transforms';
import { api } from '~/utils/api';
import Transform from './Transform';

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
        <Transform transform={transform} />
      </div>
    })}
      <div className="border-t-[1px] border-gray-500 mt-4 -ml-4 -mr-4 p-4 pb-0">
        <Link href={`/tokens/${importId}/transforms`} className="link link-hover">All transforms</Link>
      </div>
    </div>
  )
}
