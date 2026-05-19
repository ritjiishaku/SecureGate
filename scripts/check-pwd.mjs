import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

p.user
  .findUnique({
    where: { email: "ritjiishaku@gmail.com" },
    select: { password: true },
  })
  .then((user) => {
    if (!user) {
      console.log("User not found");
      return p.$disconnect();
    }
    console.log("Stored hash:", user.password);
    return bcrypt.compare("Test123!", user.password).then((match) => {
      console.log("Password matches Test123!:", match);
      return p.$disconnect();
    });
  });
