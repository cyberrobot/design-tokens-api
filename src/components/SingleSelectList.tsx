import React, { useCallback, useEffect, useState } from "react";

export type SingleSelectListProps<T> = {
  items?: T[];
  defaultItem?: T;
  labelBy?: keyof T;
  onSelect?: (selectedItem: T) => void;
  header?: React.ReactNode;
};

export const SingleSelectList = <T extends string | null>({
  items,
  defaultItem,
  labelBy,
  onSelect,
  header,
}: SingleSelectListProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T>(defaultItem || ("" as T));
  const selectHandler = useCallback(
    (item: T) => {
      setSelectedItem(item);
    },
    [setSelectedItem]
  );
  const getLabel = useCallback(
    (item: T) => {
      if (item && labelBy && typeof item === "object" && item[labelBy]) {
        return item[labelBy];
      }

      return item;
    },
    [labelBy]
  );
  const getComponentItems = useCallback(
    () =>
      items?.map((item, index) => {
        const label = getLabel(item);

        return (
          <div
            key={`format-option-${index}`}
            className="flex max-w-[260px] flex-row flex-nowrap items-center whitespace-nowrap rounded-md"
          >
            <span onClick={() => selectHandler(item)} className="w-full">
              {label}
            </span>
          </div>
        );
      }),
    [items, selectHandler, getLabel]
  );
  useEffect(() => {
    if (onSelect) {
      onSelect(selectedItem);
    }
    getComponentItems();
  }, [getComponentItems, onSelect, selectedItem, items]);

  useEffect(() => {
    if (defaultItem) {
      setSelectedItem(defaultItem);
    }
  }, [defaultItem]);
  return (
    <>
      {header && header}
      {getComponentItems()}
    </>
  );
};
