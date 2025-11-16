import { Utils, DaysOfWeekEng, JewishMonthsEng, DaysOfWeekHeb, JewishMonthsHeb } from "../Utils.js";
import Sedra from "./Sedra.js";
import PirkeiAvos from "./PirkeiAvos.js";
import Zmanim from "./Zmanim.js";
import DafYomi from "./Dafyomi.js";
import Location from "./Location.js";

//The absolute date for the zero hour of all javascript date objects - 1/1/1970 0:00:00 UTC
const JS_START_DATE_ABS = 719163,
  //The number of milliseconds in everyday
  MS_PER_DAY = 8.64e7,
  //The time zone offset (in minutes) for 1/1/1970 0:00:00 UTC at the current users time zone
  JS_START_OFFSET = new Date(0).getTimezoneOffset(),
  yearTypes = [
    { isLeapYear: false, dow: 5, isLongCheshvan: false, isLongKislev: true, daysInYear: 354 },
    { isLeapYear: false, dow: 7, isLongCheshvan: true, isLongKislev: true, daysInYear: 355 },
    { isLeapYear: false, dow: 2, isLongCheshvan: true, isLongKislev: true, daysInYear: 355 },
    { isLeapYear: false, dow: 3, isLongCheshvan: false, isLongKislev: true, daysInYear: 354 },
    { isLeapYear: false, dow: 7, isLongCheshvan: false, isLongKislev: false, daysInYear: 353 },
    { isLeapYear: false, dow: 2, isLongCheshvan: false, isLongKislev: false, daysInYear: 353 },
    { isLeapYear: false, dow: 5, isLongCheshvan: true, isLongKislev: true, daysInYear: 355 },
    { isLeapYear: true, dow: 5, isLongCheshvan: true, isLongKislev: true, daysInYear: 385 },
    { isLeapYear: true, dow: 2, isLongCheshvan: false, isLongKislev: false, daysInYear: 383 },
    { isLeapYear: true, dow: 5, isLongCheshvan: false, isLongKislev: false, daysInYear: 383 },
    { isLeapYear: true, dow: 7, isLongCheshvan: false, isLongKislev: false, daysInYear: 383 },
    { isLeapYear: true, dow: 2, isLongCheshvan: true, isLongKislev: true, daysInYear: 385 },
    { isLeapYear: true, dow: 7, isLongCheshvan: true, isLongKislev: true, daysInYear: 385 },
    { isLeapYear: true, dow: 3, isLongCheshvan: false, isLongKislev: true, daysInYear: 384 },
  ],
  //Year types starting from the year 5000
  yearTypeList = [
    8, 0, 1, 7, 0, 8, 1, 0, 8, 1, 0, 7, 4, 1, 13, 1, 8, 0, 1, 7, 4, 0, 7, 1, 8, 0, 1, 7, 0, 4, 7, 0,
    1, 8, 0, 7, 4, 0, 7, 1, 4, 13, 1, 8, 1, 0, 7, 1, 0, 8, 1, 0, 8, 1, 7, 0, 4, 7, 0, 1, 8, 0, 7, 4,
    1, 13, 1, 4, 13, 1, 1, 8, 0, 7, 1, 0, 8, 1, 0, 8, 1, 7, 0, 4, 7, 0, 1, 8, 0, 1, 7, 4, 13, 1, 1,
    8, 0, 1, 8, 0, 7, 1, 0, 8, 1, 0, 7, 4, 0, 7, 1, 8, 0, 1, 8, 0, 1, 7, 4, 13, 1, 1, 8, 0, 1, 7, 0,
    4, 7, 0, 8, 1, 0, 7, 4, 1, 13, 1, 8, 0, 1, 8, 1, 0, 7, 1, 0, 8, 1, 8, 0, 1, 7, 0, 4, 7, 0, 8, 1,
    0, 7, 4, 1, 13, 1, 4, 13, 1, 7, 4, 0, 7, 1, 0, 8, 1, 8, 0, 1, 7, 0, 4, 7, 0, 1, 8, 0, 7, 1, 4,
    13, 1, 1, 8, 0, 7, 4, 0, 7, 1, 0, 8, 1, 0, 7, 4, 7, 0, 1, 8, 0, 1, 8, 1, 13, 1, 4, 13, 1, 1, 8,
    0, 1, 7, 0, 8, 1, 0, 8, 1, 0, 7, 4, 7, 0, 1, 8, 0, 1, 8, 1, 0, 7, 4, 13, 1, 1, 8, 0, 1, 7, 0, 8,
    1, 0, 8, 1, 0, 7, 4, 1, 13, 1, 8, 0, 1, 7, 4, 0, 7, 1, 8, 0, 1, 7, 0, 4, 7, 0, 1, 8, 0, 7, 4, 0,
    7, 1, 4, 13, 1, 8, 1, 0, 7, 1, 0, 8, 1, 0, 8, 1, 7, 0, 4, 7, 0, 1, 8, 0, 7, 4, 1, 13, 1, 4, 13,
    1, 1, 8, 0, 7, 1, 0, 8, 1, 0, 8, 1, 7, 0, 4, 7, 0, 1, 8, 0, 1, 8, 1, 13, 1, 4, 13, 1, 1, 8, 0,
    7, 1, 0, 8, 1, 0, 7, 4, 0, 7, 1, 8, 0, 1, 8, 0, 1, 7, 4, 13, 1, 1, 8, 0, 1, 7, 0, 4, 7, 0, 8, 1,
    0, 7, 4, 0, 7, 1, 8, 0, 1, 8, 1, 0, 7, 1, 0, 8, 1, 8, 0, 1, 7, 0, 4, 7, 0, 8, 1, 0, 7, 4, 1, 13,
    1, 4, 13, 1, 7, 4, 0, 7, 1, 0, 8, 1, 8, 0, 1, 7, 0, 4, 7, 0, 1, 8, 0, 7, 1, 4, 13, 1, 1, 8, 0,
    7, 4, 0, 7, 1, 0, 8, 1, 0, 7, 4, 7, 0, 1, 8, 0, 1, 8, 1, 13, 1, 4, 13, 1, 1, 8, 0, 1, 7, 0, 8,
    1, 0, 8, 1, 0, 7, 4, 7, 0, 1, 8, 0, 1, 8, 1, 0, 7, 4, 13, 1, 1, 8, 0, 1, 7, 0, 8, 1, 0, 8, 1, 0,
    7, 4, 1, 13, 1, 8, 0, 1, 7, 4, 0, 7, 1, 8, 0, 1, 8, 0, 1, 7, 0, 4, 7, 0, 7, 4, 0, 7, 1, 4, 13,
    1, 8, 1, 0, 7, 1, 0, 8, 1, 0, 8, 1, 7, 0, 4, 7, 0, 1, 8, 0, 7, 4, 1, 13, 1, 4, 13, 1, 1, 8, 0,
    7, 1, 0, 8, 1, 0, 8, 1, 7, 0, 4, 7, 0, 1, 8, 0, 1, 8, 1, 13, 1, 4, 13, 1, 1, 8, 0, 7, 1, 0, 8,
    1, 0, 7, 4, 0, 7, 1, 8, 0, 1, 8, 0, 1, 7, 4, 13, 1, 1, 8, 0, 1, 7, 0, 4, 7, 0, 8, 1, 0, 7, 4, 0,
    7, 1, 8, 0, 1, 8, 1, 0, 7, 1, 0, 8, 1, 8, 0, 1, 7, 0, 4, 7, 0, 8, 1, 0, 7, 4, 1, 13, 1, 4, 13,
    1, 8, 1, 0, 7, 1, 0, 8, 1, 8, 0, 1, 7, 0, 4, 7, 0, 1, 8, 0, 7, 1, 4, 13, 1, 1, 8, 0, 7, 4, 0, 7,
    1, 0, 8, 1, 0, 7, 4, 7, 0, 1, 8, 0, 1, 8, 0, 7, 1, 4, 13, 1, 1, 8, 0, 1, 7, 0, 8, 1, 0, 8, 1, 0,
    7, 4, 7, 0, 1, 8, 0, 1, 8, 1, 0, 7, 4, 13, 1, 1, 8, 0, 1, 7, 0, 8, 1, 0, 8, 1, 0, 7, 4, 1, 13,
    1, 8, 0, 1, 7, 4, 0, 7, 1, 8, 0, 1, 8, 0, 1, 7, 0, 4, 7, 0, 7, 4, 0, 7, 1, 4, 13, 1, 8, 1, 0, 7,
    1, 0, 8, 1, 0, 8, 1, 7, 0, 4, 7, 0, 1, 8, 0, 7, 4, 1, 13, 1, 4, 13, 1, 1, 8, 0, 7, 1, 0, 8, 1,
    0, 8, 1, 7, 0, 4, 7, 0, 1, 8, 0, 1, 8, 1, 13, 1, 4, 13, 1, 1, 8, 0, 7, 1, 0, 8, 1, 0, 8, 1, 0,
    7, 4, 7, 0, 1, 8, 0, 1, 7, 4, 13, 1, 1, 8, 0, 1, 7, 0, 4, 7, 0, 8, 1, 0, 7, 4, 0, 7, 1, 8, 0, 1,
    8, 1, 0, 7, 1, 0, 8, 1, 8, 0, 1, 7, 0, 4, 7, 0, 8, 1, 0, 7, 4, 1, 13, 1, 4, 13, 1, 8, 1, 0, 7,
    1, 0, 8, 1, 8, 0, 1, 7, 0, 4, 7, 0, 1, 8, 0, 7, 4, 1, 13, 1, 4, 13, 1, 7, 4, 0, 7, 1, 0, 8, 1,
    0, 7, 4, 7, 0, 1, 8, 0, 1, 8, 0, 7, 1, 4, 13, 1, 1, 8, 0, 1, 7, 0, 8, 1, 0, 8, 1, 0, 7, 4, 7, 0,
    1, 8, 0, 1, 8, 1, 0, 7, 4, 13, 1, 1, 8, 0, 1, 7, 0, 8, 1, 0, 8, 1, 0, 7,
  ],
  /** Returns elapsed days since creation of the world until Rosh Hashana of the given year.
   *  These algorithms are based on the C code which was translated from Lisp
   *  in "Calendrical Calculations" by Nachum Dershowitz and Edward M. Reingold
   *  in Software---Practice & Experience, vol. 20, no. 9 (September, 1990), pp. 899--928.
   */
  getElapsedDays = (year: number) => {
    let daysCounter = 0;
    const months = Utils.toInt(
      235 * Utils.toInt((year - 1) / 19) + // Leap months this cycle
      12 * ((year - 1) % 19) + // Regular months in this cycle.
      (7 * ((year - 1) % 19) + 1) / 19
    ), // Months in complete cycles so far.
      parts = 204 + 793 * (months % 1080),
      hours = 5 + 12 * months + 793 * Utils.toInt(months / 1080) + Utils.toInt(parts / 1080),
      conjDay = Utils.toInt(1 + 29 * months + hours / 24),
      conjParts = 1080 * (hours % 24) + (parts % 1080);

    /* at the end of a leap year -  15 hours, 589 parts or later... -
      ... or is on a Monday at... -  ...of a common year, -
      at 9 hours, 204 parts or later... - ...or is on a Tuesday... -
      If new moon is at or after midday,*/
    if (
      conjParts >= 19440 ||
      (conjDay % 7 === 2 && conjParts >= 9924 && !jDate.isJdLeapY(year)) ||
      (conjDay % 7 === 1 && conjParts >= 16789 && jDate.isJdLeapY(year - 1))
    ) {
      // Then postpone Rosh HaShanah one day
      daysCounter = conjDay + 1;
    } else {
      daysCounter = conjDay;
    }

    // A day is added if Rosh HaShanah would occur on Sunday, Friday or Wednesday,
    if (Utils.has(daysCounter % 7, 0, 3, 5)) {
      daysCounter += 1;
    }
    return daysCounter;
  };
