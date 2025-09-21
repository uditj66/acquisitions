import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';
import userRoutes from '#routes/user.route.js';
import morgan from 'morgan';
import securityMiddleware from '#middlewares/security.middleware.js';
const app = express();
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// combining our logging library winston with morgan so that morgan logs can also be used to debug
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);
app.use(securityMiddleware);
app.get('/', (req, res) => {
  logger.info('HELLO from acquistions');
  res.status(200).send('Hello from acquisitions');
});
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Acquisition running perfectly',
  });
});
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'Ok',
    message: 'Health is perfect',
    timestamps: new Date(Date.now()),
    uptime: process.uptime(),
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});
export default app;
