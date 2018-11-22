import Micro from './core/System';

import { isWorker, isMaster } from 'cluster';
import { env } from 'process'

import { Services } from './core/services/Services';

import { Service } from './core/services/Service';
import DataAccess from './core/dataaccess/DataAccess';
import Roles from './core/gatekeeper/Roles';
import GuestRole from './app/roles/GuestRole';
import UserRole from './app/roles/UserRole';
import ModeratorRole from './app/roles/ModeratorRole';
import SuperUserRole from './app/roles/SuperUserRole';
import {CacheService} from "./app/services/Cache/CacheService";

const registeredServices: Service[] = [
    new CacheService(8889)
];

const roles = new Roles();

roles.addRoles([
    new GuestRole(),
    new UserRole(),
    new ModeratorRole(),
    new SuperUserRole()
]);

const micro = new Micro.System({ roles: roles, serviceMaxCrashTimes: 5 });

const processType = typeof env.type === 'string' && env.type === 'service' ? env.type : null;

const serviceName = typeof env.service === 'string' ? env.service : null;

const servicePort = false === isNaN(Number(env.port || NaN)) ? env.port : null;

if ( isMaster ) {

    let services: Services = new Services();

    services.registerServices(registeredServices);

    micro.start(services);

} else if ( isWorker && processType && serviceName ) {

    let appConfig = require('./app/config.json');

    new DataAccess(appConfig.mongo || {}, (dataAccess: DataAccess) => {

        console.log('Established connection with MongoDB');

        let registeredService: Service[] = [];

        registeredService = registeredServices.filter((service: Service, index: number) => {

            if (service.name === serviceName && 0 === registeredService.length) {

                micro.startService(service, servicePort, dataAccess);

                return true;
            }

            // Dispose service as its not usable
            service.dispose();

            delete registeredServices[index];

            return false;
        });

        if (0 === registeredService.length) {
            throw new Error(`Failed to initialize service ${serviceName}`);
        }

        // Free some memory :)
        delete registeredService[0];
    });



}