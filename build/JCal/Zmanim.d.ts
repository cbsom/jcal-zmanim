import jDate from './jDate.js';
import Location from './Location.js';
import { SunTimes, Time } from '../jcal-zmanim.js';
/**
 * Computes the daily Zmanim for any single date at any location.
 * The astronomical and mathematical calculations were directly adapted from the excellent
 * Jewish calendar calculation in C# Copyright © by Ulrich and Ziporah Greve (2005)
 */
export default class Zmanim {
    /**
     * Gets sunrise and sunset time for given date and Location.
     * Accepts a javascript Date object, a string for creating a javascript date object or a jDate object.
     * Location object is required.
     * @returns {SunTimes}
     * @param {Date | jDate} date A Javascript Date or Jewish Date for which to calculate the sun times.
     * @param {Location} location Where on the globe to calculate the sun times for.
     * @param {Boolean} considerElevation
     */
    static getSunTimes(date: Date | jDate, location: Location, considerElevation?: boolean): SunTimes;
    /**
     * @param {jDate | Date} date
     * @param {Location} location
     */
    static getChatzos(date: jDate | Date, location: Location): Time;
    /**
     * @param {SunTimes} sunTimes
     */
    static getChatzosFromSuntimes(sunTimes: SunTimes): Time;
    /**
     * @param {jDate | Date} date
     * @param {Location} location
     * @param {any} offset
     */
    static getShaaZmanis(date: jDate | Date, location: Location, offset: number): number;
    /**
     * @param {{ sunrise: any; sunset: any; }} sunTimes
     * @param {number} [offset]
     */
    static getShaaZmanisFromSunTimes(sunTimes: SunTimes, offset?: number): number;
    /**
     * @param {{ sunrise: any; sunset: any; }} sunTimes
     * @param {boolean} israel
     */
    static getShaaZmanisMga(sunTimes: SunTimes, israel: boolean): number;
    /**
     * @param {jDate | Date} date
     * @param {Location} location
     */
    static getCandleLighting(date: Date | jDate, location: Location): Time | undefined;
    /**
     * @param {SunTimes} sunTimes
     * @param {any} location
     */
    static getCandleLightingFromSunTimes(sunTimes: SunTimes, location: Location): Time | undefined;
    /**
     * @param {Time} sunset
     * @param {Location} location
     */
    static getCandleLightingFromSunset(sunset: Time, location: Location): Time | undefined;
    /**
     * @param {Date} date
     */
    static dayOfYear(date: Date): number;
    /**
     * @param {number} deg
     * @param {number} min
     */
    static degToDec(deg: number, min: number): number;
    /**
     * @param {number} x
     */
    static M(x: number): number;
    /**
     * @param {number} x
     */
    static L(x: number): number;
    /**
     * @param {number} x
     */
    static adj(x: number): number;
    /**
     * @param {number} rad
     */
    static radToDeg(rad: number): number;
    /**
     * @param {number} time
     * @param {Date} date
     * @param {Location} location
     */
    static timeAdj(time: number, date: Date, location: Location): {
        hour: number;
        minute: number;
        second: number;
    };
}
