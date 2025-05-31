import { decrypt } from 'paseto-ts/v4';
import { localKey } from '../config/paseto.js';

export async function authenticate(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No token' });

    const { payload } = decrypt(localKey, token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}