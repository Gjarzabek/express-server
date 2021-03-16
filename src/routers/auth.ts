import express from 'express';
import userController from '../controllers/user'

const router = express.Router();

// Register a new User
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);
// Logout
router.post('/logout', userController.verifyUserToken, userController.logout);
// refresh
router.post('/refresh', userController.verifyUserToken, userController.refreshToken);
// data
router.get('/data', userController.verifyUserToken, userController.data);


export default router;