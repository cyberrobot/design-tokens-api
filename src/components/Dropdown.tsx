import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaChevronDown } from "react-icons/fa6";
import OutsideClickHandler from "react-outside-click-handler";

type TButtonStyleType =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "outline"
  | "link"
  | "ghost"
  | "active"
  | "disabled";
type TButtonSize = "xs" | "sm" | "md" | "lg";
type TDropdownDirection = "left" | "right";

const resolveClassNameForDirection = (direction: TDropdownDirection) => {
  switch (direction) {
    case "left":
      return "";
    case "right":
      return "dropdown-end";
  }
};

export default function Dropdown<T extends string | unknown>({
  value = [],
  labelBy,
  multiSelect = false,
  placeholder = "Select",
  persistPlaceholder = false,
  onSelect,
  defaultValue,
  closeOnSelect = true,
  type = "outline",
  size = "md",
  className = "",
  header,
  direction = "left",
}: {
  value: T[];
  labelBy?: keyof T;
  multiSelect?: boolean;
  placeholder?: string;
  persistPlaceholder?: boolean;
  onSelect?: (selectedItems: T[]) => void;
  defaultValue?: T[];
  closeOnSelect?: boolean;
  type?: TButtonStyleType;
  size?: TButtonSize;
  className?: string;
  header?: ReactNode;
  direction?: TDropdownDirection;
}) {
  const [selectedItems, setSelectedItems] = useState<T[]>(defaultValue || []);
  const menuRef = useRef<HTMLDetailsElement>(null);

  const multiSelectHandler = useCallback(
    (item: T, checked: boolean) => {
      setSelectedItems(
        checked
          ? [...selectedItems, item]
          : [...selectedItems.filter((filteredItem) => item !== filteredItem)]
      );
    },
    [selectedItems]
  );

  const singleSelectHandler = useCallback(
    (item: T) => {
      setSelectedItems([item]);
      if (closeOnSelect) {
        menuRef.current?.removeAttribute("open");
      }
    },
    [closeOnSelect]
  );

  const getItems = useCallback(
    () =>
      value?.map((item) => {
        let match;
        if (selectedItems) {
          match = selectedItems.find((selectedItem) => selectedItem === item);
        }
        const label = (labelBy ? item[labelBy] : item) as string;

        return (
          <li
            key={`format-option-${label}`}
            className="flex max-w-[260px] flex-row flex-nowrap items-center whitespace-nowrap rounded-md"
          >
            {multiSelect && (
              <label className="w-full p-2">
                <input
                  checked={!!match}
                  onChange={(e) => multiSelectHandler(item, e.target.checked)}
                  type="checkbox"
                  name="transform[formats]"
                  className="checkbox checkbox-xs mr-2 p-0"
                />
                {label}
              </label>
            )}
            {!multiSelect && (
              <span
                onClick={() => singleSelectHandler(item)}
                className="w-full"
              >
                {label}
              </span>
            )}
          </li>
        );
      }),
    [
      value,
      selectedItems,
      labelBy,
      multiSelect,
      multiSelectHandler,
      singleSelectHandler,
    ]
  );

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedItems);
    }
    getItems();
  }, [getItems, onSelect, selectedItems]);

  useEffect(() => {
    if (defaultValue) {
      setSelectedItems(defaultValue);
    }
  }, [defaultValue]);

  return (
    <OutsideClickHandler
      onOutsideClick={() => menuRef.current?.removeAttribute("open")}
    >
      <details
        ref={menuRef}
        className={`dropdown ${resolveClassNameForDirection(direction)}`}
      >
        <summary
          className={`btn btn-${type} btn-${size} justify-between normal-case ${className}`}
        >
          <span>
            {selectedItems.length && !multiSelect && !persistPlaceholder
              ? selectedItems
                  .map((item) => (labelBy ? item[labelBy] : item) as string)
                  .join(", ")
              : placeholder}
          </span>
          <FaChevronDown />
        </summary>
        <ul className="dropdown-content menu z-[1] mt-1 flex max-h-[270px] flex-col flex-nowrap overflow-y-auto rounded-md bg-base-300 p-2 shadow">
          {header && header}
          {getItems()}
        </ul>
      </details>
    </OutsideClickHandler>
  );
}
