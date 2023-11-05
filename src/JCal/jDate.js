import {isString, isNumber, has, isValidDate} from '../GeneralUtils';
import Utils from './Utils.js';
import Sedra from './Sedra.js';
import PirkeiAvos from './PirkeiAvos.js';
import Zmanim from './Zmanim.js';
import DafYomi from './Dafyomi';

/** Keeps a "repository" of years that have had their elapsed days previously calculated. Format: { year:5776, elapsed:2109283 } */
const _yearCache = [],
    //The absolute date for the zero hour of all javascript date objects - 1/1/1970 0:00:00 UTC
    JS_START_DATE_ABS = 719163,
    //The number of milliseconds in everyday
    MS_PER_DAY = 8.64e7,
    //The time zone offset (in minutes) for 1/1/1970 0:00:00 UTC at the current users time zone
    JS_START_OFFSET = new Date(0).getTimezoneOffset();
/* ****************************************************************************************************************
 * Many of the date conversion algorithms in the jDate class are based on the C code which was translated from Lisp
 * in "Calendrical Calculations" by Nachum Dershowitz and Edward M. Reingold
 * in Software---Practice & Experience, vol. 20, no. 9 (September, 1990), pp. 899--928.
 * ****************************************************************************************************************/

/** Represents a single day in the Jewish Calendar. */
export default class jDate {
    /**
     *  Create a new Jdate.
     *  new jDate() - Sets the Jewish Date for the current system date
     *  new jDate(javascriptDateObject) - Sets to the Jewish date on the given Gregorian date
     *  new jDate("January 1 2045") - Accepts any valid javascript Date string (uses javascripts new Date(String))
     *  new jDate(jewishYear, jewishMonth, jewishDay) - Months start at 1. Nissan is month 1 Adar Sheini is 13.
     *  new jDate(jewishYear, jewishMonth) - Same as above, with Day defaulting to 1
     *  new jDate( { year: 5776, month: 4, day: 5 } ) - same as new jDate(jewishYear, jewishMonth, jewishDay)
     *  new jDate( { year: 5776, month: 4 } ) - same as new jDate(jewishYear, jewishMonth)
     *  new jDate( { year: 5776 } ) - sets to the first day of Rosh Hashana on the given year
     *  new jDate(absoluteDate) - The number of days elapsed since the theoretical date Sunday, December 31, 0001 BCE
     *  new jDate(jewishYear, jewishMonth, jewishDay, absoluteDate) - Most efficient constructor. Needs no calculations at all.
     *  new jDate( { year: 5776, month: 4, day: 5, abs: 122548708 } ) - same as new jDate(jewishYear, jewishMonth, jewishDay, absoluteDate)
     * @param {Number | Date | String | {year:Number,month:Number,day:Number} | [Number, Number, Number, Number]} [arg] The full Jewish year number OR Javascript Date object or string OR object or array of year, month, day
     * @param {Number} [month] The month of the Jewish date. Nissan is 1.
     * @param {Number} [day] The day of the month
     * @param {Number} [abs] The number of days that have passed since 12/31/0001
     */
    constructor(arg, month, day, abs) {
        //The day of the Jewish Month
        this.Day = NaN;
        //The Jewish Month. As in the Torah, Nissan is 1 and Adara Sheini is 13
        this.Month = NaN;
        //The Number of years since the creation of the world
        this.Year = NaN;
        //The number of days since the theoretical date: Dec. 31, 0001 BCE
        this.Abs = NaN;

        if (arguments.length === 0) {
            this.fromAbs(jDate.absSd(new Date()));
        } else if (arg instanceof Date) {
            if (isValidDate(arg)) {
                this.fromAbs(jDate.absSd(arg));
            } else {
                throw 'jDate constructor: The given Date is not a valid javascript Date';
            }
        } else if (Array.isArray(arg) && arg.length >= 3) {
            this.Day = arg[0];
            this.Month = arg[1];
            this.Year = arg[2];
            this.Abs =
                (arg.length > 3 && arg[3]) ||
                jDate.absJd(this.Year, this.Month, this.Day);
        } else if (isString(arg)) {
            const d = new Date(arg);
            if (isValidDate(d)) {
                this.fromAbs(jDate.absSd(d));
            } else {
                throw (
                    'jDate constructor: The given string "' +
                    arg +
                    '" cannot be parsed into a Date'
                );
            }
        } else if (isNumber(arg)) {
            //if no other arguments were supplied, we assume that the supplied number is an absolute date
            if (arguments.length === 1) {
                this.fromAbs(arg);
            }
            //If the year and any other number is supplied, we set the year and create the date using either the supplied values or the defaults
            else {
                this.Year = arg;
                this.Month = month || 7; //If no month was supplied, we take Tishrei
                this.Day = day || 1; //If no day was supplied, we take the first day of the month
                //If the absolute date was also supplied (very efficient), we use the supplied value, otherwise we calculate it.
                this.Abs = abs || jDate.absJd(this.Year, this.Month, this.Day);
            }
        }
        //If arg is an object that has a "year" property that contains a valid value...
        else if (typeof arg === 'object' && isNumber(arg.year)) {
            this.Day = arg.day || 1;
            this.Month = arg.month || 7;
            this.Year = arg.year;
            this.Abs = arg.abs || jDate.absJd(this.Year, this.Month, this.Day);
        }
    }

