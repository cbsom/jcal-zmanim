import jDate from './jDate';
import Location from './Location';
import { Time } from '../jcal-zmanim';
export default class Utils {
    static jMonthsEng: string[];
    static jMonthsHeb: string[];
    static sMonthsEng: string[];
    static dowEng: string[];
    static dowHeb: string[];
    static jsd: string[];
    static jtd: string[];
    static jhd: string[];
    static jsnum: string[];
    static jtnum: string[];
    /**
     * Gets the Jewish representation of a number (365 = שס"ה)
     * Minimum number is 1 and maximum is 9999.
     * @param {Number} number
     */
    static toJNum(number: number): string;
    /**
     * Returns the javascript date in the format: Thursday, the 3rd of January 2018.
     * @param {Date} date
     * @param {Boolean} hideDayOfWeek
     * @param {Boolean} dontCapitalize
     */
    static toStringDate(date: Date, hideDayOfWeek: boolean, dontCapitalize: boolean): string | undefined;
    /**
     * Returns the javascript date in the format: 1/3/2020.
     * @param {Date} date
     * @param {Boolean} monthFirst
     */
    static toShortStringDate(date: Date, monthFirst: boolean): string | undefined;
    /**
     * Add two character suffix to number. e.g. 21st, 102nd, 93rd, 500th
     * @param {Number} num
     */
    static toSuffixed(num: number): string;
    /**
     * Returns if the given full secular year has a February 29th
     * @param {Number} year
     */
    static isSecularLeapYear(year: number): boolean;
    /**
     * Get day of week using Javascripts getDay function.
     * Important note: months starts at 1 not 0 like javascript
     * The DOW returned has Sunday = 0
     * @param {Number} year
     * @param {Number} month
     * @param {Number} day
     */
    static getSdDOW(year: number, month: number, day: number): number;
    /**
     * Makes sure hour is between 0 and 23 and minute is between 0 and 59.
     * Overlaps get added/subtracted.
     * The argument needs to be an object in the format {hour : 12, minute : 42, second : 18}
     * @param {Time} time
     */
    static fixTime(time: Time): {
        hour: number;
        minute: number;
        second: number;
    };
    /**
     * Add the given number of minutes to the given time.
     * The argument needs to be an object in the format {hour : 12, minute : 42, second : 18 }
     *
     * @param {Time} time
     * @param {Number} minutes
     */
    static addMinutes(time?: Time, minutes?: number): Time | undefined;
    /**
     * Add the given number of seconds to the given time.
     * The argument needs to be an object in the format {hour : 12, minute :42, second : 18}
     *
     * @param {Time} time
     * @param {Number} seconds
     */
    static addSeconds(time: Time, seconds: number): {
        hour: number;
        minute: number;
        second: number;
    };
    /**
     * Gets the time difference between two times of day.
     * If showNegative is falsey, assumes that the earlier time is always before the later time.
     * So, if laterTime is less than earlierTime, the returned diff is until the next day.
     * Both arguments need to be an object in the format {hour : 12, minute : 42, second : 18 }
     * @param {Time} earlierTime
     * @param {Time} laterTime
     * @param {Boolean} [showNegative] show negative values or assume second value is next day?
     * @returns{{hour:number, minute:number, second:number, sign:1|-1}}
     */
    static timeDiff(earlierTime: Time, laterTime: Time, showNegative?: boolean): {
        sign: number;
        hour: number;
        minute: number;
        second: number;
    };
    /**
     * Gets the total number of minutes in the given time.
     * @param {Time} time An object in the format {hour : 12, minute :42, second : 18}
     */
    static totalMinutes(time: Time): number;
    /**
     * Gets the total number of seconds in the given time.
     * @param {Time} time An object in the format {hour : 12, minute :42, second : 18}
     */
    static totalSeconds(time: Time): number;
    /**
     * Returns the time of the given javascript date as an object in the format of {hour : 23, minute :42, second: 18 }
     * @param {Date} sdate
     * @returns {{hour :number, minute :number, second:number }}
     */
    static timeFromDate(sdate: Date): {
        hour: number;
        minute: number;
        second: number;
    };
    /**
     * Determines if the second given time is after (or at) the first given time
     * @param {{hour :number, minute :number, second:number }} beforeTime
     * @param {{hour :number, minute :number, second:number }} afterTime
     */
    static isTimeAfter(beforeTime?: Time, afterTime?: Time): boolean;
    /**
     * Returns the given time interval in a formatted string.
     * @param {{hour:number, minute:number,second:number,sign?: 1 | -1}} time An object in the format {hour : 23, minute :42, second: 18 }
     */
    static getTimeIntervalTextStringHeb(time: Time): string;
    /**
     * Returns the given time interval in a formatted string.
     * @param {{hour:number, minute:number,second:number,sign?: 1 | -1}} time An object in the format {hour : 23, minute :42, second: 18 }
     */
    static getTimeIntervalTextString(time: Time): string;
    /**
     * Returns the nusach for Sefiras Ha'omer for the given day and minhag
     * @param {number} dayOfOmer The day of the Omer for which to get the nusach for
     * @param {'ashkenaz'|'sefard'|'sefardi'} nusach Should it be La'Omer ("sefard") or Ba'Omer ("ashkenaz") or "sefardi" (Eidot Hamizrach)?
     */
    static getOmerNusach(dayOfOmer: number, nusach: 'ashkenaz' | 'sefard' | 'sefardi'): string;
    /**
     * Returns the given time in a formatted string.
     * @param {Time} time An object in the format {hour : 23, minute :42, second: 18 }
     * @param {1 | -1} [sign]
     * @param {Boolean} [army] If falsey, the returned string will be: 11:42:18 PM otherwise it will be 23:42:18
     * @param {Boolean} [roundUp] If falsey, the numbers will converted to a whole number by rounding down, otherwise, up.
     */
    static getTimeString(time: Time, sign?: 1 | -1, army?: boolean, roundUp?: boolean): string;
    /**
     * Gets the UTC offset in whole hours for the users time zone.
     * Note: this is not affected by DST - unlike javascripts getTimezoneOffset() function which gives you the current offset.
     */
    static currUtcOffset(): number;
    /** Determines if the given date is within DST on the users system */
    static isDateDST(date: Date): boolean;
    /**
     * Determines if the given date is within DST in the given location
     * Note: This may not be correct if the user has set the Location to a
     * time zone outside Israel or the USA which is not the current system time zone.
     */
    static isDST(location: Location, date: Date): boolean;
    /**
     * Determines if the given javascript date is during DST according to the USA rules
     * @param {Date} date A javascript Date object
     */
    static isUSA_DST(date: Date): boolean;
    /**
     * Determines if the given Javascript date is during DST according to the current (5776) Israeli rules
     * @param {Date} date A Javascript Date object
     */
    static isIsrael_DST(date: Date): boolean;
    /** The current time in Israel - determined by the current users system time and time zone offset*/
    static getSdNowInIsrael(): Date;
    /**
     * Adds the given number of days to the given javascript date and returns the new date
     * @param {Date} sdate
     * @param {Number} days
     */
    static addDaysToSdate(sdate: Date, days: number): Date;
    /**
     * Compares two js dates to se if they both refer to the same day - time is ignored.
     * @param {Date} sdate1
     * @param {Date} sdate2
     */
    static isSameSdate(sdate1: Date, sdate2: Date): boolean;
    /**
     * Compares two jDates to se if they both refer to the same day - time is ignored.
     * @param {jDate} jdate1
     * @param {jDate} jdate2
     */
    static isSameJdate(jdate1: jDate, jdate2: jDate): boolean | 0;
    /**
     * Compares two jDates to see if they both refer to the same Jewish Month.
     * @param {jDate} jdate1
     * @param {jDate} jdate2
     */
    static isSameJMonth(jdate1: jDate, jdate2: jDate): boolean;
    /**
     * Compares two dates to se if they both refer to the same Secular Month.
     * @param {Date} sdate1
     * @param {Date} sdate2
     */
    static isSameSMonth(sdate1: Date, sdate2: Date): boolean;
    /**
     * Determines if the time of the given Date() is after sunset at the given Location
     * @param {Date} sdate
     * @param {Location} location
     */
    static isAfterSunset(sdate: Date, location: Location): boolean | undefined;
    /**
     * Gets the current Jewish Date at the given Location
     * @param {Location} location
     */
    static nowAtLocation(location: Location): jDate;
    /**
     * Converts the given complex number to an integer by removing the decimal part.
     * Returns same results as Math.floor for positive numbers and Math.ceil for negative ones.
     * Almost identical functionality to Math.trunc and parseInt.
     * The difference is if the argument is NaN. Math.trunc returns NaN while ths fuction returns 0.
     * In performance tests, this function was found to be quicker than the alternatives.
     * @param {Number} float The complex number to convert to an integer
     */
    static toInt(float: number): number;
}
