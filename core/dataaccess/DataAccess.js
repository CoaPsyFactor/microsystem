"use strict";
var MongoClient = require('mongodb').MongoClient;
var DataAccess = (function () {
    function DataAccess(configuration, connectionCallbackHandler) {
        var _this = this;
        this.host = configuration.host;
        this.port = configuration.port;
        this.user = typeof configuration.user === 'string' && configuration.user.length ? configuration.user : null;
        this.password = typeof configuration.password === 'string' && configuration.password.length ? configuration.password : null;
        this.collection = configuration.collection;
        var connectionQuery = "mongodb://" + this.host + ":" + this.port + "/" + this.collection;
        if (this.user && this.password) {
            connectionQuery = "mongodb://" + this.user + ":" + this.password + "@" + this.host + ":" + this.port + "/?authMechanism=DEFAULT&authSource=" + this.collection;
        }
        this.connection = MongoClient.connect(connectionQuery, function (error, database) {
            if (error) {
                throw error;
            }
            _this.database = database;
            connectionCallbackHandler.call(null, _this);
        });
    }
    DataAccess.prototype.getDatabase = function () {
        if (typeof this.database === 'undefined') {
            throw new Error('Client not connected to MongoDB');
        }
        return this.database;
    };
    DataAccess.prototype.dispose = function () {
        var _this = this;
        this.connection.close(function (error) {
            if (error) {
                console.error(error);
            }
            _this.collection = null;
            _this.connection = null;
            _this.host = null;
            _this.port = null;
            _this.user = null;
            _this.password = null;
        });
    };
    return DataAccess;
}());
exports.DataAccess = DataAccess;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataAccess;