/** Represents a single day in the Jewish Calendar. */
export default class jDate {
  public Day: number;
  public Month: number;
  public Year: number;
  public Abs: number;

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
  constructor(
    arg?:
      | number
      | Date
      | string
      | { year: number; month: number; day: number }
      | [number, number, number, number],
    month?: number,
    day?: number,
    abs?: number
  ) {
    //The day of the Jewish Month
    this.Day = NaN;
    //The Jewish Month. As in the Torah, Nissan is 1 and Adara Sheini is 13
    this.Month = NaN;
    //The number of years since the creation of the world
    this.Year = NaN;
    //The number of days since the theoretical date: Dec. 31, 0001 BCE
    this.Abs = NaN;

    if (arguments.length === 0) {
      this.fromAbs(jDate.absSd(new Date()));
    } else if (arg instanceof Date) {
      if (Utils.isValidDate(arg)) {
        this.fromAbs(jDate.absSd(arg));
      } else {
        throw "jDate constructor: The given Date is not a valid javascript Date";
      }
    } else if (Array.isArray(arg) && arg.length >= 3) {
      this.Day = arg[0];
      this.Month = arg[1];
      this.Year = arg[2];
      this.Abs = (arg.length > 3 && arg[3]) || jDate.absJd(this.Year, this.Month, this.Day);
    } else if (arg && Utils.isString(arg)) {
      const d = new Date(arg as string);
      if (Utils.isValidDate(d)) {
        this.fromAbs(jDate.absSd(d));
      } else {
        throw 'jDate constructor: The given string "' + arg + '" cannot be parsed into a Date';
      }
    } else if (Utils.isNumber(arg)) {
      //if no other arguments were supplied, we assume that the supplied number is an absolute date
      if (arguments.length === 1) {
        this.fromAbs(arg as number);
      }
      //If the year and any other number is supplied, we set the year and create the date using either the supplied values or the defaults
      else {
        this.Year = arg as number;
        this.Month = month || 7; //If no month was supplied, we take Tishrei
        this.Day = day || 1; //If no day was supplied, we take the first day of the month
        //If the absolute date was also supplied (very efficient), we use the supplied value, otherwise we calculate it.
        this.Abs = abs || jDate.absJd(this.Year, this.Month, this.Day);
      }
    }
    //If arg is an object that has a "year" property that contains a valid value...
    else if (typeof arg === "object") {
      const argObj = arg as { year: number; month: number; day: number; abs: number };
      if (Utils.isNumber(argObj.year)) {
        this.Day = argObj.day || 1;
        this.Month = argObj.month || 7;
        this.Year = argObj.year;
        this.Abs = argObj.abs || jDate.absJd(this.Year, this.Month, this.Day);
      }
    }
  }

