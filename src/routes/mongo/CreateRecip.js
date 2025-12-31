import express from "express";
import { z } from "zod";
import { getRecipesCollection } from "../../db/mongo.js";

const router = express.Router();

const RecipeSchema = z.object({
    title: z.string().min(1),
    ingredients: z.array(z.string().min(1)).min(1),
    steps: z.array(z.string().min(1)).min(1),
    duration: z.number().int().positive(),
});

router.post("/", async (req, res) => {

    const data = RecipeSchema.parse(req.body);

    try {

        const col = await getRecipesCollection();
        const result = await col.insertOne({
        ...data,
        createdAt: new Date(),
        });

        res.status(201).json({ message: "Recette créée", id: result.insertedId });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
