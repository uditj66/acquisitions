import { token } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import logger from '#config/logger.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authToken = cookies.get(req, 'token');

    if (!authToken) {
      return res.status(401).json({
        message: 'Access token required',
        error: 'UNAUTHORIZED',
      });
    }
    /*  Verifies the token (token.verify(authToken)).
      If valid, it attaches some user information to the request.
    1.attaches the authenticated user's data to the request so that later route handlers or middleware can access it.
    2.req is the Express request object.
    3.By default, req has things like req.body, req.params, req.query, etc.
    4.req.user is not built-in; we are adding a new property called user.
    5.decoded is the payload of the token, usually containing the user's ID, email, role, or other info. For example:
    */
    const decoded = token.verify(authToken);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    return res.status(401).json({
      message: 'Invalid or expired token',
      error: 'UNAUTHORIZED',
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Authentication required',
      error: 'UNAUTHORIZED',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin access required',
      error: 'FORBIDDEN',
    });
  }

  next();
};
