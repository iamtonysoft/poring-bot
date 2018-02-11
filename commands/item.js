const config = require("../config.json");
const snekfetch = require("snekfetch");
const Discord = require("discord.js");
const itemLink = "https://www.divine-pride.net/api/database/item/";

exports.run = async(client, message, args, connection) => {
    if(!args[0]) return message.channel.send("Please enter the item name, Example: _!item jellopy_");
    const text = args.join(" ");
    const tempMsg = await message.channel.send("Fetching...");
    
    connection.query(`SELECT * FROM item_db_re WHERE name_japanese = '${text}' LIMIT 1`, (err, row) => {
        if(err) return message.channel.send(err) + tempMsg.delete();
        if(!row[0]) return message.channel.send("No available data to show.") + tempMsg.delete();

        const api = itemLink + row[0].id + config.app.apiKey;
        const weaponSlot = (row[0].slots != null ? " [" + row[0].slots + "]" : "");
        const weaponLevel = (row[0].weapon_level != null ? row[0].weapon_level : "Not Applicable");
        const weaponRefineable = (row[0].refineable == 1 ? "Yes" : "Not Applicable");
        const itemScript = (row[0].script != null ? row[0].script : "-");

        snekfetch.get(api).then(r => {
            const result = r.body;
            const itemDescription = (result.description != "" ? result.description : "?");
            const cleanItemDescription = itemDescription.replace(/([^][0-9A-F][0-9A-F])([0-9A-F][0-9A-F])([0-9A-F][0-9A-F])/gi, "");
            
            const embed = new Discord.RichEmbed()
                    .setColor("#ffc0b9")
                    .setThumbnail("http://imgs.ratemyserver.net/items/large/"+ row[0].id +".gif")
                    .setURL("https://www.divine-pride.net/database/item/"+ row[0].id +"/")
                    .setFooter("https://www.divine-pride.net/database/item/"+ row[0].id +"/")
                    .addField("Item Name", row[0].name_japanese + weaponSlot, false)
                    .addField("Pice", row[0].price_buy, true)
                    .addField("Refineable", weaponRefineable, true)
                    .addField("Item Script", itemScript, false)
                    .addField("Description", cleanItemDescription);

                message.channel.send({embed});

                tempMsg.delete();
        });
    });
}