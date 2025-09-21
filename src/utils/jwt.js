import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import logger from '#config/logger.js';
const JWT_SECRET = process.env.JWT_SECRET;
export const token = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1d',
      });
    } catch (error) {
      logger.error('Failed to authenticate the Token', error);
      throw new Error('Failed to authenticate the Token');
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Failed to verify the token', error);
      throw new Error('Failed to verify the Token');
    }
  },
};
