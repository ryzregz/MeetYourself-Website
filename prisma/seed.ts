import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { seedBooks, seedRecordings, seedWebinars } from "./seed-data";

const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  // Admin user — idempotent, so re-running the seed never resets the password
  // of an admin who has already changed it.
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in .env before seeding — see .env.example."
    );
  }
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.adminUser.create({
      data: { email, passwordHash, name: "Admin" },
    });
    console.log(`Created admin user: ${email}`);
  } else {
    console.log(`Admin user already exists: ${email}`);
  }

  // Content — only seed if the tables are empty, so re-running the seed never
  // duplicates or overwrites content an admin has since edited.
  if ((await prisma.webinar.count()) === 0) {
    for (const w of seedWebinars) {
      await prisma.webinar.create({ data: { ...w, status: "upcoming" } });
    }
    console.log(`Seeded ${seedWebinars.length} webinars`);
  }

  if ((await prisma.recording.count()) === 0) {
    for (const r of seedRecordings) {
      await prisma.recording.create({ data: r });
    }
    console.log(`Seeded ${seedRecordings.length} recordings`);
  }

  if ((await prisma.book.count()) === 0) {
    for (const b of seedBooks) {
      await prisma.book.create({ data: b });
    }
    console.log(`Seeded ${seedBooks.length} books`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
