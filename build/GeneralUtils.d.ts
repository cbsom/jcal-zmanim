/** Returns true if "thing" is either a string primitive or String object.*/
export declare function isString(thing: unknown): boolean;
/** Returns true if "thing" is either a number primitive or a Number object.*/
export declare function isNumber(thing: unknown): boolean;
/** Returns true if "thing" is a Date object containing a valid date.*/
export declare function isValidDate(thing: unknown): boolean;
/** Returns whether or not the given, array, string, or argument list contains the given item or substring.
 *
 * This function is awfully similar to Array.includes, but has the added plus of accepting any number or type of arguments.*/
export declare function has(o: unknown, ...arr: unknown[]): boolean;
/** Returns the first value unless it is undefined, null or NaN.
 *
 * This is very useful for boolean, string and integer parameters
 * where we want to keep false, "" and 0 if they were supplied.
 *
 * Similar purpose to default parameters with the difference being that this function will return
 * the second value if the first is NaN or null, while default params will give give you the NaN or the null.
 */
export declare function setDefault(paramValue: unknown, defValue: unknown): unknown;
/**
 * Returns an array containing a range of integers.
 * @param {Number} [start] The number to start at. The start number is included in the results.
 * If only one argument is supplied, start will be set to 1.
 * @param {Number} end The top end of the range.
 * Unlike Pythons range function, The end number is included in the results.
 * @returns {[Number]}
 */
export declare function range(start: number, end?: number): number[];
/**
 * Log message to console
 * @param {string} txt
 */
export declare function log(txt: string, ...optionalItems: any[]): void;
/**
 * Warn message to console
 * @param {string} txt
 */
export declare function warn(txt: string, ...optionalItems: any[]): void;
/**
 * Error message to console
 * @param {*} txt
 */
export declare function error(txt: string, ...optionalItems: any[]): void;
