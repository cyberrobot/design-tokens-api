import { type FormEvent, useRef, useState } from "react";
import Dropdown from "./Dropdown";
import { transformGroups, formats } from "~/constants";
import { usePlatformStore } from "~/stores/use-platform";

export default function AddPlatform() {
  const [transformGroupInState, setTransformGroupInState] = useState([]);
  const [formatsInState, setFormatsInState] = useState([]);
  const addPlatform = usePlatformStore((state) => state.addPlatform);
  const nameRef = useRef<HTMLInputElement>(null);
  const transformGroupRef = useRef<HTMLInputElement>(null);
  const formatsRef = useRef<HTMLInputElement>(null);
  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasValues =
      nameRef.current?.value !== "" &&
      transformGroupRef.current?.value !== "" &&
      formatsRef.current?.value !== "";
    if (
      hasValues &&
      nameRef.current &&
      transformGroupRef.current &&
      formatsRef.current
    ) {
      addPlatform({
        name: nameRef.current.value,
        transformGroup: transformGroupRef.current.value,
        formats: formatsRef.current.value.split(", "),
      });
      setTransformGroupInState([]);
      setFormatsInState([]);
      nameRef.current.value = "";
      transformGroupRef.current.value = "";
      formatsRef.current.value = "";
    }
  };

  return (
    <form className="flex gap-4" onSubmit={onSubmitHandler}>
      <input
        ref={nameRef}
        type="text"
        name="transform.name"
        className="flex-grow-1 input-bordered input w-[100%]"
        placeholder="Transform name"
        onChange={(e) => {
          if (nameRef.current) {
            nameRef.current.value = e.target.value;
          }
        }}
      />
      <Dropdown<string>
        className="min-w-[170px] border-base-200"
        value={transformGroups}
        placeholder="Transform group"
        onSelect={(selectedItems) => {
          if (transformGroupRef.current) {
            transformGroupRef.current.value = selectedItems[0] || "";
          }
        }}
        defaultValue={transformGroupInState}
      />
      <input
        ref={transformGroupRef}
        type="hidden"
        name="transform.transformGroup"
      />
      <Dropdown<string>
        className="min-w-[170px] border-base-200"
        value={formats}
        multiSelect
        placeholder="Formats"
        onSelect={(selectedItems) => {
          if (formatsRef.current) {
            formatsRef.current.value = selectedItems.join(", ");
          }
        }}
        defaultValue={formatsInState}
      />
      <input ref={formatsRef} type="hidden" name="transform.formats" />
      <button type="submit" className="btn-outline btn">
        Add
      </button>
    </form>
  );
}