  /**Sets the current Jewish date from the given absolute date*/
  fromAbs(absolute: number) {
    const ymd = jDate.fromAbs(absolute);
    this.Year = ymd.year;
    this.Month = ymd.month;
    this.Day = ymd.day;
    this.Abs = absolute;
  }

  /**Returns a valid javascript Date object that represents the Gregorian date
    that starts at midnight of the current Jewish date.*/
  getDate(): Date {
    return jDate.sdFromAbs(this.Abs);
  }
  /**
   * @returns {number} The day of the week for the current Jewish date. Sunday is 0 and Shabbos is 6.
   */
  getDayOfWeek(): number {
    return Math.abs(this.Abs % 7);
  }
  /**
   * @returns {number} The day of the week for the current Jewish date. Sunday is 0 and Shabbos is 6
   */
  get DayOfWeek(): number {
    return this.getDayOfWeek();
  }
  /**Returns a new Jewish date represented by adding the given number of days to the current Jewish date.*/
  addDays(days: number): jDate {
    return new jDate(this.Abs + days);
  }
  /**
   * Returns a new Jewish date represented by adding the given number of
   * Jewish Months to the current Jewish date.
   * If the current Day is 30 and the new month only has 29 days,
   * the 29th day of the month is returned.
   * @param {number} months
   */
  addMonths(months: number): jDate {
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
   * @param {number} years
   */
  addYears(years: number): jDate {
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
  addSecularMonths(months: number): jDate {
    const secDate = new Date(this.getDate().valueOf());
    secDate.setMonth(secDate.getMonth() + months);
    return new jDate(secDate);
  }
  addSecularYears(years: number): jDate {
    const secDate = new Date(this.getDate().valueOf());
    secDate.setFullYear(secDate.getFullYear() + years);
    return new jDate(secDate);
  }
  /**Gets the number of days separating this Jewish Date and the given one.
   *
   * If the given date is before this one, the number will be negative.
   * @param {jDate} jd
   * */
  diffDays(jd: jDate): number {
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
  diffMonths(jd: jDate): number {
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

  /**Gets the number of full months separating this Jewish Date and the given one.
   * If the given date is before this one, the number will be negative.
   * @param {jDate} jd
   * */
  diffFullMonths(jd: jDate): number {
    let months = this.diffMonths(jd);
    if (months >= 0 && this.Day > jd.Day) {
      months--;
    } else if (months < 0 && this.Day < jd.Day) {
      months++;
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
  diffYears(jd: jDate): number {
    let diff = jd.Year - this.Year;
    if (this.Month < jd.Month || (this.Month === jd.Month && this.Day < jd.Day)) {
      diff--;
    }
    return diff;
  }

  /**Gets the number of full years separating this Jewish Date and the given one.
   * If the given date is before this one, the number will be negative.
   * @param {jDate} jd*/
  diffFullYears(jd: jDate): number {
    let diff = jd.Year - this.Year;
    if (diff >= 0 && (this.Month > jd.Month || (this.Month === jd.Month && this.Day > jd.Day))) {
      diff--;
    } else if (
      diff < 0 &&
      (this.Month < jd.Month || (this.Month === jd.Month && this.Day < jd.Day))
    ) {
      diff++;
    }
    return diff;
  }

  /**
   * Returns the current Jewish date in the format: Thursday, the 3rd of Kislev 5776.
   * @param {boolean} hideDayOfWeek
   * @param {boolean} dontCapitalize
   */
  toString(hideDayOfWeek?: boolean, dontCapitalize?: boolean): string {
    return (
      (hideDayOfWeek ? (dontCapitalize ? "t" : "T") : DaysOfWeekEng[this.getDayOfWeek()] + ", t") +
      "he " +
      Utils.toSuffixed(this.Day) +
      " of " +
      this.monthName()
    );
  }

  /**
   * Returns the current Jewish date in the format "[Tuesday] Nissan 3, 5778"
   * @param {boolean} showDow - show day of week?
   */
  toShortstring(showDow: boolean): string {
    return (
      (showDow ? DaysOfWeekEng[this.getDayOfWeek()] + " " : "") +
      JewishMonthsEng[this.Month] +
      " " +
      this.Day.toString() +
      ", " +
      this.Year.toString()
    );
  }

  /**
   * Returns the current Jewish date in the format "Nissan 5778"
   * @param {boolean} showYear - show the year number?
   */
  monthName(showYear = true): string {
    return (
      JewishMonthsEng[this.Month] +
      (this.Month === 12 && jDate.isJdLeapY(this.Year) ? " Rishon " : " ") +
      (showYear ? this.Year.toString() : "")
    );
  }

  /**
   * Returns the current Jewish date in the format: יום חמישי כ"א כסלו תשע"ו
   * @param hideDayOfWeek When set to truthy, hides the day of the week
   */
  toStringHeb(hideDayOfWeek?: boolean): string {
    return (
      (!hideDayOfWeek ? DaysOfWeekHeb[this.getDayOfWeek()] + " " : "") +
      Utils.toJewishNumber(this.Day) +
      " " +
      JewishMonthsHeb[this.Month] +
      (this.Month === 12 && jDate.isJdLeapY(this.Year) ? " ראשון " : " ") +
      Utils.toJewishNumber(this.Year % 1000)
    );
  }

  /**Gets the day of the omer for the current Jewish date. If the date is not during sefira, 0 is returned.*/
  getDayOfOmer(): number {
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
   * @param {boolean} israel
   */
  isYomTovOrCholHamoed(israel: boolean): boolean {
    return (
      this.isYomTov(israel) ||
      (this.Month === 1 && [16, 17, 18, 19, 20].includes(this.Day)) ||
      (this.Month === 7 && [16, 17, 18, 19, 20, 21].includes(this.Day))
    );
  }

  /**
   * Returns true if this day is yomtov
   * @param {boolean} israel
   */
  isYomTov(israel: boolean): boolean {
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
  isErevYomTov(): boolean {
    return (
      (this.Month === 1 && Utils.has(this.Day, 14, 20)) ||
      (this.Month === 3 && this.Day === 5) ||
      (this.Month === 6 && this.Day === 29) ||
      (this.Month === 7 && Utils.has(this.Day, 9, 14, 21))
    );
  }

  /**Does the current Jewish date have candle lighting before sunset?*/
  hasCandleLighting(): boolean {
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
  hasEiruvTavshilin(israel: boolean): boolean {
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
  getCandleLighting(location: Location, nullIfNoCandles?: boolean) {
    if (!location) {
      throw "To get sunrise and sunset, the location needs to be supplied";
    }
    if (this.hasCandleLighting()) {
      return Zmanim.getCandleLighting(this, location);
    } else if (nullIfNoCandles) {
      return null;
    } else {
      throw "No candle lighting on " + this.toString();
    }
  }

  /**Get the sedra of the week for the current Jewish date.*/
  getSedra(israel: boolean) {
    return new Sedra(this, israel);
  }

  /**Get the prakim of Pirkei Avos for the current Jewish date.*/
  getPirkeiAvos(israel: boolean) {
    return PirkeiAvos.getPrakim(this, israel);
  }

  /**Gets sunrise and sunset time for the current Jewish date at the given Location.
   *
   * Return format: {sunrise: {hour: 6, minute: 18}, sunset: {hour: 19, minute: 41}}*/
  getSunriseSunset(location: Location, ignoreElevation?: boolean) {
    if (!location) {
      throw "To get sunrise and sunset, the location needs to be supplied";
    }
    return Zmanim.getSunTimes(this, location, !ignoreElevation);
  }

  /**Gets Chatzos for both the day and the night for the current Jewish date at the given Location.
   *
   *Return format: {hour: 11, minute: 48}*/
  getChatzos(location: Location) {
    if (!location) {
      throw "To get Chatzos, the location needs to be supplied";
    }
    return Zmanim.getChatzos(this, location);
  }

  /**Gets the length of a single Sha'a Zmanis in minutes for the current Jewish date at the given Location.*/
  getShaaZmanis(location: Location, offset: number) {
    if (!location) {
      throw "To get the Shaa Zmanis, the location needs to be supplied";
    }
    return Zmanim.getShaaZmanis(this, location, offset);
  }

  /**Returns the daily daf in English. For example: Sukkah, Daf 3.*/
  getDafYomi() {
    return DafYomi.toString(this) || "";
  }

  /**Gets the daily daf in Hebrew. For example: 'סוכה דף כ.*/
  getDafyomiHeb() {
    return DafYomi.toStringHeb(this) || "";
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
  static toJDate(
    arg?:
      | number
      | Date
      | string
      | { year: number; month: number; day: number }
      | [number, number, number, number],
    month?: number,
    day?: number,
    abs?: number
  ): jDate {
    if (arguments.length === 0) {
      return new jDate();
    }
    // If just the year is set, then the date is set to Rosh Hashana of that year.
    // In the above scenario, we can't just pass the args along, as the constructor will treat it as an absolute date.
    //...and that folks, is actually the whole point of this function...
    else if (Utils.isNumber(arg) && arguments.length === 1) {
      return new jDate(arg, 7, 1);
    } else {
      return new jDate(arg, month, day, abs);
    }
  }

  static now(): jDate {
    return new jDate();
  }

  /**Calculate the Jewish year, month and day for the given absolute date.*/
  static fromAbs(absDay: number): { year: number; month: number; day: number } {
    //To save on calculations, start with a few years before date
    let year = 3761 + Utils.toInt(absDay / (absDay > 0 ? 366 : 300)),
      month: number,
      day: number;

    // Search forward for year from the approximation year.
    while (absDay >= jDate.absJd(year + 1, 7, 1)) {
      year++;
    }
    // Search forward for month from either Tishrei or Nissan.
    month = absDay < jDate.absJd(year, 1, 1) ? 7 : 1;
    while (absDay > jDate.absJd(year, month, jDate.daysJMonth(year, month))) {
      month++;
    }
    // Calculate the day by subtraction.
    day = absDay - jDate.absJd(year, month, 1) + 1;

    return { year, month, day };
  }
  /**
   * Gets the absolute date of the given javascript Date object.
   * @param {Date} date
   */
  static absSd(date: Date): number {
    //Get the correct number of milliseconds since 1/1/1970 00:00:00 UTC until current system time
    const ms = date.valueOf() - date.getTimezoneOffset() * 60000,
      //The number of full days since 1/1/1970.
      numFullDays = Math.floor(ms / MS_PER_DAY);
    //Add that to the number of days from 1/1/0001 until 1/1/1970 00:00:00 UTC
    return JS_START_DATE_ABS + numFullDays;
  }

  /**Calculate the absolute date for the given Jewish Date.*/
  static absJd(year: number, month: number, day: number): number {
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
    return dayInYear + (getElapsedDays(year) + -1373429);
  }

  /**
   * Gets a javascript date from an absolute date
   */
  static sdFromAbs(abs: number): Date {
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

  /**number of days in the given Jewish Month. Nissan is 1 and Adar Sheini is 13.*/
  static daysJMonth(year: number, month: number): number {
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
    return 0;
  }

  /**The index for the year type of the given year.
   * IMPORTANT NOTE: Only works for years 5000 and after.
   */
  static yearType(year: number) {
    return yearTypes[yearTypeList[year - 5000]];
  }

  /**number of days in the given Jewish Year.*/
  static daysJYear(year: number): number {
    if (!year || year < 0) { return 0; }
    if (year >= 5000) {
      return jDate.yearType(year).daysInYear;
    } else {
      return getElapsedDays(year + 1) - getElapsedDays(year);
    }
  }

  /**Does Cheshvan for the given Jewish Year have 30 days?*/
  static isLongCheshvan(year: number): boolean {
    if (!year || year < 0) { return false; }
    if (year >= 5000) {
      return jDate.yearType(year).isLongCheshvan;
    } else {
      return jDate.daysJYear(year) % 10 === 5;
    }
  }

  /**Does Kislev for the given Jewish Year have 29 days?*/
  static isShortKislev(year: number): boolean {
    if (!year || year < 0) { return false; }
    if (year >= 5000) {
      return !jDate.yearType(year).isLongKislev;
    } else {
      return jDate.daysJYear(year) % 10 === 3;
    }
  }

  /**Does the given Jewish Year have 13 months?*/
  static isJdLeapY(year: number): boolean {
    return (7 * year + 1) % 19 < 7;
  }

  /**number of months in Jewish Year.*/
  static monthsJYear(year: number): number {
    return jDate.isJdLeapY(year) ? 13 : 12;
  }

  static getElapsedDays = getElapsedDays;
}
