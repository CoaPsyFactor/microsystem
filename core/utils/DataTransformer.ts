export interface IDataTransformer<T>
{

    /**
     *
     * Transform input value to described type
     *
     * @param {*} input
     */
    getTransformed(input: any): T;

}
