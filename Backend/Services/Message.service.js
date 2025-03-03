import UserModel from '../Model/AccountModel.model.js'
import MessageModel from '../Model/Message.model.js'

class Services {
    async getUsers(req, res) {
        try {
            const loggedInUserId = req.user.id;
            const activeUsers = await UserModel.find({ _id: { $ne: loggedInUserId } });

            return res.status(200).json(activeUsers);
        } catch (error) {
            console.error(error);

        }
    }

    async getMessage(req, res) {
        try {
            const { id: userToChatId } = req.params;
            const senderId = req.accountId;

            const messages = await MessageModel.find({
                $or: [
                    { senderId: senderId, receiverId: userToChatId },
                    { senderId: userToChatId, receiverId: senderId }
                ]
            })

            return res.status(200).json(messages);
        } catch (error) {
            console.error(error);

        }
    }

    async sendMessage(req, res) {
        try {
            const {text, image} = req.body;
            const {id: receiverId} = req.params;
            const senderId = req.accountId;

            let imgURL;
            // use multer or smthing to store the image

            const newMessage = new MessageModel({
                senderId,
                receiverId,
                text,
                image: imgURL
            });
            await newMessage.save();

            return res.status(201).json(newMessage);
        } catch (error) {
            console.error(error);
            
        }
    }
}

const message_service = new Services();

export default message_service;

