import express from 'express'
import services from '../Services/Services.js';

const route = express.Router();
route.post("/singup", services.signUp);
route.post("/login", services.login);

export default route;
