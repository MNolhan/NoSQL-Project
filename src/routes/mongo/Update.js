import express from "express";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getRecipesCollection } from "../../db/mongo.js";
import auth from "../../middleware/auth.js";
import redisClient from "../redis/RedisClient.js";

const router = express.Router();

const UpdateSchema = z.object({
    title: z.string().min(1).optional(),
    ingredients: z.array(z.string().min(1)).min(1).optional(),
    steps: z.array(z.string().min(1)).min(1).optional(),
    duration: z.number().int().positive().optional(),
});

router.put("/:id", auth, async (req, res) => {
    
    try {
        const data = UpdateSchema.parse(req.body);

        if (Object.keys(data).length === 0) {
            return res.status(400).json({
                message: "Aucun champ à mettre à jour",
            });
        }

        const col = await getRecipesCollection();

        const result = await col.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: data }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Recette introuvable",
            });
        }

        await redisClient.del("recipes:all");

        res.json({message: "Recette mise à jour avec succès",});
    
    } catch (err) {
        res.status(400).json({
            message: "Données invalides ou identifiant incorrect",
        });
    }
});

export default router;
