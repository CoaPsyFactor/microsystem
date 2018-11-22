import {IDisposable} from '../System';
let MongoClient = require('mongodb').MongoClient;

export default class DataAccess implements IDisposable
{
    /** @param {String} host MongoDB server address */
    private host: string;

    /** @param {Number} port MongoDB server port */
    private port: number;

    /** @param {String} collection MongoDB database name */
    private collection: string;

    /** @param {String} user MongoDB username */
    private user: string;

    /** @param {String} password MongoDB password */
    private password: string;

    /** @param {Object} connection MongoDB connection handle */
    private connection: any;

    /** @param {Object} database MongoDB connection handle database */
    private database: any;

    public constructor(configuration: IMongoConfiguration, connectionCallbackHandler: Function)
    {
        this.host = configuration.host;

        this.port = configuration.port;

        this.user = typeof configuration.user === 'string' && configuration.user.length ? configuration.user : null;

        this.password = typeof configuration.password === 'string' && configuration.password.length ? configuration.password : null;

        this.collection = configuration.collection;

        let connectionQuery: string = `mongodb://${this.host}:${this.port}/${this.collection}`;

        if (this.user && this.password) {

            connectionQuery = `mongodb://${this.user}:${this.password}@${this.host}:${this.port}/?authMechanism=DEFAULT&authSource=${this.collection}`;

        }

        this.connection = MongoClient.connect(connectionQuery, (error, database) => {

            if (error) {
                throw error;
            }

            this.database = database;

            connectionCallbackHandler.call(null, this);

        });

    }

    public getDatabase()
    {
        if (typeof this.database === 'undefined') {
            throw new Error('Client not connected to MongoDB');
        }

        return this.database;
    }

    public dispose()
    {

        this.connection.close((error) => {

            if (error) {
                console.error(error);
            }

            this.collection = null;

            this.connection = null;

            this.host = null;

            this.port = null;

            this.user = null;

            this.password = null;

        });

    }

}

export interface IMongoConfiguration
{
    /** @param {String} host MongoDB server address */
    readonly host: string;

    /** @param {Number} port MongoDB server port */
    readonly port: number;

    /** @param {String} collection MongoDB database name */
    readonly collection: string;

    /** @param {String} user MongoDB username */
    readonly user?: string;

    /** @param {String} password MongoDB password */
    readonly password?: string;
}

export { DataAccess }