    /**Sets the current Jewish date from the given absolute date*/
    fromAbs(absolute) {
        const ymd = jDate.fromAbs(absolute);
        this.Year = ymd.year;
        this.Month = ymd.month;
        this.Day = ymd.day;
        this.Abs = absolute;
    }

    /**Returns a valid javascript Date object that represents the Gregorian date
    that starts at midnight of the current Jewish date.*/
    getDate() {
        return jDate.sdFromAbs(this.Abs);
    }
    /**
     * @returns {Number} The day of the week for the current Jewish date. Sunday is 0 and Shabbos is 6.
     */
    getDayOfWeek() {
        return Math.abs(this.Abs % 7);
    }
    /**
     * @returns {Number} The day of the week for the current Jewish date. Sunday is 0 and Shabbos is 6
     */
    get DayOfWeek() {
        return this.getDayOfWeek();
    }
    /**Returns a new Jewish date represented by adding the given number of days to the current Jewish date.*/
    addDays(days) {
        return new jDate(this.Abs + days);
    }
    /**
     * Returns a new Jewish date represented by adding the given number of
     * Jewish Months to the current Jewish date.
     * If the current Day is 30 and the new month only has 29 days,
     * the 29th day of the month is returned.
     * @param {Number} months
     */
    addMonths(months) {
        let year = this.Year,
            month = this.Month,
            day = this.Day,
            miy = jDate.monthsJYear(year);

        for (let i = 0; i < Math.abs(months); i++) {
            if (months > 0) {
                month += 1;
                if (month > miy) {
                    month = 1;
                }
                if (month === 7) {
                    year += 1;
                    miy = jDate.monthsJYear(year);
                }
            } else if (months < 0) {
                month -= 1;
                if (month === 0) {
                    month = miy;
                }
                if (month === 6) {
                    year -= 1;
                    miy = jDate.monthsJYear(year);
                }
            }
        }
        if (day === 30 && jDate.daysJMonth(year, month) === 29) {
            day = 29;
        }

        return new jDate(year, month, day);
    }
    /**
     * Returns a new Jewish date represented by adding the
     * given number of Jewish Years to the current Jewish date.
     * If the current Day is 30 and the new dates month only has 29 days,
     * the 29th day of the month is returned.
     * @param {Number} years
     */
    addYears(years) {
        let year = this.Year + years,
            month = this.Month,
            day = this.Day;

        if (month === 13 && !jDate.isJdLeapY(year)) {
            month = 12;
        } else if (month === 8 && day === 30 && !jDate.isLongCheshvan(year)) {
            month = 9;
            day = 1;
        } else if (month === 9 && day === 30 && jDate.isShortKislev(year)) {
            month = 10;
            day = 1;
        }

        if (day === 30 && jDate.daysJMonth(year, month) === 29) {
            day = 29;
        }

        return new jDate(year, month, day);
    }
    addSecularMonths(months) {
        const secDate = new Date(this.getDate().valueOf());
        secDate.setMonth(secDate.getMonth() + months);
        return new jDate(secDate);
    }
    addSecularYears(years) {
        const secDate = new Date(this.getDate().valueOf());
        secDate.setFullYear(secDate.getFullYear() + years);
        return new jDate(secDate);
    }
    /**Gets the number of days separating this Jewish Date and the given one.
     *
     * If the given date is before this one, the number will be negative.
     * @param {jDate} jd
     * */
    diffDays(jd) {
        return jd.Abs - this.Abs;
    }

