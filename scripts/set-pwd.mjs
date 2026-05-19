import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

bcrypt.hash("1991Ritjiishaku@34", 12).then((hash) => {
  return p.user.update({
    where: { email: "ritjiishaku@gmail.com" },
    data: { password: hash },
  });
}).then(() => {
  console.log("Password updated");
  return p.$disconnect();
});
