const database = require("../database.js");

const getAprData = () => {
    return new Promise((resolve, reject) => {
        database.query(`SELECT * FROM apr WHERE sup = 0`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows);
            }
        });
    });
};

async function fetchListVips() {
    try {
        const aprData = await getAprData();
        const listvips = aprData.map(item => ({
            name: `${item.prenom} ${item.nom} ${item.danger !== "dcd" ? "" : "(Décèdé)"}`,
            value: `${item.value}`
        }));
        return listvips;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        return [];
    }
}

module.exports = { fetchListVips }