    /**Gets the number of months separating this Jewish Date and the given one.
     *
     * Ignores the Day property:
     *
     * jDate.toJDate(5777, 6, 29).diffMonths(jDate.toJDate(5778, 7, 1)) will return 1 even though they are a day apart.
     *
     * If the given date is before this one, the number will be negative.
     * @param {jDate} jd
     * */
    diffMonths(jd) {
        let month = jd.Month,
            year = jd.Year,
            months = 0;

        while (!(year === this.Year && month === this.Month)) {
            if (this.Abs > jd.Abs) {
                months--;
                month++;
                if (month > jDate.monthsJYear(year)) {
                    month = 1;
                } else if (month === 7) {
                    year++;
                }
            } else {
                months++;
                month--;
                if (month < 1) {
                    month = jDate.monthsJYear(year);
                } else if (month === 6) {
                    year--;
                }
            }
        }

        return months;
    }

    /**Gets the number of years separating this Jewish Date and the given one.
     *
     * Ignores the Day and Month properties:
     *
     * jDate.toJDate(5777, 6, 29).diffYears(jDate.toJDate(5778, 7, 1)) will return 1 even though they are a day apart.
     *
     * If the given date is before this one, the number will be negative.
     * @param {jDate} jd*/
    diffYears(jd) {
        return jd.Year - this.Year;
    }

    /**
     * Returns the current Jewish date in the format: Thursday, the 3rd of Kislev 5776.
     * @param {boolean} hideDayOfWeek
     * @param {boolean} dontCapitalize
     */
    toString(hideDayOfWeek, dontCapitalize) {
        return (
            (hideDayOfWeek
                ? dontCapitalize
                    ? 't'
                    : 'T'
                : Utils.dowEng[this.getDayOfWeek()] + ', t') +
            'he ' +
            Utils.toSuffixed(this.Day) +
            ' of ' +
            this.monthName()
        );
    }

    /**
     * Returns the current Jewish date in the format "[Tuesday] Nissan 3, 5778"
     * @param {boolean} showDow - show day of week?
     */
    toShortString(showDow) {
        return (
            (showDow ? Utils.dowEng[this.getDayOfWeek()] + ' ' : '') +
            Utils.jMonthsEng[this.Month] +
            ' ' +
            this.Day.toString() +
            ', ' +
            this.Year.toString()
        );
    }

    /**
     * Returns the current Jewish date in the format "Nissan 5778"
     * @param {boolean} showYear - show the year number?
     */
    monthName(showYear = true) {
        return (
            Utils.jMonthsEng[this.Month] +
            (showYear ? ' ' + this.Year.toString() : '')
        );
    }

    /**Returns the current Jewish date in the format: יום חמישי כ"א כסלו תשע"ו.*/
    toStringHeb() {
        return (
            Utils.dowHeb[this.getDayOfWeek()] +
            ' ' +
            Utils.toJNum(this.Day) +
            ' ' +
            Utils.jMonthsHeb[this.Month] +
            ' ' +
            Utils.toJNum(this.Year % 1000)
        );
    }

    /**Gets the day of the omer for the current Jewish date. If the date is not during sefira, 0 is returned.*/
    getDayOfOmer() {
        let dayOfOmer = 0;
        if (
            (this.Month === 1 && this.Day > 15) ||
            this.Month === 2 ||
            (this.Month === 3 && this.Day < 6)
        ) {
            const first = new jDate(this.Year, 1, 15);
            dayOfOmer = first.diffDays(this);
        }
        return dayOfOmer;
    }

