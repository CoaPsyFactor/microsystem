"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Service_1 = require("../../../core/services/Service");
var CacheServiceHttpController_1 = require("./CacheServiceHttpController");
var CacheService = (function (_super) {
    __extends(CacheService, _super);
    function CacheService(port) {
        var _this = _super.call(this, 'cache-bucket', port) || this;
        _this.cachedContent = {};
        return _this;
    }
    CacheService.prototype.getServiceHttpController = function () {
        return new CacheServiceHttpController_1.default(this);
    };
    CacheService.prototype.createToken = function () {
        return undefined;
    };
    return CacheService;
}(Service_1.Service));
exports.CacheService = CacheService;
