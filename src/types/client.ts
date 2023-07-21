export type { Tokens } from "~/types/server";

export type DefaultProps<T> = {
  [K in keyof T]: T[K];
};

export type TSelect<T> = {
  defaultValues: T[];
};
