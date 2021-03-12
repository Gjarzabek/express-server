import express from 'express';
import userController from '../controllers/user'
import {verifyUserToken, IsAdmin, IsUser} from '../middleware/auth'

const router = express.Router();

// Register a new User
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

// Auth user only
router.get('/events', verifyUserToken, IsUser, userController.userEvent);

// Auth Admin only
router.get('/special', verifyUserToken, IsAdmin, userController.adminEvent);


export default router;