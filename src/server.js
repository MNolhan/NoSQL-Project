import express from 'express';
import path from 'path';
import { configDotenv } from 'dotenv';

import Create from './routes/sql/CreateUser.js';
import Login from './routes/sql/Login.js';
import Delete from './routes/sql/DeleteUser.js';
import Read from './routes/sql/ReadUser.js';
import Update from './routes/sql/UpdateUser.js';

import CreateRecip from "./routes/mongo/CreateRecip.js";
import ReadRecip from "./routes/mongo/ReadRecip.js";
import UpdateRecip from "./routes/mongo/Update.js";
import DeleteRecip from "./routes/mongo/Delete.js";

import rateLimiter from './routes/redis/RateLimit.js';
import TopRecipes from './routes/redis/TopRecipes.js'

configDotenv();

const PORT = process.env.PORT;
const app = express();

// MongoDB
app.use(express.json());
app.use("/CreateUser", Create);
app.use("/Login", Login);
app.use("/DeleteUser", Delete);
app.use("/ReadUser", Read);
app.use("/UpdateUser", Update);

// MySQL
app.use("/CreateRecip", CreateRecip);
app.use("/ReadRecip", ReadRecip);
app.use("/UpdateRecip", UpdateRecip);
app.use("/DeleteRecip", DeleteRecip);

// Redis
app.use(rateLimiter);
app.use("/TopRecipes", TopRecipes);

app.get('/test', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});