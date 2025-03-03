import express from 'express';
import message_service from '../Services/Message.service.js';
import Token from '../Components/JWT.js';

const router = express.Router();


router.get('/users', Token.compareToken, message_service.getUsers); // this is to get the list of users on the sidebar
router.get('/:id', Token.compareToken, message_service.getMessage); 
router.post('/send/:id', Token.compareToken, message_service.sendMessage);


export default message_route;