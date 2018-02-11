const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");
const mysql = require("mysql");

var sqlCon = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "poring"
});

sqlCon.connect(err => {
    if(err) throw console.log(err);
    console.log("Connected to database!");
});

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./commands/${file}`);
        let eventName = file.split(".")[0];
        // super-secret recipe to call events with all their proper arguments *after* the `client` var.
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});

client.on("ready", () => {
    console.log("Bot is ready!");
});

const prefix = config.prefix;

client.on("message", message => {
    // Prevent bot answering each other
    if (message.author.bot) return;
    // Exit and stop if it's not there
    if(message.content.indexOf(config.prefix) !== 0) return;

    // This is the best way to define args. Trust me.
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // The list of if/else is replaced with those simple 2 lines:
    try {
        let commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args, sqlCon);
    } catch (err) {
        console.error(err);
    }
});

client.login(config.token);