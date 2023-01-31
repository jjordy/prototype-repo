import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      address_1: "test",
      zip_code: "39507",
      owned_tickets: {
        create: {
          title: "Ticket 1",
          status: "TODO",
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      name: "Bob",
    },
  });
  console.log({ alice, bob });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
