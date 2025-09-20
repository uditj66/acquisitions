import { createUser, authenticateUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationError } from '#utils/format.js';
import { token } from '#utils/jwt.js';
import { signUpSchema, signInSchema } from '#validations/auth.validation.js';
import logger from '#config/logger.js';
export const signUp = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation Failed',
        details: formatValidationError(validationResult.error),
      });
    }
    const { name, email, password, role } = validationResult.data;
    const user = await createUser({ name, email, password, role });
    const generateToken = token.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', {}, generateToken);
    logger.info('User registered successfully');
    res.status(201).json({
      mesaage: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(error);
    if (error.message === 'User already exists with this Email') {
      return res.status(409).json({
        message: 'User already exists with this Email',
      });
    }
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation Failed',
        details: formatValidationError(validationResult.error),
      });
    }
    
    const { email, password } = validationResult.data;
    const user = await authenticateUser({ email, password });
    
    const generateToken = token.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    
    cookies.set(res, 'token', {}, generateToken);
    logger.info(`User ${user.email} signed in successfully`);
    
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(error);
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');
    logger.info('User signed out successfully');
    
    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (error) {
    logger.error('Error during sign out:', error);
    next(error);
  }
};
