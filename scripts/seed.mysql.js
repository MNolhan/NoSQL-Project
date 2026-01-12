const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

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
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [user.email]
        );

        if (existing.length > 0) {
            console.log(`Utilisateur déjà existant : ${user.email}`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (name, prenom, email, password) VALUES (?, ?, ?, ?)',
            [user.name, user.prenom, user.email, hashedPassword]
        );

        console.log(`Utilisateur créé (ID: ${result.insertId})`);
        } catch (err) {
        console.error(`Erreur pour ${user.email}: ${err.message}`);
        }
    }

    await pool.end();
    console.log("Seed terminé.");
}

seedUsers().catch(err => console.error(err));