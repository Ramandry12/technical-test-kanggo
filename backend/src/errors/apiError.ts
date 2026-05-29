export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: any[] | null;

  constructor(
    message: string,
    statusCode: number,
    errors: any[] | null = null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(
    message: string = "Permintaan tidak valid.",
    errors: any[] | null = null,
  ) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(
    message: string = "Tidak diizinkan. Silakan login terlebih dahulu.",
  ) {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Akses ditolak.") {
    super(message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Sumber daya tidak ditemukan.") {
    super(message, 404);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Terjadi kesalahan internal server.") {
    super(message, 500);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Konflik pada sumber daya database.") {
    super(message, 409);
  }
}
