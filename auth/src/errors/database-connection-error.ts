import { CustomError } from "./custom-errors";


export class DatabaseConnectionError extends CustomError {
    statusCode: number = 500;
    reason: string = "Failed to connect to the database"

    constructor() {
        super('Error connecting to the database');

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{message: this.reason}];
    }
}