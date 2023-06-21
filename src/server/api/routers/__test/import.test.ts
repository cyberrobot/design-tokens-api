import { appRouter } from "~/server/api/root";
import { type FileImport } from "@prisma/client";
import { prismaMock } from "../../../../../singleton";

test("import", async () => {
  const mockFileImport: FileImport = {
    id: "test",
    file: "test",
    createdAt: new Date(),
  };

  prismaMock.fileImport.create.mockResolvedValue(mockFileImport);

  const caller = appRouter.createCaller({
    prisma: prismaMock,
  });

  const result = await caller.import.file(mockFileImport);

  expect(result.file).toStrictEqual(mockFileImport.file);
});
