const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

async function seedRecipes() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    await client.connect();
    console.log("Connecté à MongoDB");

    const db = client.db('mydb');
    const col = db.collection('recipes');

    const recipes = [
        {
        title: 'Poulet au curry',
        ingredients: ['Poulet', 'Curry', 'Lait', 'Oignons'],
        steps: ['Faire revenir les oignons', 'Ajouter le curry', 'Ajouter le lait', 'Ajouter le poulet'],
        duration: 30,
        },
        {
        title: 'Salade verte',
        ingredients: ['Laitue', 'Tomates', 'Oignons', 'Fromage'],
        steps: ['Laver les légumes', 'Couper les légumes', 'Mélanger les légumes', 'Ajouter le fromage'],
        duration: 10,
        }
    ];

    try {
        const count = await col.countDocuments();
        if (count > 0) {
        console.log("La collection contient déjà des données, seed ignoré.");
        } else {
        const result = await col.insertMany(recipes);
        console.log(`${result.insertedCount} recettes insérées.`);
        }
    } catch (err) {
        console.error("Erreur lors du seed:", err.message);
    }

    await client.close();
    console.log("Connexion MongoDB fermée.");
}

seedRecipes().catch(err => console.error(err));