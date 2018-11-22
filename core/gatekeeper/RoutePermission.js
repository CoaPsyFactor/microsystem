"use strict";
var RoutePermission = (function () {
    function RoutePermission(roles, hasAccess) {
        var _this = this;
        this.roles = {};
        this.hasAccess = false;
        roles.map(function (role) {
            _this.roles[role.id] = role;
        });
        this.hasAccess = hasAccess;
    }
    RoutePermission.prototype.hasRole = function (roleId) {
        return typeof this.roles[roleId] !== 'undefined';
    };
    return RoutePermission;
}());
exports.RoutePermission = RoutePermission;
