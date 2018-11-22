import {ServiceHttpController} from "../../../core/services/ServiceHttpController";
import {IRoute} from "../../../core/http/Router";
import GuestRole from "../../roles/GuestRole";
import {Request, RequestMethod} from '../../../core/http/Request';
import {Response} from '../../../core/http/Response';
import {ObjectTransformer} from "../../../core/utils/data_transformers/ObjectTransformer";
import {BooleanTransformer} from "../../../core/utils/data_transformers/BooleanTransformer";
import {CacheService} from "./CacheService";
import {IRoutePermission} from "../../../core/gatekeeper/RoutePermission";

export default class CacheServiceHttpController extends ServiceHttpController<CacheService>
{

    readonly routes: IRoute[] = [
        {

            route: '/bucket/list',

            handler: this.list.bind(this),

            roles: [

                GuestRole

            ],

            methods: [

                RequestMethod.GET

            ]

        },
        {

            route: '/bucket/put',

            handler: this.put.bind(this),

            roles: [

                GuestRole

            ],

            methods: [

                RequestMethod.GET

            ]

        }
    ];

    public list(request: Request, response: Response)
    {

        response.send(this.service.cachedContent, 200);

    }

    /**
     *
     * Puts value assigned to given key into cache
     *
     * @param {Request} request
     * @param {Response} response
     * @returns {void}
     */
    public put(request: Request, response: Response): void
    {

        let key = request.get('key', '');

        if (typeof key !== 'string' || 0 === key.length) {

            return response.send({error: true, message: 'Missing property key.'}, 400);

        }

        let value = request.get('value', '', new ObjectTransformer());

        if (false === request.get('multi', false, new BooleanTransformer())) {

            this.service.cachedContent[key] = value;

        } else {

            if (false === this.service.cachedContent[key] instanceof Array) {

                this.service.cachedContent[key] = [];

            }

            this.service.cachedContent[key].push(value);

        }

        return response.send({error: false, data: this.service.cachedContent[key]});

    }

    handlePermission(token: string, permission: IRoutePermission): void
    {

    }

}