const { Client } = require('pg');

const database = new Client({
    user: 'hlsuser',
    host: '54.37.65.65',
    database: 'hls_bdd',
    password: 'hryNrBAyUN8vuW',
    port: 5432,
});

database.connect().then(() => {
    console.log('Connecté à la base de données PostgreSQL');
}).catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
});

setInterval(function () {
    database.query(`SELECT 1`)
}, 10 * 60000);

module.exports = database;