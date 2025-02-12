import express from 'express'
import services from '../Services/Services.js';
import OTPconfirmation from '../Services/OTPconfirmation.js';

const route = express.Router();
route.post("/account/signup", services.signUp);
route.post("/account/login", services.login);

route.post("/account/otp-confirmation/:accountId", OTPconfirmation);

export default route;
