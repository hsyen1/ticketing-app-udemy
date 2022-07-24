import { scrypt, randomBytes} from 'crypto';
import { promisify } from 'util';

/**
 * 
 * scrypt is a callback based implementation function
 * since we're gonna want to use async and await,
 * we convert the callback into a promise by using promisify
 * 
 */
const scryptAsync = promisify(scrypt);

export class PasswordUtil {

    /**
     * salt - a random generated characters used to be concatenated with the password before hashing
     * 
     * @param password password to be hashed
     * @returns hashed salted password
     */
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buffer.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');

        const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buffer.toString('hex') === hashedPassword;
    }
}