const wait = async (seconds: number) => {
    await new Promise((r) => setTimeout(r, seconds * 1000));
};

const asyncForEach = async (
    array: Array<any>,
    callback: (val: any, index: number, array: Array<any>) => void
) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

/**
 * Returns a new array with element at fromIndex at toIndex.
 * @param arr
 * @param fromIndex
 * @param toIndex
 * @returns
 */
const switchIndex = (arr: any[], fromIndex: number, toIndex: number) => {
    const element = arr[fromIndex];
    const tempArr = arr.slice();
    tempArr.splice(fromIndex, 1);
    tempArr.splice(toIndex, 0, element);
    return tempArr;
};

const Helper = { wait, asyncForEach, switchIndex };
export default Helper;
