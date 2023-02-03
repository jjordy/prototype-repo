import client, { Prisma } from "@jjordy/data";
import crypto from "node:crypto";

const userProfileSelect = {
  id: true,
  email: true,
  name: true,
  address_1: true,
  address_2: true,
  city: true,
  state: true,
  zip_code: true,
  phone_number: true,
};

export function createPasswordHash(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
}

type NewUserArgs = Omit<Prisma.UserCreateInput, "salt" | "hash"> & {
  password: string;
  id?: number;
};

export class User {
  user: NewUserArgs | undefined;
  id: number | null = null;
  constructor(values?: NewUserArgs | number) {
    if (typeof values === "number") {
      this.id = values;
    } else {
      this.user = values;
    }
  }
  async profile() {
    if (this.id) {
      return client.user.findFirst({
        where: { id: this.id },
        select: userProfileSelect,
      });
    } else if (this.user) {
      return client.user.findFirst({
        where: { email: this.user.email },
        select: userProfileSelect,
      });
    }
    return null;
  }
  async save() {
    if (this.user) {
      const { email, password, ...rest } = this.user;
      return client.user.upsert({
        where: { email },
        update: {
          email,
          ...rest,
        },
        create: {
          email,
          ...rest,
          ...createPasswordHash(password),
        },
      });
    }
    throw new Error(
      "Attempting to save user with no defined properties is not allowed."
    );
  }
}