    /**
     * Returns true if this day is yomtov or chol hamoed
     * @param {Boolean} israel
     */
    isYomTovOrCholHamoed(israel) {
        return (
            this.isYomTov(israel) ||
            (this.Month === 1 && [16, 17, 18, 19, 20].includes(this.Day)) ||
            (this.Month === 7 && [16, 17, 18, 19, 20, 21].includes(this.Day))
        );
    }

    /**
     * Returns true if this day is yomtov
     * @param {Boolean} israel
     */
    isYomTov(israel) {
        const day = this.Day;
        switch (this.Month) {
            case 1:
                if (day === 15 || day === 21) return true;
                if (!israel && (day === 16 || day === 22)) return true;
                break;
            case 3:
                if (day === 6 || (!israel && day === 7)) return true;
                break;
            case 7:
                if ([1, 2, 10, 15, 22].includes(day)) {
                    return true;
                }
                if (!israel && (day === 16 || day === 23)) return true;
                break;
        }
        return false;
    }   
    
       /**Is today Erev Yom Tov? (includes Erev second days of Sukkos and Pesach) */
       isErevYomTov() {
        return (
            (this.Month === 1 && has(this.Day, 14, 20)) ||
            (this.Month === 3 && this.Day === 5) ||
            (this.Month === 6 && this.Day === 29) ||
            (this.Month === 7 && has(this.Day, 9, 14, 21))
        );
    }

    /**Does the current Jewish date have candle lighting before sunset?*/
    hasCandleLighting() {
        const dow = this.getDayOfWeek();

        if (dow === 5) {
            return true;
        } else if (dow === 6) {
            //there is no "candle lighting time" - even if yom tov is on Motzai Shabbos
            return false;
        }

        return this.isErevYomTov();
    } 

    /**Is the current Jewish Date the day before a yomtov that contains a Friday?*/
    hasEiruvTavshilin(israel) {
        let dow = this.getDayOfWeek();
        return (
            //Eiruv Tavshilin is only on Wednesday or Thursday
            [3, 4].includes(dow) &&
            //today is Erev Yomtov
            this.isErevYomTov() &&
            //Thursday OR Wednesday when in Chu"l or Erev Rosh Hashana anywhere
            (dow === 4 || (dow === 3 && (!israel || this.Month === 6))) &&
            //No Eiruv Tavshilin on Erev yom kippur
            this.Day !== 9
        );
    }

    /**Gets the candle lighting time for the current Jewish date for the given Location object.*/
    getCandleLighting(location, nullIfNoCandles) {
        if (!location) {
            throw 'To get sunrise and sunset, the location needs to be supplied';
        }
        if (this.hasCandleLighting()) {
            return Zmanim.getCandleLighting(this, location);
        } else if (nullIfNoCandles) {
            return null;
        } else {
            throw 'No candle lighting on ' + this.toString();
        }
    }

    /**Get the sedra of the week for the current Jewish date.*/
    getSedra(israel) {
        return new Sedra(this, israel);
    }

    /**Get the prakim of Pirkei Avos for the current Jewish date.*/
    getPirkeiAvos(israel) {
        return PirkeiAvos.getPrakim(this, israel);
    }

    /**Gets sunrise and sunset time for the current Jewish date at the given Location.
     *
     * Return format: {sunrise: {hour: 6, minute: 18}, sunset: {hour: 19, minute: 41}}*/
    getSunriseSunset(location, ignoreElevation) {
        if (!location) {
            throw 'To get sunrise and sunset, the location needs to be supplied';
        }
        return Zmanim.getSunTimes(this, location, !ignoreElevation);
    }

    /**Gets Chatzos for both the day and the night for the current Jewish date at the given Location.
     *
     *Return format: {hour: 11, minute: 48}*/
    getChatzos(location) {
        if (!location) {
            throw 'To get Chatzos, the location needs to be supplied';
        }
        return Zmanim.getChatzos(this, location);
    }

