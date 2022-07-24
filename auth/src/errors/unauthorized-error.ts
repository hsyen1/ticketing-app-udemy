import { CustomError } from "./custom-errors";

export class UnauthorizedError extends CustomError {
  statusCode: number = 401;

  constructor() {
    super("Not authorized");

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: "Not authorized" }];
  }
}
