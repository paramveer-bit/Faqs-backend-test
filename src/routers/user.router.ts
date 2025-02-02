import { Router } from "express";
import { registerUser, verifyUser, loginUser, resendMail, isLoggedIn, logout } from "../controllers/user.controller";
import { verifyJwt } from '../middelwares/auth';

const router = Router()


router.post('/register', registerUser)
router.post('/verify', verifyUser)
router.post('/login', loginUser)
router.post('/resend', resendMail)
router.get('/isLoggedIn', verifyJwt, isLoggedIn)
router.get('/logout', logout)


export default router;
