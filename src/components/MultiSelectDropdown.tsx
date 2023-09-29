import { useState } from "react";
import { MultiSelectList, type MultiSelectListProps } from "./MultiSelectList";
import Dropdown, { type DropdownProps } from "./Dropdown";

export type TMultiSelectDropdownProps<T> = MultiSelectListProps<T> & {
  className?: string;
  placeholder?: string;
};

export const MultiSelectDropdown = <T extends string | unknown>({
  defaultItems,
  labelBy,
  className,
  placeholder,
  items,
  header,
  onSelect: onSelectProp,
}: TMultiSelectDropdownProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>(defaultItems || []);
  const onSelect = (selectedItems: T[]) => {
    if (onSelectProp) {
      onSelectProp(selectedItems);
    }
    setSelectedItems(selectedItems);
  };
  const multiSelectProps: MultiSelectListProps<T> = {
    items,
    labelBy,
    onSelect,
    defaultItems,
    header,
  };
  const dropdownProps: DropdownProps<T> = {
    items: <MultiSelectList {...multiSelectProps} onSelect={onSelect} />,
    labelBy,
    multiSelect: true,
    persistPlaceholder: true,
    placeholder,
    defaultItems: selectedItems,
    className,
    closeOnSelect: false,
  };
  return <Dropdown<T> {...dropdownProps} />;
};
