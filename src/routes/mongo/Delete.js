import express from "express";
import { ObjectId } from "mongodb";
import { getRecipesCollection } from "../../db/mongo.js";
import auth from "../../middleware/auth.js";
import redisClient from "../redis/RedisClient.js";

const router = express.Router();

router.delete("/:id", auth, async (req, res) => {
    
    try {
        const col = await getRecipesCollection();

        const result = await col.deleteOne({
        _id: new ObjectId(req.params.id),
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({message: "Recette introuvable",});
        }

        await redisClient.del("recipes:all");

        res.json({message: "Recette supprimée avec succès",});

    } catch (err) {
        res.status(400).json({message: "Identifiant de recette invalide",});
    }
});

export default router;
