import createPrismaMock from "prisma-mock";
import { Prisma, type PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, type DeepMockProxy } from "jest-mock-extended";

import prisma from "./client";

jest.mock("./client", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
  createPrismaMock({}, Prisma.dmmf.datamodel);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
