import { FaCopy } from 'react-icons/fa6';

export default function CopyToClipboard({ styles, content }: { styles?: string, content: string }) {
  const copyContent = () => {
    navigator.clipboard.writeText(content).then(() => {
      console.log('Content copied to clipboard', content);
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  }
  return (
    <button className={`btn btn-ghost ${styles || ''}`} title="Copy to clipboard" onClick={() => copyContent()}><FaCopy /></button>
  )
}
