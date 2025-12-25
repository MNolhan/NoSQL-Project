import express from "express";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
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

router.delete("/", async (req, res) => {

    const token = req.headers.authorization?.split(" ")[1];

    try {
        if (!token) {
            res.status(401);
            res.json({ message: "Token manquant" });
            return;
        }

        const payload = jwt.verify(token, process.env.jwtKey);

        await pool.query("DELETE FROM users WHERE id = ?", [payload.userId]);

        res.status(200);
        res.json({ message: "Compte supprimé avec succès" });
        
    } catch (err) {

        if (err.name === "TokenExpiredError") {
            res.status(401);
            res.json({ message: "Token expiré" });

        } else {
            res.status(401);
            res.json({ message: "Token invalide" });
        }
    }
});

export default router;