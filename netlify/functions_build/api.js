import serverless from 'serverless-http';
import mongoose from 'mongoose'; // Import mongoose to manage connection here
// Adjust the import path based on the final directory structure after build.
// The 'build:functions' script copies 'server/dist' to 'netlify/functions_build/server_dist'.
// The 'api.ts' is compiled to 'netlify/functions_build/api.js'.
// The server's compiled output (including .d.ts files) is in 'server/dist' at the project root during this compilation step.
import { app } from '../../server/dist/index'; // Path relative from netlify/functions/api.ts to server/dist/index.d.ts
import config from '../../server/dist/config/config'; // Path relative from netlify/functions/api.ts to server/dist/config/config.d.ts
// Variable to cache DB connection
let isConnected = null;
const connectToDatabase = async () => {
    if (isConnected) {
        console.log('Using existing database connection.');
        return;
    }
    try {
        console.log('Connecting to MongoDB...');
        if (!config.mongoUri) {
            throw new Error("MONGODB_URI is not defined in config for serverless function.");
        }
        await mongoose.connect(config.mongoUri);
        isConnected = true;
        console.log('MongoDB connected successfully (from serverless handler).');
    }
    catch (error) {
        console.error('MongoDB connection error in serverless function:', error);
        isConnected = false; // Explicitly set to false on error
        throw error; // Re-throw error to fail the function execution if DB connection fails
    }
};
export const handler = async (event, context) => {
    // Ensure DB is connected before handling the request
    // `callbackWaitsForEmptyEventLoop` allows a Lambda function to return its result to the caller
    // without waiting for all asynchronous operations initiated by the function's code to complete.
    // Setting it to false is useful for database connections that might be reused across invocations.
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        await connectToDatabase();
    }
    catch (dbError) {
        console.error("Database connection failed, cannot process request:", dbError);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error - DB Connection Failed" }),
        };
    }
    // Now, process the request with the Express app
    const result = await serverless(app)(event, context);
    return result;
};
