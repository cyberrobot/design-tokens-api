import React, { Children } from "react";
import { useEffect, useRef, useState } from "react";
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
export type DropdownProps<T> = {
  items: React.JSX.Element;
  labelBy?: keyof T;
  multiSelect?: boolean;
  placeholder?: string;
  persistPlaceholder?: boolean;
  defaultItems?: T[];
  closeOnSelect?: boolean;
  type?: TButtonStyleType;
  size?: TButtonSize;
  className?: string;
  direction?: TDropdownDirection;
};

const resolveClassNameForDirection = (direction: TDropdownDirection) => {
  switch (direction) {
    case "left":
      return "";
    case "right":
      return "dropdown-end";
  }
};

export default function Dropdown<T extends string | unknown>({
  items,
  labelBy,
  multiSelect = false,
  placeholder = "Select",
  persistPlaceholder = false,
  defaultItems,
  closeOnSelect = true,
  type = "outline",
  size = "md",
  className = "",
  direction = "left",
  header,
}: {
  items: React.JSX.Element;
  labelBy?: keyof T;
  multiSelect?: boolean;
  placeholder?: string;
  persistPlaceholder?: boolean;
  defaultItems?: T[];
  closeOnSelect?: boolean;
  type?: TButtonStyleType;
  size?: TButtonSize;
  className?: string;
  direction?: TDropdownDirection;
  header?: React.ReactNode;
}) {
  const [selectedItems, setSelectedItems] = useState<T[]>(defaultItems || []);
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (defaultItems) {
      setSelectedItems(defaultItems);
    }
  }, [defaultItems]);

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
                  .map((item) => (labelBy ? item[labelBy] : item))
                  .join(", ")
              : placeholder}
          </span>
          <FaChevronDown />
        </summary>
        <div className="dropdown-content  z-[1] mt-1  max-h-[270px] overflow-y-auto rounded-md bg-base-300 shadow">
          <div className="text-sm">{header && header}</div>
          <ul className="menu flex flex-col flex-nowrap p-2">
            {items &&
              Children.map(items, (item: React.ReactNode, index: number) => (
                <li
                  onClick={() => {
                    if (closeOnSelect) {
                      menuRef.current?.removeAttribute("open");
                    }
                  }}
                  key={`dropdown-item-${index}`}
                  className="w-full"
                >
                  {item}
                </li>
              ))}
          </ul>
        </div>
      </details>
    </OutsideClickHandler>
  );
}
