const config = require("../config.json");
const snekfetch = require("snekfetch");
const Discord = require("discord.js");

exports.run = async(client, message, args, connection) => {
    if(!args[0]) return message.channel.send("Please enter the item name, Example: _!item ${text}_");
    const text = args.join(" ");
    const tempMsg = await message.channel.send("Fetching...");

    connection.query(`
        SELECT
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
        OR card.name_japanese = '${text}'`, (err, row) => {
            if(err) return message.channel.send(err) + tempMsg.delete();
            if(!row[0]) return message.channel.send("No available data to show.") + tempMsg.delete();
            
            tempMsg.delete();

            for(let x in row) {
                const embed = new Discord.RichEmbed()
                    .setColor("#ffc0b9")
                    .setAuthor("Who drops? " + text)
                    .setThumbnail("http://file5.ratemyserver.net/mobs/"+ row[x].ID +".gif")
                    .addField("Name", row[x].iName, true)
                    .addField("LV", row[x].LV, true)
                    .setDescription("ID: " + row[x].ID + "\nReference: https://www.divine-pride.net/database/monster/"+ row[x].ID +"/");

                message.channel.send({embed});
            }
    });
}