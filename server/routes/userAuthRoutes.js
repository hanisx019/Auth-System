import express from 'express';
import { register, login , logout , verifyEmail , sendverifyOtp, isAuthenticated, passResetOtp, passResetVerifyOTP } from '../controllers/authContoller.js';
import userAuth from '../middleware/userAuth.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login );
router.post('/logout', logout );
router.post('/send-verify-otp',userAuth, sendverifyOtp);
router.post('/verify-email',userAuth, verifyEmail);
router.get('/is-suth',userAuth, isAuthenticated);
router.post('/reset-password',userAuth, passResetOtp);
router.post('/password-changed',userAuth, passResetVerifyOTP);

export default router;

