const Discord = require("discord.js");

exports.run = async(bot, message, args) => {
    const embed = new Discord.RichEmbed()
        .setAuthor("🍭 Hi! I am Poring Bot ", "", "https://github.com/iamtonysoft")
        .setFooter("Made by iamtonysoft")
        .setThumbnail("https://avatars2.githubusercontent.com/u/23303913?s=400&v=4")
        .setColor("#ffc0b9")
        .addField("Default Commands", "!avatar / !avatar @tag")
        .addField("Ragnarok Commands", "!item jellopy\n!mob poring\n!drop jellopy")

    message.channel.send({embed});
}