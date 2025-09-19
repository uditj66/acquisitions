import express from 'express';
import dotenv from 'dotenv';
import logger from '#config/logger.js';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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
dotenv.config();
app.use('/', (req, res) => {
  logger.info('HELLO from acquistions');
  res.status(200).send('Hello from acquisitions');
});
export default app;
