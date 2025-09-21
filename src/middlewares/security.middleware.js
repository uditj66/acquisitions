import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';
const rateLimitClients = {
  admin: aj.withRule(
    slidingWindow({
      mode: 'LIVE',
      interval: '1m',
      max: 20,
      name: 'admin-rate-limit',
    })
  ),
  user: aj.withRule(
    slidingWindow({
      mode: 'LIVE',
      interval: '1m',
      max: 10,
      name: 'user-rate-limit',
    })
  ),
  guest: aj.withRule(
    slidingWindow({
      mode: 'LIVE',
      interval: '1m',
      max: 5,
      name: 'guest-rate-limit',
    })
  ),
};
const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    const userAgent = req.get('User-Agent') || '';
    const trustedAgents = ['PostmanRuntime', 'curl'];
    const allowAgent = trustedAgents.some(agent => userAgent.includes(agent));

    const client = rateLimitClients[role] || rateLimitClients['guest'];
    const key = req.ip;

    // identifying if the user is same user by using his/her IP Address by passing as key in client
    const decision = await client.protect({ key });
    if (decision.isDenied() && decision.reason.isBot() && !allowAgent) {
      logger.warn('Bot requst detected', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(403).json({
        message: 'Automated rqst are not allowed',
        error: 'FORBIDDEN',
      });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate Limit Exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(403).json({
        message: 'TOO MANY RQST',
        error: 'FORBIDDEN',
      });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield Block Request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res.status(403).json({
        message: 'Request Blocked by security policy',
        error: 'FORBIDDEN',
      });
    }
    next();
  } catch (error) {
    logger.error('Arcjet middleware Error :', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong with security middleware ',
    });
  }
};
export default securityMiddleware;
