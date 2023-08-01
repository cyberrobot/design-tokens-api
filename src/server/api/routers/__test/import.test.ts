import { appRouter } from "~/server/api/root";
import { type Import } from "@prisma/client";
import { prismaMock } from "../../../../../singleton";

test("import", async () => {
  const mockImport: Import = {
    id: "test",
    file: "test",
    createdAt: new Date(),
    name: "name",
    description: "description",
  };

  prismaMock.import.create.mockResolvedValue(mockImport);

  const caller = appRouter.createCaller({
    prisma: prismaMock,
  });

  const result = await caller.import.file(mockImport);

  expect(result.file).toStrictEqual(mockImport.file);
});
