const config = require("../config.json");
const snekfetch = require("snekfetch");
const Discord = require("discord.js");

function convertTime(num) {
    var minutes = Math.floor(num / 60000);
    var seconds = ((num % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

exports.run = async(client, message, args, sqlCon) => {
    if(!args[0]) return message.channel.send("Please enter the item name, Example: _!item jellopy_");
    let text = args.join(" ");
    let tempMsg = await message.channel.send("Fetching...");

    sqlCon.query(`SELECT 
            mob_db_re.ID,
            mob_db_re.iName as iName,
            mob_db_re.LV,
            mob_db_re.HP,
            mob_db_re.SP,
            mob_db_re.EXP,
            mob_db_re.JEXP,
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
            FROM mob_db_re
            LEFT JOIN item_db_re i1 ON mob_db_re.Drop1id = i1.id
            LEFT JOIN item_db_re i2 ON mob_db_re.Drop2id = i2.id
            LEFT JOIN item_db_re i3 ON mob_db_re.Drop3id = i3.id
            LEFT JOIN item_db_re i4 ON mob_db_re.Drop4id = i4.id
            LEFT JOIN item_db_re i5 ON mob_db_re.Drop5id = i5.id
            LEFT JOIN item_db_re i6 ON mob_db_re.Drop6id = i6.id
            LEFT JOIN item_db_re i7 ON mob_db_re.Drop7id = i7.id
            LEFT JOIN item_db_re i8 ON mob_db_re.Drop8id = i8.id
            LEFT JOIN item_db_re i9 ON mob_db_re.Drop9id = i9.id
            LEFT JOIN item_db_re card ON mob_db_re.DropCardid = card.id
            WHERE iName = '${text}'`, (err,row) => {
                if(err) return message.channel.send(err) + tempMsg.delete();
                if(!row[0]) return message.channel.send("No available data to show.") + tempMsg.delete();

                let mobLink = "https://www.divine-pride.net/api/database/monster/";

                var api = mobLink + row[0].ID + config.apiKey;
                    
                snekfetch.get(api).then(r => {
                    let result = r.body;
                    let spawn = result.spawn;
                    let mapSpawn = [];
                    
                    for(let x in spawn) {
                        if(mapSpawn.indexOf(spawn[x].mapname) == -1) {
                            mapSpawn.push(spawn[x].mapname);
                        }
                    }

                    let drops = row[0].Drop1 + ", " + row[0].Drop2 + ", " + row[0].Drop3 
                    + "\n" + row[0].Drop4 + ", " + row[0].Drop5 + ", " + row[0].Drop6 
                    + "\n" + row[0].Drop7 + ", " + row[0].Drop8 + ", " + row[0].Drop9;
                
                    const embed = new Discord.RichEmbed()
                        .setColor("#ffc0b9")
                        .setThumbnail("http://file5.ratemyserver.net/mobs/"+ row[0].ID +".gif")
                        .setURL("https://www.divine-pride.net/database/monster/"+ row[0].ID +"/")
                        .setFooter("https://www.divine-pride.net/database/monster/"+ row[0].ID +"/")
                        .addField("Monster Name", row[0].iName)
                        .addField("Level", row[0].LV, true)
                        .addField("HP", row[0].HP, true)
                        .addField("Base Exp", row[0].EXP, true)
                        .addField("Job Exp", row[0].JEXP, true)
                        .addField("Drops", drops)
                        .addField("Card Drop", row[0].Card, true)
                        .addField("Spawn", mapSpawn);
                
                    message.channel.send({embed});

                    tempMsg.delete();
                });
        });
};