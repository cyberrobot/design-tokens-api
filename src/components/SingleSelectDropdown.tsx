import { useState } from "react";
import Dropdown, { type DropdownProps } from "./Dropdown";
import {
  SingleSelectList,
  type SingleSelectListProps,
} from "./SingleSelectList";

export type SingleSelectDropdownProps<T> = SingleSelectListProps<T> & {
  className?: string;
  placeholder?: string;
};

export const SingleSelectDropdown = <T extends string | null>({
  defaultItem,
  labelBy,
  className,
  placeholder,
  items,
  header,
  onSelect: onSelectProp,
}: SingleSelectDropdownProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T>(
    defaultItem || (null as T)
  );
  const onSelect = (selectedItem: T) => {
    if (onSelectProp) {
      onSelectProp(selectedItem);
    }
    setSelectedItem(selectedItem);
  };
  const singleSelectProps: SingleSelectListProps<T> = {
    items,
    labelBy,
    onSelect,
    defaultItem,
    header,
  };
  const dropdownProps: DropdownProps<T> = {
    items: <SingleSelectList {...singleSelectProps} onSelect={onSelect} />,
    labelBy,
    placeholder,
    defaultItems: selectedItem ? [selectedItem] : [],
    className,
  };
  return <Dropdown<T> {...dropdownProps} />;
};
