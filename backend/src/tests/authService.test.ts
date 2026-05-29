import * as authService from "../services/authService";
import prisma from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ConflictError, UnauthorizedError } from "../errors/apiError";

jest.mock("../config/database", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
    process.env.JWT_EXPIRES_IN = "1h";
    process.env.SALT_ROUNDS = "10";
  });

  describe("registerUser", () => {
    const mockInput = {
      name: "Test User",
      email: "test@domain.com",
      password: "password123",
    };

    it("should register a new user successfully", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");

      const mockCreatedUser = {
        id: 1,
        name: mockInput.name,
        email: mockInput.email,
        createdAt: new Date(),
      };
      (prisma.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await authService.registerUser(mockInput);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockInput.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockInput.password, 10);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedUser);
    });

    it("should throw ConflictError if email is already registered", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(authService.registerUser(mockInput)).rejects.toThrow(
        ConflictError,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    const mockInput = {
      email: "test@domain.com",
      password: "password123",
    };

    const mockUser = {
      id: 1,
      name: "Test User",
      email: "test@domain.com",
      password: "hashed_password",
    };

    it("should log in user and return token successfully", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (jwt.sign as jest.Mock).mockReturnValue("mock_token");

      const result = await authService.loginUser(mockInput);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockInput.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockInput.password,
        mockUser.password,
      );
      expect(jwt.sign).toHaveBeenCalled();
      expect(result.token).toBe("mock_token");
      expect(result.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    it("should throw UnauthorizedError if email is not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.loginUser(mockInput)).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it("should throw UnauthorizedError if password is invalid", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.loginUser(mockInput)).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });
});
