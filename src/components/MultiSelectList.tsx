import React, { useCallback, useEffect, useState } from "react";

export type MultiSelectListProps<T> = {
  items?: T[];
  defaultItems?: T[];
  labelBy?: keyof T;
  onSelect?: (selectedItems: T[]) => void;
  header?: React.ReactNode;
};

export const MultiSelectList = <T extends string | unknown>({
  items,
  defaultItems,
  labelBy,
  onSelect,
  header,
}: MultiSelectListProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>(defaultItems || []);
  const selectHandler = useCallback(
    (item: T, checked: boolean) => {
      setSelectedItems(
        checked
          ? [...selectedItems, item]
          : [...selectedItems.filter((filteredItem) => item !== filteredItem)]
      );
    },
    [selectedItems]
  );
  const getComponentItems = useCallback(
    () =>
      items?.map((item, index) => {
        let match;
        if (selectedItems) {
          match = selectedItems.find((selectedItem) => selectedItem === item);
        }
        const label = (labelBy ? item[labelBy] : item) as string;

        return (
          <div
            key={`format-option-${index}`}
            className=" max-w-[260px] whitespace-nowrap rounded-md"
          >
            <label className="flex w-full cursor-pointer items-center">
              <input
                checked={!!match}
                onChange={(e) => selectHandler(item, e.target.checked)}
                type="checkbox"
                className="checkbox checkbox-xs mr-2 p-0"
              />
              {label}
            </label>
          </div>
        );
      }),
    [items, selectedItems, labelBy, selectHandler]
  );
  useEffect(() => {
    if (onSelect) {
      onSelect(selectedItems);
    }
    getComponentItems();
  }, [getComponentItems, onSelect, selectedItems, items]);

  useEffect(() => {
    if (defaultItems) {
      setSelectedItems(defaultItems);
    }
  }, [defaultItems]);
  return (
    <>
      {header && header}
      {getComponentItems()}
    </>
  );
};
