const __DEV__ = process.env.NODE_ENV === 'development';

/** Returns true if "thing" is either a string primitive or String object.*/
export function isString(thing: unknown) {
    return typeof thing === 'string' || thing instanceof String;
}
/** Returns true if "thing" is either a number primitive or a Number object.*/
export function isNumber(thing: unknown) {
    return typeof thing === 'number' || thing instanceof Number;
}
/** Returns true if "thing" is a Date object containing a valid date.*/
export function isValidDate(thing: unknown) {
    return thing instanceof Date && !isNaN(thing.valueOf());
}
/** Returns whether or not the given, array, string, or argument list contains the given item or substring.
 *
 * This function is awfully similar to Array.includes, but has the added plus of accepting any number or type of arguments.*/
export function has(o: unknown, ...arr: unknown[]) {
    if (arr.length === 1 && (Array.isArray(arr[0]) || isString(arr[0]))) {
        return (arr[0] as unknown[]).includes(o);
    } else {
        return arr.includes(o);
    }
}
/** Returns the first value unless it is undefined, null or NaN.
 *
 * This is very useful for boolean, string and integer parameters
 * where we want to keep false, "" and 0 if they were supplied.
 *
 * Similar purpose to default parameters with the difference being that this function will return
 * the second value if the first is NaN or null, while default params will give give you the NaN or the null.
 */
export function setDefault(paramValue: unknown, defValue: unknown) {
    if (
        typeof paramValue === 'undefined' ||
        paramValue === null ||
        isNaN(paramValue as number)
    ) {
        return defValue;
    } else {
        return paramValue;
    }
}
/**
 * Returns an array containing a range of integers.
 * @param {Number} [start] The number to start at. The start number is included in the results.
 * If only one argument is supplied, start will be set to 1.
 * @param {Number} end The top end of the range.
 * Unlike Pythons range function, The end number is included in the results.
 * @returns {[Number]}
 */
export function range(start: number, end?: number) {
    const startNumber = typeof (end) === 'undefined' ? 1 : start,
        endNumber = typeof (end) === 'undefined' ? start : end;

    return Array.from({ length: endNumber - startNumber + 1 }, (v, i) => startNumber + i);
}
/**
 * Log message to console
 * @param {string} txt
 */
export function log(txt: string, ...optionalItems: any[]) {
    if (__DEV__) {
        console.log(txt, ...optionalItems);
    }
}
/**
 * Warn message to console
 * @param {string} txt
 */
export function warn(txt: string, ...optionalItems: any[]) {
    if (__DEV__) {
        console.warn(txt, ...optionalItems);
    }
}
/**
 * Error message to console
 * @param {*} txt
 */
export function error(txt: string, ...optionalItems: any[]) {
    if (__DEV__) {
        console.error(txt, ...optionalItems);
    }
}