    /**Gets the length of a single Sha'a Zmanis in minutes for the current Jewish date at the given Location.*/
    getShaaZmanis(location, offset) {
        if (!location) {
            throw 'To get the Shaa Zmanis, the location needs to be supplied';
        }
        return Zmanim.getShaaZmanis(this, location, offset);
    }

    /**Returns the daily daf in English. For example: Sukkah, Daf 3.*/
    getDafYomi() {
        return DafYomi.toString(this);
    }

    /**Gets the daily daf in Hebrew. For example: 'סוכה דף כ.*/
    getDafyomiHeb() {
        return DafYomi.toStringHeb(this);
    }

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
    static toJDate(arg, month, day, abs) {
        if (arguments.length === 0) {
            return new jDate();
        }
        // If just the year is set, then the date is set to Rosh Hashana of that year.
        // In the above scenario, we can't just pass the args along, as the constructor will treat it as an absolute date.
        //...and that folks, is actually the whole point of this function...
        else if (isNumber(arg) && arguments.length === 1) {
            return new jDate(arg, 7, 1);
        } else {
            return new jDate(arg, month, day, abs);
        }
    }

    static now() {
        return new jDate();
    }

    /**Calculate the Jewish year, month and day for the given absolute date.*/
    static fromAbs(absDay) {
        //To save on calculations, start with a few years before date
        let year = 3761 + Utils.toInt(absDay / (absDay > 0 ? 366 : 300)),
            month,
            day;

        // Search forward for year from the approximation year.
        while (absDay >= jDate.absJd(year + 1, 7, 1)) {
            year++;
        }
        // Search forward for month from either Tishrei or Nissan.
        month = absDay < jDate.absJd(year, 1, 1) ? 7 : 1;
        while (
            absDay > jDate.absJd(year, month, jDate.daysJMonth(year, month))
        ) {
            month++;
        }
        // Calculate the day by subtraction.
        day = absDay - jDate.absJd(year, month, 1) + 1;

        return {year, month, day};
    }
    /**
     * Gets the absolute date of the given javascript Date object.
     * @param {Date} date
     */
    static absSd(date) {
        //Get the correct number of milliseconds since 1/1/1970 00:00:00 UTC until current system time
        const ms = date.valueOf() - date.getTimezoneOffset() * 60000,
            //The number of full days since 1/1/1970.
            numFullDays = Math.floor(ms / MS_PER_DAY);
        //Add that to the number of days from 1/1/0001 until 1/1/1970 00:00:00 UTC
        return JS_START_DATE_ABS + numFullDays;
    }

    /**Calculate the absolute date for the given Jewish Date.*/
    static absJd(year, month, day) {
        //The number of total days.
        let dayInYear = day; // day is the number of days so far this month.
        if (month < 7) {
            // Before Tishrei, so add days in prior months this year before and after Nissan.
            let m = 7;
            while (m <= jDate.monthsJYear(year)) {
                dayInYear += jDate.daysJMonth(year, m);
                m++;
            }
            m = 1;
            while (m < month) {
                dayInYear += jDate.daysJMonth(year, m);
                m++;
            }
        } else {
            // Add days in prior months this year
            let m = 7;
            while (m < month) {
                dayInYear += jDate.daysJMonth(year, m);
                m++;
            }
        }
        // Days elapsed before absolute date 1. -  Days in prior years.
        return dayInYear + (jDate.tDays(year) + -1373429);
    }

    /**
     * Gets a javascript date from an absolute date
     */
    static sdFromAbs(abs) {
        //The "zero hour" for Javascript is 1/1/1970 0:00:00 UTC.
        //If the time zone offset was more than 0, the current time zone was earlier than UTC at the time.
        //As the "zero hour" is at midnight, so if the current time was earlier than that, than it was during the previous date.
        //So we will need to add another day to get the correct date.
        const offset = JS_START_OFFSET > 0 ? 1 : 0,
            //Get the number of days from the "zero hour" until the given date.
            //This is done by taking the given absolute date and removing the
            //number of days from absolute date 0 until the js "zero hour" - keeping into
            //account the previously calculated possible day offset.
            daysSinceStart = abs - JS_START_DATE_ABS + offset;
        //Create a javascript date from the number of milliseconds since the "zero hour"
        return new Date(daysSinceStart * MS_PER_DAY);
    }

