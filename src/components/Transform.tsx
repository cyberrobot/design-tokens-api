import Link from 'next/link'
import { FaRegWindowRestore } from 'react-icons/fa6'
import { type TImportTransform } from '~/types/server'

export default function Transform({ transform }: { transform: TImportTransform }) {
  return (
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
  )
}
