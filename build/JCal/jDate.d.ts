import Sedra from './Sedra.js';
import Location from './Location';
/** Represents a single day in the Jewish Calendar. */
export default class jDate {
    Day: number;
    Month: number;
    Year: number;
    Abs: number;
    /**
     *  Create a new Jdate.
     *  new jDate() - Sets the Jewish Date for the current system date
     *  new jDate(javascriptDateObject) - Sets to the Jewish date on the given Gregorian date
     *  new jDate("January 1 2045") - Accepts any valid javascript Date string (uses javascripts new Date(string))
     *  new jDate(jewishYear, jewishMonth, jewishDay) - Months start at 1. Nissan is month 1 Adar Sheini is 13.
     *  new jDate(jewishYear, jewishMonth) - Same as above, with Day defaulting to 1
     *  new jDate( { year: 5776, month: 4, day: 5 } ) - same as new jDate(jewishYear, jewishMonth, jewishDay)
     *  new jDate( { year: 5776, month: 4 } ) - same as new jDate(jewishYear, jewishMonth)
     *  new jDate( { year: 5776 } ) - sets to the first day of Rosh Hashana on the given year
     *  new jDate(absoluteDate) - The number of days elapsed since the theoretical date Sunday, December 31, 0001 BCE
     *  new jDate(jewishYear, jewishMonth, jewishDay, absoluteDate) - Most efficient constructor. Needs no calculations at all.
     *  new jDate( { year: 5776, month: 4, day: 5, abs: 122548708 } ) - same as new jDate(jewishYear, jewishMonth, jewishDay, absoluteDate)
     * @param {number | Date | string | {year:number,month:number,day:number} | [number, number, number, number]} [arg] The full Jewish year number OR Javascript Date object or string OR object or array of year, month, day
     * @param {number} [month] The month of the Jewish date. Nissan is 1.
     * @param {number} [day] The day of the month
     * @param {number} [abs] The number of days that have passed since 12/31/0001
     */
    constructor(arg?: number | Date | string | {
        year: number;
        month: number;
        day: number;
    } | [number, number, number, number], month?: number, day?: number, abs?: number);
    /**Sets the current Jewish date from the given absolute date*/
    fromAbs(absolute: number): void;
    /**Returns a valid javascript Date object that represents the Gregorian date
    that starts at midnight of the current Jewish date.*/
    getDate(): Date;
    /**
     * @returns {number} The day of the week for the current Jewish date. Sunday is 0 and Shabbos is 6.
     */
    getDayOfWeek(): number;
    /**
     * @returns {number} The day of the week for the current Jewish date. Sunday is 0 and Shabbos is 6
     */
    get DayOfWeek(): number;
    /**Returns a new Jewish date represented by adding the given number of days to the current Jewish date.*/
    addDays(days: number): jDate;
    /**
     * Returns a new Jewish date represented by adding the given number of
     * Jewish Months to the current Jewish date.
     * If the current Day is 30 and the new month only has 29 days,
     * the 29th day of the month is returned.
     * @param {number} months
     */
    addMonths(months: number): jDate;
    /**
     * Returns a new Jewish date represented by adding the
     * given number of Jewish Years to the current Jewish date.
     * If the current Day is 30 and the new dates month only has 29 days,
     * the 29th day of the month is returned.
     * @param {number} years
     */
    addYears(years: number): jDate;
    addSecularMonths(months: number): jDate;
    addSecularYears(years: number): jDate;
    /**Gets the number of days separating this Jewish Date and the given one.
     *
     * If the given date is before this one, the number will be negative.
     * @param {jDate} jd
     * */
    diffDays(jd: jDate): number;
    /**Gets the number of months separating this Jewish Date and the given one.
     *
     * Ignores the Day property:
     *
     * jDate.toJDate(5777, 6, 29).diffMonths(jDate.toJDate(5778, 7, 1)) will return 1 even though they are a day apart.
     *
     * If the given date is before this one, the number will be negative.
     * @param {jDate} jd
     * */
    diffMonths(jd: jDate): number;
    /**Gets the number of years separating this Jewish Date and the given one.
     *
     * Ignores the Day and Month properties:
     *
     * jDate.toJDate(5777, 6, 29).diffYears(jDate.toJDate(5778, 7, 1)) will return 1 even though they are a day apart.
     *
     * If the given date is before this one, the number will be negative.
     * @param {jDate} jd*/
    diffYears(jd: jDate): number;
    /**
     * Returns the current Jewish date in the format: Thursday, the 3rd of Kislev 5776.
     * @param {boolean} hideDayOfWeek
     * @param {boolean} dontCapitalize
     */
    toString(hideDayOfWeek?: boolean, dontCapitalize?: boolean): string;
    /**
     * Returns the current Jewish date in the format "[Tuesday] Nissan 3, 5778"
     * @param {boolean} showDow - show day of week?
     */
    toShortstring(showDow: boolean): string;
    /**
     * Returns the current Jewish date in the format "Nissan 5778"
     * @param {boolean} showYear - show the year number?
     */
    monthName(showYear?: boolean): string;
    /**Returns the current Jewish date in the format: יום חמישי כ"א כסלו תשע"ו.*/
    toStringHeb(): string;
    /**Gets the day of the omer for the current Jewish date. If the date is not during sefira, 0 is returned.*/
    getDayOfOmer(): number;
    /**
     * Returns true if this day is yomtov or chol hamoed
     * @param {boolean} israel
     */
    isYomTovOrCholHamoed(israel: boolean): boolean;
    /**
     * Returns true if this day is yomtov
     * @param {boolean} israel
     */
    isYomTov(israel: boolean): boolean;
    /**Is today Erev Yom Tov? (includes Erev second days of Sukkos and Pesach) */
    isErevYomTov(): boolean;
    /**Does the current Jewish date have candle lighting before sunset?*/
    hasCandleLighting(): boolean;
    /**Is the current Jewish Date the day before a yomtov that contains a Friday?*/
    hasEiruvTavshilin(israel: boolean): boolean;
    /**Gets the candle lighting time for the current Jewish date for the given Location object.*/
    getCandleLighting(location: Location, nullIfNoCandles: boolean): import("../jcal-zmanim").Time | null | undefined;
    /**Get the sedra of the week for the current Jewish date.*/
    getSedra(israel: boolean): Sedra;
    /**Get the prakim of Pirkei Avos for the current Jewish date.*/
    getPirkeiAvos(israel: boolean): number[];
    /**Gets sunrise and sunset time for the current Jewish date at the given Location.
     *
     * Return format: {sunrise: {hour: 6, minute: 18}, sunset: {hour: 19, minute: 41}}*/
    getSunriseSunset(location: Location, ignoreElevation?: boolean): import("../jcal-zmanim").SunTimes;
    /**Gets Chatzos for both the day and the night for the current Jewish date at the given Location.
     *
     *Return format: {hour: 11, minute: 48}*/
    getChatzos(location: Location): import("../jcal-zmanim").Time;
    /**Gets the length of a single Sha'a Zmanis in minutes for the current Jewish date at the given Location.*/
    getShaaZmanis(location: Location, offset: number): number;
    /**Returns the daily daf in English. For example: Sukkah, Daf 3.*/
    getDafYomi(): string;
    /**Gets the daily daf in Hebrew. For example: 'סוכה דף כ.*/
    getDafyomiHeb(): string;
    /**
     *  Converts its argument/s to a Jewish Date.
     *  Samples of use:
     *    To get the current Jewish Date: jDate.toJDate(new Date()).
     *    To print out the current date in English: jDate.toJDate(new Date()).toString()
     *    To print out the current date in Hebrew: jDate.toJDate(new Date()).toStringHeb()
     *
     *  Arguments to the jDate.toJDate function can be one of the following:
     *  jDate.toJDate() - Sets the Jewish Date for the current system date
     *  jDate.toJDate(Date) - Sets to the Jewish date on the given Javascript Date object
     *  jDate.toJDate("January 1 2045") - Accepts any valid Javascript Date string (uses string constructor of Date object)
     *  jDate.toJDate(jewishYear, jewishMonth, jewishDay) - Months start at 1. Nissan is month 1 Adara Sheini is 13.
     *  jDate.toJDate(jewishYear, jewishMonth) - Same as above, with Day defaulting to 1
     *  jDate.toJDate(jewishYear) - sets to the first day of Rosh Hashana on the given year
     *  jDate.toJDate( { year: 5776, month: 4, day: 5 } ) - Months start at 1. Nissan is month 1 Adara Sheini is 13.
     *  jDate.toJDate( { year: 5776, month: 4 } ) - Same as above, with Day defaulting to 1
     *  jDate.toJDate( { year: 5776 } ) - sets to the first day of Rosh Hashana on the given year
     *  jDate.toJDate(jewishYear, jewishMonth, jewishDay, absoluteDate) - Most efficient. Needs no calculations at all. The absoluteDate is the number of days elapsed since the theoretical date Sunday, December 31, 0001 BCE.
     *  jDate.toJDate( { year: 5776, month: 4, day: 5, abs: 122548708 } ) - same as jDate.toJDate(jewishYear, jewishMonth, jewishDay, absoluteDate)
     ****************************************************************************************************************/
    static toJDate(arg?: number | Date | string | {
        year: number;
        month: number;
        day: number;
    } | [number, number, number, number], month?: number, day?: number, abs?: number): jDate;
    static now(): jDate;
    /**Calculate the Jewish year, month and day for the given absolute date.*/
    static fromAbs(absDay: number): {
        year: number;
        month: number;
        day: number;
    };
    /**
     * Gets the absolute date of the given javascript Date object.
     * @param {Date} date
     */
    static absSd(date: Date): number;
    /**Calculate the absolute date for the given Jewish Date.*/
    static absJd(year: number, month: number, day: number): number;
    /**
     * Gets a javascript date from an absolute date
     */
    static sdFromAbs(abs: number): Date;
    /**number of days in the given Jewish Month. Nissan is 1 and Adar Sheini is 13.*/
    static daysJMonth(year: number, month: number): number;
    /**Elapsed days since creation of the world until Rosh Hashana of the given year*/
    static tDays(year: number): number;
    /**number of days in the given Jewish Year.*/
    static daysJYear(year: number): number;
    /**Does Cheshvan for the given Jewish Year have 30 days?*/
    static isLongCheshvan(year: number): boolean;
    /**Does Kislev for the given Jewish Year have 29 days?*/
    static isShortKislev(year: number): boolean;
    /**Does the given Jewish Year have 13 months?*/
    static isJdLeapY(year: number): boolean;
    /**number of months in Jewish Year.*/
    static monthsJYear(year: number): number;
}
