import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import account_route from './Routes/Account_Route.js';
import message_route from './Routes/Message.route.js';
import { app, server } from './lib/socket.js';

class ServerSetup {
    constructor() {
        dotenv.config();

        this.PORT = 9000;
        this.MONGODB_URL = process.env.MONGODB_URL;
        this.ORIGIN = process.env.ORIGIN;

        if (!this.MONGODB_URL) {
            console.error("❌ MONGODB_URL is not defined in .env file!");
            process.exit(1);
        }

        this.app = app;
    }

    // Use MongoDB Atlas (cloud-based) for database
    async connectDatabase() {
        try {
            await mongoose.connect(this.MONGODB_URL);
            console.log("✅ Connected to MongoDB successfully!");
        } catch (error) {
            console.error("❌ Database connection failed!", error);
            process.exit(1);
        }
    }

    async connectServer() {
        try {
            await this.connectDatabase();

            // CORS setup
            const corsOptions = {
                origin: (origin, callback) => {
                    if (origin === this.ORIGIN) {
                        callback(null, true);
                    } else {
                        callback(new Error('Not allowed by CORS'));
                    }
                },
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
                allowedHeaders: ['Content-Type', 'Authorization'],
            };

            this.app.use(cors(corsOptions)); // Enable CORS middleware
            this.app.use(express.json()); // Parse incoming JSON requests
            this.app.use('/api/account', account_route); // for login and signup routes
            this.app.use('/api/message', message_route); // route for sending and receiving messages
            this.app.use('/', (req, res) => {
                res.send("Welcome to the server!");
            })

            // Global error handler middleware
            this.app.use((err, req, res, next) => {
                console.error(err.stack); // Log the error for debugging

                // Default error response
                const statusCode = err.statusCode || 500;
                const message = err.message || 'Internal Server Error';

                // Send the error response
                res.status(statusCode).json({
                    success: false,
                    message: message,
                    // In JavaScript, exceptions hold a stack property that contains the stack from the place where the exception was thrown.
                    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Include stack trace only in development
                });
            });

            server.listen(this.PORT, '0.0.0.0', () => {
                console.log(`✅ Server is running at http://localhost:${this.PORT}`);
            });


            console.log("✅ Server setup successfully!");

        } catch (error) {
            console.error("❌ Server connection failed!", error);
        }
    }
}

new ServerSetup().connectServer();
