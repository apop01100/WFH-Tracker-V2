import 'dotenv';
import { generateKeys } from 'paseto-ts/v4';

const localKey = generateKeys('local');

export { localKey }