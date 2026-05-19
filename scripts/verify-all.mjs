import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

p.user
  .updateMany({
    where: { emailVerified: null },
    data: { emailVerified: new Date() },
  })
  .then((result) => {
    console.log(`Verified ${result.count} users`);
    return p.$disconnect();
  });
