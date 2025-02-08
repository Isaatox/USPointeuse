const validToken = true
const axios = require("axios")
const fs = require('fs')
const fetch = require('node-fetch');
const mm = require('music-metadata');

module.exports = async ({ client, Jennie, config, database }) => {
    const sendMessage = async (channelID, data) => {
        try {
            if (!validToken) throw new Error("Invalid token, check your config.js file.");

            const url = `https://discord.com/api/v9/channels/${channelID}/messages`,
                headers = {
                    'Authorization': `Bot ${config.token}`,
                    "x-super-properties": "eyJvcyI6IiIsImJyb3dzZXIiOiIiLCJkZXZpY2UiOiIiLCJzeXN0ZW1fbG9jYWxlIjoiIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiIiwiYnJvd3Nlcl92ZXJzaW9uIjoiIiwib3NfdmVyc2lvbiI6IiIsInJlZmVycmVyIjoiIiwicmVmZXJyaW5nX2RvbWFpbiI6IiIsInJlZmVycmVyX2N1cnJlbnQiOiIiLCJyZWZlcnJpbmdfZG9tYWluX2N1cnJlbnQiOiIiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjoxODk2MTcsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGwsImRlc2lnbl9pZCI6MH0="
                },

                resp = await axios.post(url, data, { headers }).catch(err => err.response);

            return [resp.status === 200, resp.data];
        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
        }
    }

    const uploadFile = async (filePath, channelID) => {
        try {
            if (!validToken) throw new Error("Invalid token, check your config.js file.");

            const url = `https://discord.com/api/v9/channels/${channelID}/attachments`,
                headers = {
                    'Authorization': `Bot ${config.token}`,
                },
                data = {
                    files: [{
                        filename: filePath.split("/").pop(),
                        file_size: 1337,
                        id: 16
                    }]
                },
                uploadData = await axios.post(url, data, { headers }).catch(err => err.response);

            if (uploadData.status !== 200) throw new Error("Error preparing file, please try again.", uploadData.data);

            const uploadResp = await axios.put(uploadData.data.attachments[0].upload_url, fs.readFileSync(filePath), { headers: { 'Content-Type': 'audio/mpeg' } }).catch(err => err.response);

            if (uploadResp.status !== 200) throw new Error("Error uploading file, please try again.", uploadResp.data);

            return uploadData.data.attachments[0].upload_filename;

        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
        }
    }

    Jennie.RunUserInteraction("vocal", [/*Isaatox*/ "638434129234624512", /*Suzaku*/ "473181497763823616", /*Yemekinhoo*/ "320994501441355783", /*Watchos*/ "361917461043347456", /*Andy*/ "282620800148701186"], async (interaction) => {
        try {
            fetchAudioAndSendToDiscord(interaction.channelId, interaction.options.data[0].value, interaction)
            return interaction.deferReply({ content: "Jennie est en train de préparer son message vocal, il sera prêt à être envoyé dans quelques secondes.", ephemeral: true })
        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
        }
    });

    async function fetchAudioAndSendToDiscord(channelId, text, interaction) {
        try {
            const url = "https://api.elevenlabs.io/v1/text-to-speech/YR7zFojYf8wIoaCAnN3e";

            const headers = {
                "Accept": "audio/mpeg",
                'xi-api-key': '557b6d9fb39917ee885756b4c369e99e',
                'Content-Type': 'application/json'
            };

            const data = {
                text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: { "similarity_boost": 1, "stability": 0.7, "style": 0.25, "use_speaker_boost": true }
            };

            const response = await fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data) });

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des données audio : ${response.statusText}`);
            }

            const fileStream = fs.createWriteStream('vocal.mp3');

            response.body.pipe(fileStream);

            return new Promise((resolve, reject) => {
                try {
                    fileStream.on('finish', async () => {
                        try {
                            getAudioDuration("./vocal.mp3").then(async duration => {
                                try {
                                    if (duration !== null) {
                                        try {

                                            const filename = await uploadFile("./vocal.mp3", interaction.channelId).catch(err => {
                                                try {
                                                    console.log(`[-] Error while uploading file, please try again.`);
                                                } catch (err) {
                                                    console.error(`Ligne de code ${err.stack.split('\n')[1].trim()} : ${err}`);
                                                }
                                            });

                                            const data = {
                                                flags: 8192, // 8192 is a voice message
                                                attachments: [
                                                    {
                                                        id: "0",
                                                        description: "",
                                                        filename: "file.mp3",
                                                        uploaded_filename: filename,
                                                        duration_secs: duration.toFixed(2),
                                                        waveform: btoa("test"),
                                                        content_type: "audio/mpeg",
                                                    }
                                                ]
                                            }

                                            const [isSent, sentData] = await sendMessage(interaction.channelId, data);

                                            if (!isSent) {
                                                try {
                                                    console.log(`[-] Error while sending message, please try again.`);
                                                    return console.log(sentData);
                                                } catch (error) {
                                                    console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                                                }
                                            }

                                            console.log(`L'utilisateur \x1b[42m\x1b[37m${interaction.user.username}\x1b[0m vient de faire un vocal dans le salon \x1b[42m\x1b[37m${interaction.channelId}\x1b[0m avec pour message \x1b[42m\x1b[37m${interaction.options.data[0].value}\x1b[0m - Id du message \x1b[42m\x1b[37m${sentData.id}\x1b[0m`)
                                            
                                            fs.unlinkSync('vocal.mp3');
                                            interaction.editReply({ content: "Le message vocal de Jennie a été envoyé avec succès!", ephemeral: true })
                                            resolve(true);
                                        } catch (error) {
                                            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                                        }
                                    } else {
                                        console.log('Durée du fichier audio non trouvée.');
                                    }
                                } catch (error) {
                                    console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                                }
                            })
                        } catch (error) {
                            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                        }
                    });
                } catch (error) {
                    console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                }
            });
        } catch (error) {
            console.error('Erreur :', error.message);
            return Promise.reject(error);
        }
    }


    async function getAudioDuration(filePath) {
        try {
            const metadata = await mm.parseFile(filePath);
            if (metadata.format && metadata.format.duration) {
                try {
                    return metadata.format.duration;
                } catch (error) {
                    console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
                }
            }
            return null;
        } catch (error) {
            console.error(`Ligne de code ${error.stack.split('\n')[1].trim()} : ${error}`);
            return null;
        }
    }
};