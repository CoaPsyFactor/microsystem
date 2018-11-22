"use strict";
var Role = (function () {
    function Role() {
    }
    Role.prototype.dispose = function () {
        // delete.this.id;
        // delete.this.scope;
    };
    return Role;
}());
Role.DEFAULT_TOKEN_LIFESPAN = 60;
exports.Role = Role;
