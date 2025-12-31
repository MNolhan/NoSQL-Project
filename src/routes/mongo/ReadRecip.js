import express from "express";
import { ObjectId } from "mongodb";
import { getRecipesCollection } from "../../db/mongo.js";

const router = express.Router();

router.get("/", async (req, res) => {
    
    try {

        const col = await getRecipesCollection();
        const recipes = await col.find().sort({ createdAt: -1 }).toArray();
        
        res.json(recipes);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;