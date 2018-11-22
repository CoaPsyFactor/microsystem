import {IDataTransformer} from "../DataTransformer";

export class FloatTransformer implements IDataTransformer<number>
{
    /**
     *
     * Return input value converted into float
     *
     * @param {*} input
     * @returns {number}
     */
    getTransformed(input: any): number {

        let output: number = 0;

        try {

            output = parseFloat(input);

        } catch (exception) {

            exception = null;

        }

        return output;

    }

}
