export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404)
    }
}

export class AlreadyExistsError extends AppError {
    constructor(message = "Resource exist") {
        super(message, 409)
    }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You don not have permission to perform this action") {
    super(message, 403);
  }
}