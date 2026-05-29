import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (
  schema: ZodSchema,
  source: "body" | "query" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);

      if (source === "query") {
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, data);
      } else {
        req.body = data;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validasi gagal",
          errors,
        });
        return;
      }
      next(error);
    }
  };
};
