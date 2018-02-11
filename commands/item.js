const config = require("../config.json");
const snekfetch = require("snekfetch");
const Discord = require("discord.js");

exports.run = async(client, message, args, sqlCon) => {
    if(!args[0]) return message.channel.send("Please enter the item name, Example: _!item jellopy_");
    let text = args.join(" ");
    let tempMsg = await message.channel.send("Fetching...");
    sqlCon.query(`SELECT * FROM item_db_re WHERE name_japanese = '${text}'`, (err,row) => {
        if(err) return message.channel.send(err) + tempMsg.delete();
        if(!row[0]) return message.channel.send("No available data to show.") + tempMsg.delete();
        
        let itemLink = "https://www.divine-pride.net/api/database/item/";

        for(let x in row) {
            let api = itemLink + row[x].id + config.apiKey;
            
            let weaponSlot = (row[x].slots != null ? " [" + row[x].slots + "]" : "");
            let weaponLevel = (row[x].weapon_level != null ? row[x].weapon_level : "Not Applicable");
            let weaponRefineable = (row[x].refineable == 1 ? "Yes" : "Not Applicable");
            let itemScript = (row[x].script != null ? row[x].script : "-");

            snekfetch.get(api).then(r => {
                let result = r.body;
                let itemDescription = (result.description != "" ? result.description : "?");
                let cleanItemDescription = itemDescription.replace(/([^][0-9A-F][0-9A-F])([0-9A-F][0-9A-F])([0-9A-F][0-9A-F])/gi, "");
                
                const embed = new Discord.RichEmbed()
                        .setColor("#ffc0b9")
                        .setThumbnail("http://imgs.ratemyserver.net/items/large/"+ row[x].id +".gif")
                        .setURL("https://www.divine-pride.net/database/item/"+ row[x].id +"/")
                        .setFooter("https://www.divine-pride.net/database/item/"+ row[x].id +"/")
                        .addField("Item Name", row[x].name_japanese + weaponSlot, false)
                        .addField("Pice", row[x].price_buy, true)
                        .addField("Refineable", weaponRefineable, true)
                        .addField("Item Script", itemScript, false)
                        .addField("Description", cleanItemDescription);

                    message.channel.send({embed});

                    tempMsg.delete();
            });
        }
    });
}