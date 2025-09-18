import express from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
app.use('/', (req, res) => {
  res.status(200).send('Hello from acquisitions');
});
export default app;
