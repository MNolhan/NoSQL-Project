import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
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

configDotenv();

const PORT = process.env.PORT;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/CreateUser", Create);
app.use("/Login", Login);
app.use("/DeleteUser", Delete);
app.use("/ReadUser", Read);
app.use("/UpdateUser", Update);

app.use("/CreateRecip", CreateRecip);
app.use("/ReadRecip", ReadRecip);
app.use("/UpdateRecip", UpdateRecip);
app.use("/DeleteRecip", DeleteRecip);

app.get('/test', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
