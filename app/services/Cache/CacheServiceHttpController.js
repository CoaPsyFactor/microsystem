"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ServiceHttpController_1 = require("../../../core/services/ServiceHttpController");
var GuestRole_1 = require("../../roles/GuestRole");
var Request_1 = require("../../../core/http/Request");
var ObjectTransformer_1 = require("../../../core/utils/data_transformers/ObjectTransformer");
var BooleanTransformer_1 = require("../../../core/utils/data_transformers/BooleanTransformer");
var CacheServiceHttpController = (function (_super) {
    __extends(CacheServiceHttpController, _super);
    function CacheServiceHttpController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.routes = [
            {
                route: '/bucket/list',
                handler: _this.list.bind(_this),
                roles: [
                    GuestRole_1.default
                ],
                methods: [
                    Request_1.RequestMethod.GET
                ]
            },
            {
                route: '/bucket/put',
                handler: _this.put.bind(_this),
                roles: [
                    GuestRole_1.default
                ],
                methods: [
                    Request_1.RequestMethod.GET
                ]
            }
        ];
        return _this;
    }
    CacheServiceHttpController.prototype.list = function (request, response) {
        response.send(this.service.cachedContent, 200);
    };
    /**
     *
     * Puts value assigned to given key into cache
     *
     * @param {Request} request
     * @param {Response} response
     * @returns {void}
     */
    CacheServiceHttpController.prototype.put = function (request, response) {
        var key = request.get('key', '');
        if (typeof key !== 'string' || 0 === key.length) {
            return response.send({ error: true, message: 'Missing property key.' }, 400);
        }
        var value = request.get('value', '', new ObjectTransformer_1.ObjectTransformer());
        if (false === request.get('multi', false, new BooleanTransformer_1.BooleanTransformer())) {
            this.service.cachedContent[key] = value;
        }
        else {
            if (false === this.service.cachedContent[key] instanceof Array) {
                this.service.cachedContent[key] = [];
            }
            this.service.cachedContent[key].push(value);
        }
        return response.send({ error: false, data: this.service.cachedContent[key] });
    };
    CacheServiceHttpController.prototype.handlePermission = function (token, permission) {
    };
    return CacheServiceHttpController;
}(ServiceHttpController_1.ServiceHttpController));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CacheServiceHttpController;