    /**Number of days in the given Jewish Month. Nissan is 1 and Adar Sheini is 13.*/
    static daysJMonth(year, month) {
        switch (month) {
            //Nissan, Sivan, Av, Tishrei and Shvat always have 30 days
            case 1:
            case 3:
            case 5:
            case 7:
            case 11:
                return 30;
            //Iyyar, Tammuz, Ellul, Teves and Adar Sheini always have 29 days.
            case 2:
            case 4:
            case 6:
            case 10:
            case 13:
                return 29;
            //Cheshvan sometimes has 29 days and sometimes 30 days.
            case 8:
                return jDate.isLongCheshvan(year) ? 30 : 29;
            //Kislev sometimes has 29 days and sometimes 30 days.
            case 9:
                return jDate.isShortKislev(year) ? 29 : 30;
            //Adar has 29 days unless it is Adar Rishon.
            case 12:
                return jDate.isJdLeapY(year) ? 30 : 29;
        }
    }

    /**Elapsed days since creation of the world until Rosh Hashana of the given year*/
    static tDays(year) {
        /*As this function is called many times, often on the same year for all types of calculations,
        we save a list of years with their elapsed values.*/
        const cached = _yearCache.find(y => y.year === year);
        //If this year was already calculated and cached, then we return the cached value.
        if (cached) {
            return cached.elapsed;
        }

        const months = Utils.toInt(
                235 * Utils.toInt((year - 1) / 19) + // Leap months this cycle
                    12 * ((year - 1) % 19) + // Regular months in this cycle.
                    (7 * ((year - 1) % 19) + 1) / 19,
            ), // Months in complete cycles so far.
            parts = 204 + 793 * (months % 1080),
            hours =
                5 +
                12 * months +
                793 * Utils.toInt(months / 1080) +
                Utils.toInt(parts / 1080),
            conjDay = Utils.toInt(1 + 29 * months + hours / 24),
            conjParts = 1080 * (hours % 24) + (parts % 1080);

        let altDay;
        /* at the end of a leap year -  15 hours, 589 parts or later... -
        ... or is on a Monday at... -  ...of a common year, -
        at 9 hours, 204 parts or later... - ...or is on a Tuesday... -
        If new moon is at or after midday,*/
        if (
            conjParts >= 19440 ||
            (conjDay % 7 === 2 &&
                conjParts >= 9924 &&
                !jDate.isJdLeapY(year)) ||
            (conjDay % 7 === 1 &&
                conjParts >= 16789 &&
                jDate.isJdLeapY(year - 1))
        ) {
            // Then postpone Rosh HaShanah one day
            altDay = conjDay + 1;
        } else {
            altDay = conjDay;
        }

        // A day is added if Rosh HaShanah would occur on Sunday, Friday or Wednesday,
        if (has(altDay % 7, 0, 3, 5)) {
            altDay += 1;
        }

        //Add this year to the cache to save on calculations later on
        _yearCache.push({year: year, elapsed: altDay});

        return altDay;
    }

    /**Number of days in the given Jewish Year.*/
    static daysJYear(year) {
        return jDate.tDays(year + 1) - jDate.tDays(year);
    }

    /**Does Cheshvan for the given Jewish Year have 30 days?*/
    static isLongCheshvan(year) {
        return jDate.daysJYear(year) % 10 === 5;
    }

    /**Does Kislev for the given Jewish Year have 29 days?*/
    static isShortKislev(year) {
        return jDate.daysJYear(year) % 10 === 3;
    }

    /**Does the given Jewish Year have 13 months?*/
    static isJdLeapY(year) {
        return (7 * year + 1) % 19 < 7;
    }

    /**Number of months in Jewish Year.*/
    static monthsJYear(year) {
        return jDate.isJdLeapY(year) ? 13 : 12;
    }
}
