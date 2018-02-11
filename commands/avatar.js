const Discord = require("discord.js");

exports.run = async(bot, message, args) => {
    let tempMsg = await message.channel.send("Generating avatar...");
    let target = message.mentions.users.first() || message.author;

    const embed = new Discord.RichEmbed()
        .setAuthor("Do you know da wae?", "https://i.imgur.com/1eJ1q0V.jpg")
        .setImage(target.displayAvatarURL)
        .setColor("#ffc0b9");
        
        message.channel.send({embed});

        tempMsg.delete();
}