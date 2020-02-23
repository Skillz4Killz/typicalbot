import { Collection } from 'discord.js';
import DefaultSettings from '../structures/Settings.js';
import Cluster from '../index.js';
import { GuildSettings } from '../types/typicalbot.js';

export default class SettingHandler extends Collection<string, GuildSettings> {
    client: Cluster;
    constructor(client: Cluster) {
        super();
        this.client = client;
    }

    async fetch(id: string) {
        if (this.has(id)) return this.get(id) as GuildSettings;

        const row = (await this.client.handlers.database.get(
            'guilds',
            id
        )) as GuildSettings;

        if (!row) return this.create(id);

        this.set(id, row);
        return row;
    }

    async create(id: string) {
        const payload = DefaultSettings(id) as GuildSettings;

        await this.client.handlers.database.insert('guilds', payload);
        this.set(id, payload);

        return payload;
    }

    async update(id: string, payload: object = {}) {
        const updated = await this.client.handlers.database.update('guilds', id, payload);

        if (updated.changes) this.set(id, updated.changes[0].new_val);

        return true;
    }
}
