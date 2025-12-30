import express from "express";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from 'dotenv';

configDotenv();

const router = express.Router();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORTBASE,
});

router.get("/", async (req, res) => {

    try {
        const [rows] = await pool.query("SELECT name, prenom, email FROM users");

        res.status(200);
        res.json(rows);

    } catch (err) {
        res.status(500);
        res.json({ message: err.message });
    }

});

router.get("/:id", async (req, res) => {

    const token = req.headers.authorization.split(" ")[1];

    try {

        if (!token) {
        res.status(401);
        res.json({ message: "Token manquant" });
        return;
        }

        const payload = jwt.verify(token, process.env.jwtKey);
        const userId = payload.userId;

        const [rows] = await pool.query("SELECT name, prenom, email, password FROM users WHERE id = ?", [userId]);

        res.status(200);
        res.json(rows);

    } catch (err) {

        if (err.name === "TokenExpiredError") {
            res.status(401);
            res.json({ message: "Token expiré" });
            return;

        } else if (err.name === "JsonWebTokenError") {
            res.status(401);
            res.json({ message: "Token invalide" });
            return;
        }
        else {
            res.status(400);
            res.json({ message: err.message });
        }
    }
});


export default router;