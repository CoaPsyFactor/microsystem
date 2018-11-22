import {IDataTransformer} from "../DataTransformer";

export class BooleanTransformer implements IDataTransformer<boolean>
{
    getTransformed(input: any): boolean
    {

        let cleanInput = input.toLowerCase();

        if (typeof input === 'string') {

            return 'false' === cleanInput ? false : 'true' === cleanInput;

        }

        return Boolean(input || false);

    }

}