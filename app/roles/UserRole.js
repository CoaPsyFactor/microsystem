"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Role_1 = require("../../core/gatekeeper/Role");
var GuestRole_1 = require("./GuestRole");
var UserRole = (function (_super) {
    __extends(UserRole, _super);
    function UserRole() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 'user';
        _this.scope = [
            new GuestRole_1.default
        ];
        return _this;
    }
    return UserRole;
}(Role_1.Role));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserRole;
