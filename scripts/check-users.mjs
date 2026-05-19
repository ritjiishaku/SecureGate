import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

p.user
  .findMany({
    select: { email: true, emailVerified: true },
  })
  .then((users) => {
    console.log(JSON.stringify(users, null, 2));
    return p.$disconnect();
  });
