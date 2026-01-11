import express from "express";
import { ObjectId } from "mongodb";
import { getRecipesCollection } from "../../db/mongo.js";
import auth from "../../middleware/auth.js";
import redisClient from "../../redis/redisClient.js";

const router = express.Router();

// Fonction pour liker une recette
router.post("/:id", auth, async (req, res) => {
    try {
        const recipeId = req.params.id;

        const col = await getRecipesCollection();
        const recipe = await col.findOne({ _id: new ObjectId(recipeId) });

        if (!recipe) {
            return res.status(404).json({ message: "Recette introuvable" });
        }

        await redisClient.zIncrBy(
            "ranking:recipes",
            1,
            recipeId
        );

        return res.json({ message: "Recette likée !" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;