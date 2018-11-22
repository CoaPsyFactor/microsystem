import {Service} from "../../../core/services/Service";
import {IKeeperToken} from "../../../core/gatekeeper/Keeper";
import {ServiceHttpController} from "../../../core/services/ServiceHttpController";
import CacheServiceHttpController from "./CacheServiceHttpController";

export class CacheService extends Service
{

    public readonly cachedContent: {[key: string]: any} = {};

    public constructor(port: number)
    {

        super('cache-bucket', port);

    }

    public getServiceHttpController(): ServiceHttpController<CacheService> {

        return new CacheServiceHttpController(this);

    }

    public createToken(): Promise<IKeeperToken>
    {
        return undefined;
    }

}
