import {IDataTransformer} from "../DataTransformer";

export class IntegerTransformer implements IDataTransformer<number>
{
    /**
     *
     * Return input value converted into integer
     *
     * @param {*} input
     * @returns {number}
     */
    getTransformed(input: any): number {

        let output: number = 0;

        try {

            output = parseInt(input);

        } catch (exception) {

            exception = null;

        }

        return output;
    }

}
