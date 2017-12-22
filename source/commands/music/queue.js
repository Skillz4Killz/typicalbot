const Command = require("../../structures/Command");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Displays a list of videos queued to stream.",
            usage: "queue",
            mode: "lite",
            access: 1
        });
    }

    execute(message, parameters, permissionLevel) {
        const connection = message.guild.voiceConnection;
        if (!connection) return message.send(`Nothing is currently streaming.`);

        if (connection.guildStream.mode !== "queue") return message.error("This command only works while in queue mode.");

        const queue = connection.guildStream.queue;

        const short = text => this.client.functions.lengthen(-1, text, 45),
            time = len => this.client.functions.convertTime(len * 1000);

        if (!queue.length) return  message.send(`**__Queue:__** There are no videos in the queue.\n\n**__Currently Streaming:__** **${short(connection.guildStream.current.title)}** (${time(connection.guildStream.current.length_seconds)}) | Requested by **${connection.guildStream.current.requester.author.username}**`);

        const list = queue.slice(0, 10);

        const content = list.map(s => `● **${short(s.title)}** (${time(s.length_seconds)}) | Requested by **${s.requester.author.username}**`).join("\n");
        let length = 0; queue.forEach(s => length += Number(s.length_seconds));

        message.send(`**__Queue:__** There are **${queue.length}** videos in the queue. The queue will last for **${time(length)}.**\n\n${content}${queue.length > 10 ? `\n*...and ${queue.length - 10} more.*` : ""}\n\n**__Currently Streaming:__** **${short(connection.guildStream.current.title)}** (${time(connection.guildStream.current.length_seconds)}) | Requested by **${connection.guildStream.current.requester.author.username}**`);
    }
};