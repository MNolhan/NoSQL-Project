import express from "express";
import redisClient from "../redis/RedisClient.js";
import { getRecipesCollection } from "../../db/mongo.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const cacheKey = "recipes:all";
        const cached = await redisClient.get(cacheKey);

        if (cached) {
            res.setHeader("X-Cache", "HIT");
            return res.status(200).json(JSON.parse(cached));
        }

        const col = await getRecipesCollection();
        const recipes = await col.find().sort({ createdAt: -1 }).toArray();

        await redisClient.set(cacheKey, JSON.stringify(recipes), {
        EX: 300,
        });

        res.setHeader("X-Cache", "MISS");
        return res.status(200).json(recipes);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;
