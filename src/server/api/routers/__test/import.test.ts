import { appRouter } from "~/server/api/root";
import { type Imports } from "@prisma/client";
import { prismaMock } from "../../../../../singleton";

test("import", async () => {
  const mockImport: Imports = {
    id: "test",
    file: "test",
    createdAt: new Date(),
    name: "name",
    description: "description",
  };

  prismaMock.imports.create.mockResolvedValue(mockImport);

  const caller = appRouter.createCaller({
    prisma: prismaMock,
  });

  const result = await caller.import.file(mockImport);

  expect(result).toStrictEqual(mockImport.file);
});
