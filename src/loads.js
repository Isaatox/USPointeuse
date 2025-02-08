const fs = require('fs').promises;
const fs_ = require('fs');
const path = require('path');
let jsonInfos = {}

const dossierPath = path.join(__dirname, 'files');

var blocked = {};

function wch(fn) {
    return function (event, fichier) {
        const cheminFichier = path.join(dossierPath, fichier)

        fs_.stat(cheminFichier, (err, stats) => {
            if (stats.size > 0) {
                if (path in blocked) return;
                blocked[path] = true;

                setTimeout(function () {
                    delete blocked[path]
                }, 25);

                fn(event, fichier)
            }
            return
        });
    }
}

fs_.watch(dossierPath, wch(async function (event, fichier) {
    const cheminFichier = path.join(dossierPath, fichier);

    if (path.extname(fichier) === '.js') {

        if (require.cache[cheminFichier]) {
            delete require.cache[require.resolve(cheminFichier)]
            console.log(`Suppression du fichier en cache :`, "\x1b[31m", fichier, "\x1b[0m");
        }

        try {
            const nouveauModule = require(cheminFichier);

            if (typeof nouveauModule === 'function') {
                await nouveauModule(jsonInfos);
                console.log(`Ajout du fichier :`, "\x1b[33m", fichier, "\x1b[0m");
            } else {
                console.warn(`Le fichier ${fichier} ne contient pas une fonction execute.`);
            }
        } catch (error) {
            console.error(`Erreur lors du chargement du fichier ${fichier} :`, error);
        }
    }
}));

exports.LoadFiles = async function ({ client: client, Jennie: Jennie, config: config, database: database }) {
    try {
        jsonInfos = { client, Jennie, config, database }
        const fichiers = await fs.readdir(dossierPath);
        const fichiersJS = fichiers.filter(fichier => path.extname(fichier) === '.js');

        await Promise.all(
            fichiersJS.map(async fichier => {
                const cheminFichier = path.join(dossierPath, fichier);
                const script = require(cheminFichier);

                if (typeof script === 'function') {
                    await script({ client, Jennie, config, database });
                    console.log(`Chargement du fichier :`, "\x1b[36m", fichier, "\x1b[0m");
                } else {
                    console.warn(`Le fichier ${fichier} n'est pas une fonction et ne peut pas être exécuté.`);
                }
            })
        );

        console.log('Tous les fichiers ont été chargés avec succès.');
    } catch (err) {
        console.error('Erreur lors du chargement des fichiers :', err);
    }
}

exports.LoadCommands = async function () {
    try {
        const cheminDossier = path.join(__dirname, 'commands')
        const fichiers = await fs.readdir(cheminDossier);
        const fichiersJS = fichiers.filter(fichier => fichier.endsWith('.js'));

        const commandes = await Promise.all(
            fichiersJS.map(async fichier => {
                console.log(`Chargement de la commande :`, "\x1b[31m", fichier, "\x1b[0m");
                return require(`${cheminDossier}/${fichier}`)
            })
        );

        return commandes;
    } catch (err) {
        throw new Error(`Erreur lors du chargement des commandes : ${err.message}`);
    }
}