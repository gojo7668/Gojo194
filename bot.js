const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");

const { state, saveState } = useSingleFileAuthState("./auth_info.json");

async function startSock() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on("creds.update", saveState);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        const sender = msg.key.remoteJid;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (text === "!hi") {
            await sock.sendMessage(sender, { text: "Hello, Gojo! Bot eka connect wela inne." });
        }
    });
}

startSock();