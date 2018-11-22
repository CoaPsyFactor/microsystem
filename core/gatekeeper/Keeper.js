"use strict";
var GuestRole_1 = require("../../app/roles/GuestRole");
var randomString = require("randomstring");
var RoutePermission_1 = require("./RoutePermission");
var Keeper = (function () {
    /**
     * @param {Roles} roles All existing roles that are shared between requests for permission checking
     */
    function Keeper(roles) {
        this.registeredRoles = roles;
        this.fallbackRole = typeof roles.roles['fallback'] === 'undefined' ? new GuestRole_1.default() : roles.roles['fallback'];
    }
    /**
     *
     * Inserts role permission for token to mongo - ignores if duplicate token
     *
     * @param {Service} service
     * @param {Role} role
     * @param {*} entityId
     * @param {Function} callback
     *
     */
    Keeper.prototype.createServiceRoleToken = function (service, role, entityId, callback) {
        var collection = this.database.collection('gatekeeper_tokens');
        (function insert() {
            var token = randomString.generate(64);
            collection.findOne({ token: token }, function (error, foundEntity) {
                if (error) {
                    return (typeof callback === 'function' ? callback.call(null, error, null) : null);
                }
                if (foundEntity) {
                    return insert();
                }
                var entity = {
                    token: token,
                    serviceIdentifier: service.name,
                    role: role.id,
                    lifeSpan: Keeper.DEFAULT_TOKEN_LIFE,
                    lastUsed: Math.round((new Date()).getTime() / 1000),
                    entityId: entityId
                };
                collection.insertOne(entity, function (error, response) {
                    if (error) {
                        throw error;
                    }
                    if (response && response.insertedId) {
                        entity.id = response.insertedId;
                        return (typeof callback === 'function' ? callback.call(null, null, entity) : null);
                    }
                    return (typeof callback === 'function' ? callback.call(null, null, null) : null);
                });
            });
        })();
    };
    /**
     *
     * @param {IRoute} route
     * @param {Role} role
     * @returns {IRoutePermission}
     */
    Keeper.prototype.getPermissions = function (route, role) {
        var roles = [];
        if (route.roles instanceof Array) {
            route.roles.map(function (routeRoleIdentifier) {
                var routeRole = new routeRoleIdentifier();
                if (role.id === routeRole.id) {
                    roles.push(role);
                }
                if (false === role.scope instanceof Array) {
                    return;
                }
                role.scope.map(function (roleScopeIdentifier) {
                    var roleScope = new roleScopeIdentifier();
                    if (roleScope.id !== routeRole.id) {
                        return;
                    }
                    if (-1 === roles.indexOf(role)) {
                        roles.push(role);
                    }
                    roles.push(roleScope);
                });
            });
        }
        return new RoutePermission_1.RoutePermission(roles, Object.keys(roles || {}).length > 0);
    };
    /**
     *
     * Set database parameter of current Keeper instance to MongoDB connection handler database
     *
     * @param {DataAccess} dataAccess
     */
    Keeper.prototype.setMongoDatabase = function (dataAccess) {
        if (dataAccess && dataAccess.getDatabase()) {
            this.database = dataAccess.getDatabase();
        }
    };
    /**
     *
     * TODO implement toke lifespan and remove it if its not valid
     *
     *
     * @param {String} token
     * @param {Service} service
     * @param {Function} onFinish
     * @return {IRole}
     */
    Keeper.prototype.getServiceRoleByToken = function (token, service, onFinish) {
        var _this = this;
        if (typeof this.database === 'undefined') {
            throw new Error('Missing MongoDB connection for Keeper.');
        }
        var collection = this.database.collection('gatekeeper_tokens');
        collection.findOne({ token: token, serviceIdentifier: service.name }, function (error, entity) {
            if (error) {
                throw error;
            }
            if (null === entity) {
                if (typeof onFinish === 'function') {
                    onFinish.call(null, _this.fallbackRole, token);
                }
                return;
            }
            var roles = _this.registeredRoles.roles;
            var role = typeof roles[entity.role] === 'undefined' ? null : roles[entity.role];
            if (typeof onFinish === 'function') {
                onFinish.call(null, role, token);
            }
        });
    };
    Keeper.prototype.dispose = function () {
        // delete.this.service;
        // delete.this.database;
        // delete.this.registeredRoles;
        // delete.this.fallbackRole;
    };
    return Keeper;
}());
/** @param {Number} DEFAULT_TOKEN_LIFE Default time of token existence in seconds */
Keeper.DEFAULT_TOKEN_LIFE = 60;
exports.Keeper = Keeper;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Keeper;
