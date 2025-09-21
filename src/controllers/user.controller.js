import logger from '#config/logger.js';
import {
  fetchAllUsers,
  getUserById as getUser,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '#services/user.service.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';
import { formatValidationError } from '#utils/format.js';

// ALL the credentials send by user are validated first according to ZOD Schema in this Controller file and then these credentials are passed to functions created in Services file
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
    logger.info('Users retrieved successfully');
    return res.status(200).json({
      message: 'Users retrieved successfully',
      users,
      count: users.length,
    });
  } catch (error) {
    logger.error('Failed to fetch users:', error);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation Failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    const user = await getUser(id);

    logger.info(`User ${id} retrieved successfully`);
    return res.status(200).json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    logger.error('Failed to fetch user by ID:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Validate request parameters
    const paramsValidation = userIdSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      return res.status(400).json({
        message: 'Validation Failed',
        details: formatValidationError(paramsValidation.error),
      });
    }

    // Validate request body
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        message: 'Validation Failed',
        details: formatValidationError(bodyValidation.error),
      });
    }

    const { id } = paramsValidation.data;
    const updates = bodyValidation.data;

    // Authorization checks
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
        error: 'UNAUTHORIZED',
      });
    }

    // Users can only update their own information, unless they're admin
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'You can only update your own information',
        error: 'FORBIDDEN',
      });
    }

    // Only admins can change user roles
    if (updates.role && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only administrators can change user roles',
        error: 'FORBIDDEN',
      });
    }

    const updatedUser = await updateUserService(id, updates);

    logger.info(`User ${id} updated successfully by user ${req.user.id}`);
    return res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error('Failed to update user:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation Failed',
        details: formatValidationError(validationResult.error),
      });
    }
    const { id } = validationResult.data;
    const deletedUser = await deleteUserService(id);
    logger.info(`User ${id} deleted successfully by user ${req.user.id}`);
    return res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    logger.error('Failed to delete user:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    next(error);
  }
};
