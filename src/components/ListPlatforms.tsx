import { FaXmark } from 'react-icons/fa6';
import { usePlatformStore } from '~/stores/use-platform';

export default function ListPlatforms() {
  const { platforms, removePlatform } = usePlatformStore((state) => state);
  const hasPlatforms = platforms.length > 0;

  if (!hasPlatforms) {
    return <></>
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Transform</th>
            <th>Formats</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((platform, index) => {
            return (
              <tr key={`platform-${platform.name}-${index}`}>
                <td>{platform.name}</td>
                <td>{platform.transformGroup}</td>
                <td>{platform.formats.join(', ')}</td>
                <td className='text-center'><button className='btn btn-xs btn-ghost' onClick={() => removePlatform(platform)}><FaXmark /></button></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
