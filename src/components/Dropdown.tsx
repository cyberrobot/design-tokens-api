import { useCallback, useEffect, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import OutsideClickHandler from 'react-outside-click-handler';

export default function Dropdown<T extends string>({ value = [], multiSelect = false, placeholder = 'Select', onSelect, defaultValue, closeOnSelect = true }: { value: T[], multiSelect?: boolean, placeholder?: string, onSelect?: (selectedItems: T[]) => void, defaultValue?: T[], closeOnSelect?: boolean }) {
  const [selectedItems, setSelectedItems] = useState<T[]>(defaultValue || [])
  const menuRef = useRef<HTMLDetailsElement>(null);

  const multiSelectHandler = useCallback((item: T, checked: boolean) => {
    setSelectedItems(
      checked ? [...selectedItems, item] : [...selectedItems.filter(filteredItem => item !== filteredItem)]
    );
  }, [selectedItems])

  const singleSelectHandler = useCallback((item: T) => {
    setSelectedItems(
      [item]
    );
    if (closeOnSelect) {
      menuRef.current?.removeAttribute('open')
    }
  }, [])

  const getItems = useCallback(() => value?.map(item => {
    let match;
    if (selectedItems) {
      match = selectedItems.find(selectedItem => selectedItem === item);
    }

    return <li key={`format-option-${item}`} className="flex flex-row items-center flex-nowrap whitespace-nowrap max-w-[260px]">
      {multiSelect && <label className="p-2 w-full">
        <input checked={!!match} onChange={e => multiSelectHandler(item, e.target.checked)} type="checkbox" name="transform[formats]" className="checkbox checkbox-xs p-0 mr-2" />
        {item}
      </label>}
      {!multiSelect && <span onClick={() => singleSelectHandler(item)}>{item}</span>}
    </li>
  }), [value, multiSelect, multiSelectHandler, selectedItems, singleSelectHandler])

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedItems)
    }
    getItems();
  }, [getItems, onSelect, selectedItems])

  useEffect(() => {
    if (defaultValue) {
      setSelectedItems(defaultValue)
    }
  }, [defaultValue])

  return (
    <OutsideClickHandler onOutsideClick={() => menuRef.current?.removeAttribute('open')}>
      <details ref={menuRef} className="dropdown">
        <summary className="btn btn-outline border-base-200 normal-case min-w-[170px] justify-between"><span>{selectedItems.length && !multiSelect ? selectedItems.join(', ') : placeholder}</span><FaChevronDown /></summary>
        <ul className="dropdown-content z-[1] menu mt-1 p-2 shadow bg-base-300 rounded-box h-[270px] overflow-y-auto flex flex-col flex-nowrap">
          {getItems()}
        </ul>
      </details>
    </OutsideClickHandler>
  )
}
