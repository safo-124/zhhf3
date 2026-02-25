import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2] || "admin@zhhf.org";
  const password = process.argv[3] || "admin123";

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role: "admin" },
    create: {
      email,
      name: "Admin",
      role: "admin",
      password: hashed,
    },
  });

  console.log(`✅ Admin password set for ${user.email} (id: ${user.id})`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
