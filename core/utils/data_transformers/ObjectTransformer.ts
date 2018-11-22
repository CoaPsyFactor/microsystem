import {IDataTransformer} from "../DataTransformer";

export class ObjectTransformer implements IDataTransformer<Object>
{
    getTransformed(input: any): Object
    {

        if (typeof input === 'string') {

            try {

                return JSON.parse(input);

            } catch (exception) {

                console.warn('Input is not valid json');

                exception = null;

            }

        }

        return new Object(input);

    }

}
