/** Represents a geographic Location. Needed for calculating Zmanim.
If Israel is undefined, if the given coordinates are near the vicinity of Israel it will be assumed that it is in Israel.
UTCOffset is the time zone. Israel is always 2 and the US East coast is -5. England is 0 of course.
If UTCOffset is not specifically supplied, the longitude will be used to get a quasi-educated guess.*/
export default class Location {
    Name: string;
    Israel: boolean;
    Latitude: number;
    Longitude: number;
    UTCOffset: number;
    Elevation: number;
    CandleLighting?: number;
    locationId?: number;
    /**
     * Describe a new Location.
     * @param {String} name The name of the Location
     * @param {Boolean} israel Is this Location in Israel?
     * @param {Number} latitude
     * @param {Number} longitude
     * @param {Number} utcOffset The time zone. Israel is 2 and New York is -5.
     * @param {Number} elevation Elevation in meters
     * @param {Number} [candleLighting] Number of minutes before sunset the candles are lit on Friday
     * @param {Number} [locationId] If this location is in a database, keeps track of the id
     */
    constructor(name: string, israel: boolean, latitude: number, longitude: number, utcOffset: number, elevation: number, candleLighting?: number, locationId?: number);
    hasId(): boolean;
    static clone(location: Location): Location;
    static getCandles(location: Location): number;
    /**Gets the Location for Jerusalem.*/
    static getJerusalem(): Location;
    /**Gets the Location for Lakewood NJ*/
    static getLakewood(): Location;
}
