import React from 'react';

function Modal({ heading, body, components, isOpen = false, onClose }: {
  heading?: string, body?: string, components?: {
    Heading?: React.ElementType;
    Body?: React.ElementType;
    Footer?: React.ElementType;
  },
  isOpen?: boolean,
  onClose?: () => void
}) {
  return (
    <dialog id="modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <form method="dialog" className="modal-box max-w-3xl">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
        {components?.Heading ? <components.Heading /> : <h3 className="font-bold text-lg">{heading}</h3>}
        {components?.Body ? <components.Body /> : <p className="py-4">{body}</p>}
        {components?.Footer && <div className="modal-action">
          <components.Footer />
        </div>}
      </form>
    </dialog>
  )
}

export default Modal