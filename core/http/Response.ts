import {ServerResponse} from 'http';
import {IDisposable} from '../System';

export default class Response implements IDisposable
{

    private response: ServerResponse;

    public constructor(serverResponse: ServerResponse)
    {

        this.response = serverResponse;

    }

    /**
     *
     * Finish request with given status code
     *
     * @param {*} data
     * @param {Number} status
     */
    public send(data: any, status: number = 200)
    {

        this.response.statusCode = status;

        this.response.end(typeof data === 'object' ? JSON.stringify(data) : data.toString());

    }

    public dispose()
    {

        this.response = null;

    }
}

export { Response }