import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { RegisterInput, LoginInput } from "../validators/authValidator";
import { ConflictError, UnauthorizedError } from "../errors/apiError";
import { JwtPayload } from "../types";

const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS || "10", 10);

export const registerUser = async (input: RegisterInput) => {
  const { name, email, password } = input;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("Email sudah terdaftar.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedError("Email atau password salah.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Email atau password salah.");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  const expiresIn = process.env.JWT_EXPIRES_IN as string;
  const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
