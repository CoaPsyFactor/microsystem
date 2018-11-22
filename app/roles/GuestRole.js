"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Role_1 = require("../../core/gatekeeper/Role");
var GuestRole = (function (_super) {
    __extends(GuestRole, _super);
    function GuestRole() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 'guest';
        return _this;
    }
    return GuestRole;
}(Role_1.Role));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GuestRole;
