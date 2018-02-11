const config = require("../config.json");
const snekfetch = require("snekfetch");
const Discord = require("discord.js");

function convertTime(num) {
    var minutes = Math.floor(num / 60000);
    var seconds = ((num % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

exports.run = async(client, message, args, sqlCon) => {
    if(!args[0]) return message.channel.send("Please enter the item name, Example: _!item jellopy_");
    let text = args.join(" ");
    let tempMsg = await message.channel.send("Fetching...");

    sqlCon.query(`SELECT
            mob.ID,
            mob.iName,
            mob.LV,
            COALESCE(i1.name_japanese, '-') as Drop1,
            COALESCE(i2.name_japanese, '-') as Drop2,
            COALESCE(i3.name_japanese, '-') as Drop3,
            COALESCE(i4.name_japanese, '-') as Drop4,
            COALESCE(i5.name_japanese, '-') as Drop5,
            COALESCE(i6.name_japanese, '-') as Drop6,
            COALESCE(i7.name_japanese, '-') as Drop7,
            COALESCE(i8.name_japanese, '-') as Drop8,
            COALESCE(i9.name_japanese, '-') as Drop9,
            COALESCE(card.name_japanese, '-') as Card
            FROM mob_db_re mob 
            LEFT JOIN item_db_re i1   
            ON mob.Drop1id = i1.id
            LEFT JOIN item_db_re i2   
            ON mob.Drop2id = i2.id
            LEFT JOIN item_db_re i3   
            ON mob.Drop3id = i3.id
            LEFT JOIN item_db_re i4   
            ON mob.Drop4id = i4.id
            LEFT JOIN item_db_re i5   
            ON mob.Drop5id = i5.id
            LEFT JOIN item_db_re i6   
            ON mob.Drop6id = i6.id
            LEFT JOIN item_db_re i7   
            ON mob.Drop7id = i7.id
            LEFT JOIN item_db_re i8   
            ON mob.Drop8id = i8.id
            LEFT JOIN item_db_re i9   
            ON mob.Drop9id = i9.id
            LEFT JOIN item_db_re card
            ON mob.DropCardid = card.id
            WHERE i1.name_japanese = '${text}' 
            OR i2.name_japanese = '${text}'
            OR i3.name_japanese = '${text}'
            OR i4.name_japanese = '${text}'
            OR i5.name_japanese = '${text}'
            OR i6.name_japanese = '${text}'
            OR i7.name_japanese = '${text}'
            OR i8.name_japanese = '${text}'
            OR i9.name_japanese = '${text}'
            OR card.name_japanese = '${text}'`, (err,row) => {
                if(err) return message.channel.send(err) + tempMsg.delete();
                if(!row[0]) return message.channel.send("No available data to show.") + tempMsg.delete();

                let mobLink = "https://www.divine-pride.net/api/database/monster/";

                let api = mobLink + row[0].ID + config.apiKey;
                snekfetch.get(api).then(r => {
                    let result = r.body;

                    let spawn = result.spawn;
                    let mapSpawn = [];
                    
                    for(let i in spawn) {
                        mapSpawn.push("**" + spawn[i].mapname + "** - Amount: " + spawn[i].amount + " | Respawn Time: " + convertTime(spawn[i].respawnTime));
                    }

                    for(let x in row) {
                        const embed = new Discord.RichEmbed()
                                .setColor("#ffc0b9")
                                .setAuthor(toTitleCase(text))
                                .setThumbnail("http://file5.ratemyserver.net/mobs/"+ row[x].ID +".gif")
                                .setURL("https://www.divine-pride.net/database/monster/"+ row[x].ID +"/")
                                .setFooter("https://www.divine-pride.net/database/monster/"+ row[x].ID +"/")
                                .addField("Name", row[x].iName, true)
                                .addField("Level", row[x].LV, true);
                    
                            message.channel.send({embed});

                            tempMsg.delete();
                    }
                });
    });
}
