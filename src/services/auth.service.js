import bcrypt from 'bcryptjs';
import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';
export const hashPassword = async password => {
  try {
    if (!password) throw new Error('password is required 👎');
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('ERROR hashing the password ', error);
    throw new Error('Error Hashing ');
  }
};
export const comparePassword = async (password, hashedPassword) => {
  try {
    if (!password || !hashedPassword) {
      throw new Error('Password and hashed password are required');
    }
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('ERROR comparing password:', error);
    throw new Error('Error comparing password');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    logger.info(`User ${user.email} authenticated successfully`);
    return userWithoutPassword;
  } catch (error) {
    logger.error(`Error authenticating user: ${error}`);
    throw error;
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    // Remember all These query will Always return an array
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0)
      throw new Error('User already exists with this Email');
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.createdAt,
      });
    logger.info(`User ${newUser.email} Created Successfully`);
    return newUser;
  } catch (error) {
    logger.error(`Error creating user :${error}`);
    throw error;
  }
};
