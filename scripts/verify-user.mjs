import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

p.user
  .update({
    where: { email: "ritjiishaku@gmail.com" },
    data: { emailVerified: new Date() },
  })
  .then(() => {
    console.log("Email verified successfully");
    return p.$disconnect();
  });
