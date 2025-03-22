export class ApiError extends Error {
  status: number;
  title: string;
  constructor(status: number, message: string, title: string) {
    super(message);
    this.title = title;
    this.status = status;
  }

  static notFound(message: string = "Route not found") {
    return new ApiError(404, message, "NotFound");
  }

  static duplicatedEmail(message: string = "Email already exist") {
    return new ApiError(409, message, "DuplicateEmail");
  }

  static invalidCredentials(message: string = "Invalid credentials") {
    return new ApiError(401, message, "InvalidCredentials");
  }

  static badRequest(message: string = "Bad request") {
    return new ApiError(400, message, "BadRequest");
  }

  static forbidden(message: string = "Forbidden") {
    return new ApiError(403, message, "Forbidden");
  }
}
