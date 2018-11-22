"use strict";
var Roles = (function () {
    function Roles() {
        this.roles = {};
    }
    Roles.prototype.addRole = function (role) {
        if (typeof this.roles[role.id] !== 'undefined') {
            throw new Error("Role " + role.id + " already registered.");
        }
        this.roles[role.id] = role;
    };
    Roles.prototype.addRoles = function (roles) {
        var _this = this;
        if (false === roles instanceof Array) {
            console.error('Roles: Invalid roles provided.');
            return;
        }
        roles.forEach(function (role) {
            _this.addRole(role);
        });
    };
    Roles.prototype.getRole = function (id) {
        return typeof this.roles[id] === 'undefined' ? null : this.roles[id];
    };
    Roles.prototype.dispose = function () {
        // delete.this.roles;
    };
    return Roles;
}());
exports.Roles = Roles;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Roles;
