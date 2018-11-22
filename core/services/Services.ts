'use strict';
import {Service} from './Service';
import {IDisposable} from '../System';

export class Services implements IDisposable
{

    /** @param {Service[]} services Registered services */
    public readonly services: {[name: string]: Service} = {};

    /**
     *
     * @param {Service} service Service that will be registered
     */
    public registerService(service: Service) : void
    {
        if (typeof this.services[service.name] !== 'undefined') {
            throw new Error(`Service ${service.name} already registered.`);
        }

        this.services[service.name] = service;

    }

    public registerServices(services: any[])
    {
        services.forEach((service: Service) => {

            this.registerService(service);

        });
    }

    public dispose()
    {

        // delete.this.services;

    }
}