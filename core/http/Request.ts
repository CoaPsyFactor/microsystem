import {IncomingMessage} from 'http';

import { parse as parseUrl, Url } from 'url';

import { parse as parseUrlQuery } from 'querystring'
import {IDisposable} from '../System';
import {IDataTransformer} from "../utils/DataTransformer";

export default class Request implements IDisposable
{
    public readonly method: RequestMethod;

    public readonly url: string;

    private clientRequest: IncomingMessage;

    private parameters: {[parameters: string]: any};

    private urlParameters: {[parameter: string]: string} = {};

    private urlData: Url;

    /**
     * @param {IncomingMessage} incomingMessage default node IncomingMessage object
     */
    public constructor(incomingMessage: IncomingMessage)
    {

        this.clientRequest = incomingMessage;

        this.method = RequestMethod[incomingMessage.method];

        this.url = incomingMessage.url;

        this.urlData = parseUrl( this.url );

        this.parameters = parseUrlQuery( this.urlData.query || '' );

    }

    /**
     *
     * Attach route/url parameters to request class
     *
     * @param {Object} urlParameters Url parameter that should be set as used.
     */
    public setUrlParameters(urlParameters: {[parameter: string]: string})
    {
        this.urlParameters = urlParameters;
    }

    /**
     *
     * Retrieves requested parameter from request query as its default type.
     * In case that parameter does not exists, defaultValue will be returned.
     *
     * @param {String} key Name of property from request query
     * @param {*} defaultValue Value that is returned in case that requested parameter does not exists
     * @param {IDataTransformer<?>} dataTransformer Transformer used to convert input data to desire value
     * @returns {*}
     */
    public get(key: string, defaultValue: any = null, dataTransformer: IDataTransformer<any> = null): any
    {

        let value: any = typeof this.parameters[key] === 'undefined' ? defaultValue : this.parameters[key];

        if (dataTransformer && typeof dataTransformer.getTransformed === 'function') {

            return dataTransformer.getTransformed(value);

        }

        return value;
    }

    /**
     *
     * Retrieves requested parameter from request query as number type.
     * In case that parameter does not exists or that it isn't number defaultValue will be returned
     *
     * @param {String} key Name of property from request query
     * @param {Number} defaultValue Value that is returned in case that requested parameter does not exists
     * @returns {Number}
     */
    public getNumeric(key: string, defaultValue: number = null)
    {
        let value: any = this.get(key, NaN) as number;

        let numericValue = Number(value);

        return isNaN(numericValue) ? defaultValue : numericValue;
    }

    /**
     *
     * Retrieves value of parameter in route
     *
     * @param {String} key Name of route parameters placeholder, without :
     * @param {*} defaultValue Value that should be returned in case that parameter doesn't exists. Default: null
     *
     * @returns {*}
     */
    public getUrlParameter(key: string, defaultValue: any = null)
    {
        return typeof this.urlParameters[key] === 'undefined' ? defaultValue : this.urlParameters[key];
    }

    /**
     *
     * Retrieves token from headers or query parameters
     *
     * @returns {String}
     */
    public getToken() : string
    {

        let token: string = this.clientRequest.headers['_service_token'] || '';

        return this.get('_service_token', token);

    }

    public dispose()
    {

        this.urlParameters = null;

        this.clientRequest = null;

        this.urlData = null;

        this.parameters = null;

    }

}

export enum RequestMethod
{
    GET,
    POST,
    PUT,
    DELETE
}

export { Request }