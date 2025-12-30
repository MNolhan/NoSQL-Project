import express from "express";
import mysql from "mysql2/promise";
import { z } from "zod";
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

const PostSchema = z.object({
  name: z.string().min(1),
  prenom: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/", async (req, res) => {

    const data = req.body

    try {

        const { name, prenom, email, password } = PostSchema.parse(req.body);
   
        const hashpassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO users (name, prenom, email, password) VALUES (?, ?, ?, ?)",
            [data.name, data.prenom, data.email, hashpassword]
        );

        res.status(201);
        res.json({ message: "User created successfully", id: result.insertId });

    } catch (error) {

        res.status(500)
        res.json({ error: error.message });

    }
});

export default router;
