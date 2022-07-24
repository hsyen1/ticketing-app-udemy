import {ValidationError} from 'express-validator';
import { CustomError } from './custom-errors';

export class RequestValidationError extends CustomError {
    statusCode: number = 400;

    constructor(private errors: ValidationError[]) {
        super('Invalid request parameters');

        // only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }   

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return this.errors.map(error => {
            return {message: error.msg, field: error.param}
        });
    }
}