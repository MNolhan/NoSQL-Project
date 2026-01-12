const mysql = require('mysql2/promise');

async function seedUsers() {
  const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORTBASE,
  });

  const users = [
    {
      name: 'John Doe',
      prenom: 'John',
      email: 'john.doe@example.com',
      password: 'password123',
    },
    {
      name: 'Jane Smith',
      prenom: 'Jane',
      email: 'jane.smith@example.com',
      password: 'password456',
    },
    {
      name: 'Bob Johnson',
      prenom: 'Bob',
      email: 'bob.johnson@example.com',
      password: 'password789',
    },
  ];

  for (const user of users) {
    try {
      const [result] = await pool.query(
        'INSERT INTO users (name, prenom, email, password) VALUES (?, ?, ?, ?)',
        [user.name, user.prenom, user.email, user.password]
      );

      console.log(`Utilisateur créé avec succès (ID: ${result.insertId})`);
    } catch (err) {
      console.error(`Erreur lors de la création de l'utilisateur ${user.email}: ${err.message}`);
    }
  }
}

seedUsers().catch((err) => {
  console.error('Erreur lors de la création des utilisateurs:', err.message);
});