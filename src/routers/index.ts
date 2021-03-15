import express from 'express';
import userController from '../controllers/user'
import {verifyUserToken} from '../middleware/auth'

const router = express.Router();

// Register a new User
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);

export default router;