import express from "express";
import redisClient from "./redisClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const top = await redisClient.zRange(
            "ranking:recipes",
            0,
            9,
            { REV: true }
        );

        res.json(top);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;