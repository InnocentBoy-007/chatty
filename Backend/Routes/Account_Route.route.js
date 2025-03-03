import express from 'express'
import account_service from '../Services/AccountServices.service.js';
import Token from '../Components/JWT.js';
import OTPconfirmation_service from '../Services/OTPconfirmation.service.js';

const route = express.Router();


route.post("/signup", account_service.signUp);
route.post("/signin", account_service.signIn);
route.post("/logout", Token.compareToken, account_service.logout);
route.post("/update/profileDP", Token.compareToken, account_service.updateDP);

route.post("/otp-confirmation/:otpID", Token.compareToken, OTPconfirmation_service);

export default account_route;
