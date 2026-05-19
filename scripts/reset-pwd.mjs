import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

bcrypt.hash("Test123!", 12).then((hash) => {
  return p.user.update({
    where: { email: "ritjiishaku@gmail.com" },
    data: { password: hash },
  });
}).then(() => {
  console.log("Password reset to: Test123!");
  return p.$disconnect();
});
