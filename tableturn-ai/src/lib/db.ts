/**
 * TableTurn AI — Prisma 7 client singleton
 *
 * Prisma 7 requires an adapter for direct database connections.
 * We use @prisma/adapter-pg with the pg driver.
 */

import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    // In build/test contexts without a DB, return a client that will fail at query time
    const adapter = new PrismaPg({ connectionString: 'postgresql://localhost/placeholder' })
    return new PrismaClient({ adapter })
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}

export default db
