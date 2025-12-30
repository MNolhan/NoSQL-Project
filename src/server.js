import express from 'express';
import { configDotenv } from 'dotenv';

import Create from './routes/sql/CreateUser.js';
import Login from './routes/sql/Login.js';
import Delete from './routes/sql/DeleteUser.js';
import Read from './routes/sql/ReadUser.js';
import Update from './routes/sql/UpdateUser.js';

import CreateRecip from "./routes/mongo/CreateRecip.js";

configDotenv();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use("/CreateUser", Create);
app.use("/Login", Login);
app.use("/DeleteUser", Delete);
app.use("/ReadUser", Read);
app.use("/UpdateUser", Update);

app.use("/CreateRecip", CreateRecip);

app.get('/test', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

