import { signUp } from '#controllers/auth.controller.js';
import Router from 'express';
const router = Router();
router.post('/sign-up', signUp);
router.post('/sign-in', (req, res) => {
  res.send('POST /api/auth/sign-in Response ');
});
router.post('/sign-out', (req, res) => {
  res.send('POST /api/auth/sign-out Response ');
});
export default router;
