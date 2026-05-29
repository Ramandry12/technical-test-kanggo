import { Request, Response, NextFunction } from "express";
import { RegisterInput, LoginInput } from "../validators/authValidator";
import * as authService from "../services/authService";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = req.body as RegisterInput;
    const user = await authService.registerUser(input);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = req.body as LoginInput;
    const authData = await authService.loginUser(input);

    res.status(200).json({
      success: true,
      message: "Login berhasil.",
      data: authData,
    });
  } catch (error) {
    next(error);
  }
};
