import express from "express";
import redisClient from "../redis/redisClient.js";
import { getRecipesCollection } from "../../db/mongo.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const cacheKey = "recipes:all";

    try {
        const cachedRecipes = await redisClient.get(cacheKey);

        if (cachedRecipes) {
            return res.json(JSON.parse(cachedRecipes));
        }

        const col = await getRecipesCollection();
        const recipes = await col
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        await redisClient.setEx(
            cacheKey,
            300,
            JSON.stringify(recipes)
        );

        res.json(recipes);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;