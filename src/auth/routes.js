const express = require('express');
let authRouter = express.Router();
import { register } from './index';

// authRouter.post('/login', auth.login);
authRouter.post('/register', register);
// authRouter.get('/verifyUser', auth.verifyUser);

export default authRouter;