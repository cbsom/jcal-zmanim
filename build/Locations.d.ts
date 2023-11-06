import Location from './JCal/Location';
export declare const Locations: Location[];
/**
 * Get the location with the given name
 * @param {String} name
 */
export declare function findLocation(name: string): Location | undefined;
