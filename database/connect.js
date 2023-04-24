const { MongoClient } = require('mongodb');

class Database {
    constructor() {
        this.dbName = 'uphonse';
        this.uri = `mongodb://127.0.0.1:27017/${this.dbName}`;
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async connect() {
        if (!this.isConnected()) {
            try {
                await this.client.connect();
                console.log('Connected to MongoDB');
            } catch (err) {
                console.error('Error connecting to MongoDB', err);
            }
        }
    }

    isConnected() {
        return this.client.isConnected();
    }

    async disconnect() {
        if (this.isConnected()) {
            await this.client.close();
            console.log('Disconnected from MongoDB');
        }
    }
    getDatabase() {
        return this.client.db(this.dbName);
    }
}

const instance = new Database();
module.exports = instance;