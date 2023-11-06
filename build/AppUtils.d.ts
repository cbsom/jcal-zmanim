import Location from './JCal/Location';
import Settings from './Settings';
import jDate from './JCal/jDate';
import { SunTimes, Time, ZmanToShow } from './jcal-zmanim';
type ZmanTime = {
    date: Date;
    location: Location;
    sunrise: Time | undefined;
    sunset: Time | undefined;
    suntimesMishor: SunTimes | undefined;
    sunriseMishor: Time | undefined;
    sunsetMishor: Time | undefined;
    mishorNeg90: Time | undefined;
    chatzos: Time | undefined;
    shaaZmanis: number | undefined;
    shaaZmanisMga: number | undefined;
};
export declare const DaysOfWeek: Readonly<{
    SUNDAY: 0;
    MONDAY: 1;
    TUESDAY: 2;
    WEDNESDAY: 3;
    THURSDAY: 4;
    FRIDAY: 5;
    SHABBOS: 6;
}>;
export declare const WhichDaysFlags: Readonly<{
    SUNDAY: 1;
    MONDAY: 2;
    TUESDAY: 4;
    WEDNESDAY: 8;
    THURSDAY: 16;
    FRIDAY: 32;
    SHABBOS: 64;
    YOMTOV: 128;
}>;
export default class AppUtils {
    static zmanTimesCache: ZmanTime[];
    /**
     * Returns the date corrected time of the given zmanim on the given date at the given location
     * If the zman is after or within 30 minutes of the given time, this days zman is returned, othwise tomorrows zman is returned.
     * @param {Date} sdate
     * @param {jDate} jdate
     * @param {Time} time
     * @param {Settings} settings
     * @param {Time} sunset
     * @returns {[{zmanType:ZmanToShow,time:Time, isTomorrow:boolean}]}
     */
    static getCorrectZmanTimes(sdate: Date, jdate: jDate, time: Time, settings: Settings, sunset: Time): {
        zmanType: ZmanToShow;
        time: Time;
        isTomorrow: boolean;
    }[];
    /**
     * Gets the zmanim for all the types in the given list.
     * @param {[ZmanToShow]} zmanTypes An array of ZmanTypes to get the zman for.
     * @param {Date} date The secular date to get the zmanim for
     * @param {jDate} jdate The jewish date to get the zmanim for
     * @param {Location} location The location for which to get the zmanim
     * @returns{[{zmanType:{id:number,offset:?number,desc:string,eng:string,heb:string },time:Time}]}
     */
    static getZmanTimes(zmanTypes: ZmanToShow[], date: Date, jdate: jDate, location: Location): {
        zmanType: ZmanToShow;
        time?: Time;
    }[];
    /**
     * Get the WhichDaysFlags for the given secular date
     * @param {Date} date
     * @param {jDate} jdate
     * @param {Location} location
     */
    static getWhichDays(date: Date, jdate: jDate, location: Location): 1 | 0 | 2 | 4 | 8 | 16 | 32 | 64 | 128;
    /**
     * Returns the zmanim necessary for showing basic shul notifications: chatzosHayom, chatzosHalayla, alos
     * @param {jDate} jdate
     * @param {Date} sdate
     * @param {Location} location
     * @returns {{chatzosHayom:Time, chatzosHalayla:Time, alos:Time, shkia:Time }}
     */
    static getBasicShulZmanim(jdate: jDate, sdate: Date, location: Location): {
        chatzosHayom: Time | undefined;
        chatzosHalayla: Time | undefined;
        alos: Time | undefined;
        shkia: Time | undefined;
    };
    /**
    * Returns all the zmanim for the given day
    * @param {jDate} jdate
    * @param {Date} sdate
    * @param {Location} location
    * @returns {{zmanType:ZmanToShow, time?:Time }[]}
    */
    static getAllZmanim(jdate: jDate, sdate: Date, location: Location): {
        zmanType: ZmanToShow;
        time?: Time | undefined;
    }[];
    /**
     * Compares two zmanim for showing to see if they are the same
     * @param {{id:number,offset:?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }} zman1
     * @param {{id:number,offset:?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }} zman2
     */
    static IsSameZmanToShow(zman1: ZmanToShow, zman2: ZmanToShow): boolean;
    /**
     * Returns all available ZmanTypes - including baseTypes and custom added types
     * @param {Settings} settings
     */
    static AllZmanTypes(settings: Settings): ZmanToShow[];
}
export {};
