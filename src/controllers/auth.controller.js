import { createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationError } from '#utils/format.js';
import { token } from '#utils/jwt.js';
import { signUpSchema } from '#validations/auth.validation.js';
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
    cookies.set(res, 'token', generateToken);
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
