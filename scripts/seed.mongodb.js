const { MongoClient } = require('mongodb');

async function seedRecipes() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  await client.connect();

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
    },
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
    },];

  const db = client.db('mydb');
  const col = db.collection('recipes');

  for (const recipe of recipes) {
    try {
      const result = await col.insertOne(recipe);

      console.log(`Recette créée avec succès (ID: ${result.insertedId})`);
    } catch (err) {
      console.error(`Erreur lors de la création de la recette ${recipe.title}: ${err.message}`);
    }
  }

  await client.close();
}

seedRecipes().catch((err) => {
  console.error('Erreur lors de la création des recettes:', err.message);
});