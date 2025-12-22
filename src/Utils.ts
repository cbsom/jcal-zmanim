import Zmanim from "./JCal/Zmanim.js";
import jDate from "./JCal/jDate.js";
import Location from "./JCal/Location.js";
import { Time } from "./jcal-zmanim.js";
import DateUtils from "./JCal/DateUtils.js";

const __DEV__ = process.env.NODE_ENV === "development";

export const DaysOfWeek = Object.freeze({
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SHABBOS: 6,
});
export const JewishMonthsNames = Object.freeze({
  NISSAN: 1,
  IYAR: 2,
  SIVAN: 3,
  TAMUZ: 4,
  AV: 5,
  ELLUL: 6,
  TISHREI: 7,
  CHESHVAN: 8,
  KISLEV: 9,
  TEVES: 10,
  SHVAT: 11,
  ADAR: 12,
  ADAR_SHEINI: 13,
});
export const JewishMonthsEng = [
  "",
  "Nissan",
  "Iyar",
  "Sivan",
  "Tamuz",
  "Av",
  "Ellul",
  "Tishrei",
  "Cheshvan",
  "Kislev",
  "Teves",
  "Shvat",
  "Adar",
  "Adar Sheini",
];
export const JewishMonthsHeb = [
  "",
  "ניסן",
  "אייר",
  "סיון",
  "תמוז",
  "אב",
  "אלול",
  "תשרי",
  "חשון",
  "כסלו",
  "טבת",
  "שבט",
  "אדר",
  "אדר שני",
];
export const SecularMonthsEng = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const DaysOfWeekEng = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Erev Shabbos",
  "Shabbos Kodesh",
];
export const DaysOfWeekHeb = [
  "יום ראשון",
  "יום שני",
  "יום שלישי",
  "יום רביעי",
  "יום חמישי",
  "ערב שבת קודש",
  "שבת קודש",
];
export class Utils extends DateUtils {
  static jsd = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  static jtd = ["י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  static jhd = ["ק", "ר", "ש", "ת"];
  static jsnum = ["", "אחד", "שנים", "שלשה", "ארבעה", "חמשה", "ששה", "שבעה", "שמונה", "תשעה"];
  static jtnum = ["", "עשר", "עשרים", "שלושים", "ארבעים"];

  /**
   * Gets the Jewish representation of a number (365 = שס"ה)
   * Minimum number is 1 and maximum is 9999.
   * @param {Number} number
   */
  static toJewishNumber(number: number) {
    if (number < 1) {
      throw "Min value is 1";
    }

    if (number > 9999) {
      throw "Max value is 9999";
    }

    let n = number,
      retval = "";

    if (n >= 1000) {
      retval += Utils.jsd[Utils.toInt((n - (n % 1000)) / 1000) - 1] + "'";
      n = n % 1000;
    }

    while (n >= 400) {
      retval += "ת";
      n -= 400;
    }

    if (n >= 100) {
      retval += Utils.jhd[Utils.toInt((n - (n % 100)) / 100) - 1];
      n = n % 100;
    }

    if (n == 15) {
      retval += "טו";
    } else if (n == 16) {
      retval += "טז";
    } else {
      if (n > 9) {
        retval += Utils.jtd[Utils.toInt((n - (n % 10)) / 10) - 1];
      }
      if (n % 10 > 0) {
        retval += Utils.jsd[(n % 10) - 1];
      }
    }
    if (number > 999 && number % 1000 < 10) {
      retval = "'" + retval;
    } else if (retval.length > 1) {
      retval = retval.slice(0, -1) + '"' + retval[retval.length - 1];
    }
    return retval;
  }

  /**
   * Returns the javascript date in the format: Thursday, the 3rd of January 2018.
   * @param {Date} date
   * @param {Boolean} hideDayOfWeek
   * @param {Boolean} dontCapitalize
   */
  static toStringDate(date: Date, hideDayOfWeek: boolean, dontCapitalize: boolean) {
    if (!date) return;
    return (
      (hideDayOfWeek ? (dontCapitalize ? "t" : "T") : DaysOfWeekEng[date.getDay()] + ", t") +
      "he " +
      Utils.toSuffixed(date.getDate()) +
      " of " +
      SecularMonthsEng[date.getMonth()] +
      " " +
      date.getFullYear().toString()
    );
  }

  /**
   * Returns the javascript date in the format: 1/3/2020.
   * @param {Date} date
   * @param {Boolean} monthFirst
   */
  static toShortStringDate(date: Date, monthFirst: boolean) {
    if (!date) return;
    const dayNum = date.getDate(),
      monthNum = date.getMonth() + 1;
    return (
      (monthFirst
        ? `${monthNum}/${dayNum}`
        : `${dayNum < 10 ? "0" : ""}${dayNum}/${monthNum < 10 ? "0" : ""}${monthNum}`) +
      "/" +
      date.getFullYear().toString()
    );
  }



  /**
   * Get day of week using Javascripts getDay function.
   * Important note: months starts at 1 not 0 like javascript
   * The DOW returned has Sunday = 0
   * @param {Number} year
   * @param {Number} month
   * @param {Number} day
   */
  static getSdDOW(year: number, month: number, day: number) {
    return new Date(year, month - 1, day).getDay();
  }





  /**
   * Returns the time of the given javascript date as an object in the format of {hour : 23, minute :42, second: 18 }
   * @param {Date} sdate
   * @returns {{hour :number, minute :number, second:number }}
   */
  static timeFromDate(sdate: Date) {
    return {
      hour: sdate.getHours(),
      minute: sdate.getMinutes(),
      second: sdate.getSeconds(),
    };
  }

  /**
   * Determines if the second given time is after (or at) the first given time
   * @param {{hour :number, minute :number, second:number }} beforeTime
   * @param {{hour :number, minute :number, second:number }} afterTime
   */
  static isTimeAfter(beforeTime?: Time, afterTime?: Time) {
    if (!beforeTime || !afterTime) return false;
    return Utils.totalSeconds(afterTime) >= Utils.totalSeconds(beforeTime);
  }

  /**
   * Returns the given time interval in a formatted string.
   * @param {{hour:number, minute:number,second:number,sign?: 1 | -1}} time An object in the format {hour : 23, minute :42, second: 18 }
   */
  static getTimeIntervalTextStringHeb(time: Time) {
    let t = "";
    if (time.hour > 0) {
      t += `${time.hour.toString()} ${time.hour === 1 ? "שעה" : "שעות"}\u{00AD}`;
    }
    if (time.minute > 0) {
      if (t.length) {
        t += " ";
      }
      t += `${time.minute.toString()} ${time.minute === 1 ? "דקה" : "דקות"}\u{00AD}`;
    }
    if ((time.second || 0) > 0) {
      if (t.length) {
        t += " ";
      }
      t += `${Math.trunc(time.second || 0).toString()} ${time.second === 1 ? "שנייה" : "שניות"
        }\u{00AD}`;
    }
    return t;
  }

  /**
   * Returns the given time interval in a formatted string.
   * @param {{hour:number, minute:number,second:number,sign?: 1 | -1}} time An object in the format {hour : 23, minute :42, second: 18 }
   */
  static getTimeIntervalTextString(time: Time) {
    let t = "";
    if (time.hour > 0) {
      t += `${time.hour.toString()} ${time.hour === 1 ? "hour" : "hours"}\u{00AD}`;
    }
    if (time.minute > 0) {
      if (t.length) {
        t += " ";
      }
      t += `${time.minute.toString()} ${time.minute === 1 ? "minute" : "minutes"}\u{00AD}`;
    }
    if ((time.second || 0) > 0) {
      if (t.length) {
        t += " ";
      }
      t += `${Math.trunc(time.second || 0).toString()} ${time.second === 1 ? "second" : "seconds"
        }\u{00AD}`;
    }
    return t;
  }

  /**
   * Returns the nusach for Sefiras Ha'omer for the given day and minhag
   * @param {number} dayOfOmer The day of the Omer for which to get the nusach for
   * @param {'ashkenaz'|'sefard'|'sefardi'} nusach Should it be La'Omer ("sefard") or Ba'Omer ("ashkenaz") or "sefardi" (Eidot Hamizrach)?
   */
  static getOmerNusach(dayOfOmer: number, nusach: "ashkenaz" | "sefard" | "sefardi") {
    const weeks = Utils.toInt(dayOfOmer / 7),
      days = dayOfOmer % 7;
    let txt = "היום ";

    if (dayOfOmer === 1) {
      txt += "יום אחד ";
    } else {
      if (dayOfOmer === 2) {
        txt += "שני ";
      } else {
        if (dayOfOmer === 10) {
          txt += "עשרה ";
        } else {
          txt += Utils.jsnum[Utils.toInt(dayOfOmer % 10)] + " ";
          if (dayOfOmer > 10) {
            if (dayOfOmer > 20 && dayOfOmer % 10 > 0) {
              txt += "ו";
            }
            txt += Utils.jtnum[Utils.toInt(dayOfOmer / 10)] + " ";
          }
        }
      }
      txt += (dayOfOmer >= 11 ? "יום" : "ימים") + " ";

      if (nusach === "sefardi") {
        txt += "לעומר" + " ";
      }

      if (dayOfOmer >= 7) {
        txt += "שהם ";
        if (weeks === 1) {
          txt += "שבוע אחד ";
        } else if (weeks === 2) {
          txt += "שני שבועות ";
        } else if (weeks > 0) {
          txt += Utils.jsnum[Utils.toInt(weeks)] + " שבועות ";
        }
        if (days === 1) {
          txt += "ויום אחד ";
        } else if (days === 2) {
          txt += "ושני ימים ";
        } else if (days > 0) {
          txt += "ו" + Utils.jsnum[days] + " ימים ";
        }
      }
    }
    if (nusach === "sefard") {
      txt += "לעומר";
    } else if (nusach === "ashkenaz") {
      txt += "בעומר";
    }
    return txt;
  }

  /**
   * Returns the given time in a formatted string.
   * @param {Time} time An object in the format {hour : 23, minute :42, second: 18 }
   * @param {1 | -1} [sign]
   * @param {Boolean} [army] If falsey, the returned string will be: 11:42:18 PM otherwise it will be 23:42:18
   * @param {Boolean} [roundUp] If falsey, the numbers will converted to a whole number by rounding down, otherwise, up.
   */
  static getTimeString(time: Time, sign?: 1 | -1, army?: boolean, roundUp?: boolean) {
    const round = roundUp ? Math.ceil : Math.floor;
    time = {
      hour: round(time.hour),
      minute: round(time.minute),
      second: round(time.second || 0),
    };
    if (army) {
      return (
        (sign && sign < 0 ? "-" : "") +
        (time.hour.toString() +
          ":" +
          (time.minute < 10 ? "0" + time.minute.toString() : time.minute.toString()) +
          ":" +
          ((time.second || 0) < 10
            ? "0" + (time.second || 0).toString()
            : (time.second || 0).toString()))
      );
    } else {
      return (
        (sign && sign < 0 ? "-" : "") +
        (time.hour <= 12 ? (time.hour == 0 ? 12 : time.hour) : time.hour - 12).toString() +
        ":" +
        (time.minute < 10 ? "0" + time.minute.toString() : time.minute.toString()) +
        ":" +
        ((time.second || 0) < 10
          ? "0" + (time.second || 0).toString()
          : (time.second || 0).toString()) +
        (time.hour < 12 ? " AM" : " PM")
      );
    }
  }



  /** The current time in Israel - determined by the current users system time and time zone offset*/
  static getSdNowInIsrael() {
    const now = new Date(),
      //first determine the hour differential between this user and Israel time
      israelTimeOffset = 2 + -Utils.currUtcOffset();
    //This will give us the current correct date and time in Israel
    now.setHours(now.getHours() + israelTimeOffset);
    return now;
  }
  /**
   * Adds the given number of days to the given javascript date and returns the new date
   * @param {Date} sdate
   * @param {Number} days
   */
  static addDaysToSdate(sdate: Date, days: number) {
    return new Date(sdate.valueOf() + 8.64e7 * days);
  }
  /**
   * Compares two js dates to se if they both refer to the same day - time is ignored.
   * @param {Date} sdate1
   * @param {Date} sdate2
   */
  static isSameSdate(sdate1: Date, sdate2: Date) {
    return sdate1 && sdate2 && sdate1.toDateString() === sdate2.toDateString();
  }
  /**
   * Compares two jDates to se if they both refer to the same day - time is ignored.
   * @param {jDate} jdate1
   * @param {jDate} jdate2
   */
  static isSameJdate(jdate1: jDate, jdate2: jDate) {
    return jdate1 && jdate2 && jdate1.Abs && jdate2.Abs && jdate1.Abs === jdate2.Abs;
  }
  /**
   * Compares two jDates to see if they both refer to the same Jewish Month.
   * @param {jDate} jdate1
   * @param {jDate} jdate2
   */
  static isSameJMonth(jdate1: jDate, jdate2: jDate) {
    return jdate1.Month === jdate2.Month && jdate1.Year === jdate2.Year;
  }
  /**
   * Compares two dates to se if they both refer to the same Secular Month.
   * @param {Date} sdate1
   * @param {Date} sdate2
   */
  static isSameSMonth(sdate1: Date, sdate2: Date) {
    return sdate1.getMonth() === sdate2.getMonth() && sdate1.getFullYear() === sdate2.getFullYear();
  }
  /**
   * Determines if the time of the given Date() is after sunset at the given Location
   * @param {Date} sdate
   * @param {Location} location
   */
  static isAfterSunset(sdate: Date, location: Location) {
    const shkia = Zmanim.getSunTimes(sdate, location).sunset,
      now = Utils.timeFromDate(sdate);
    return shkia && Utils.isTimeAfter(shkia, now);
  }
  /**
   * Gets the current Jewish Date at the given Location
   * @param {Location} location
   */
  static nowAtLocation(location: Location) {
    let sdate = new Date();
    //if isAfterSunset a day is added.
    if (Utils.isAfterSunset(sdate, location)) {
      sdate.setDate(sdate.getDate() + 1);
    }
    return new jDate(sdate);
  }


  /***
   * Takes either a jDate or a Date and returns both
   * @param date {Date |jDate}
   * @returns {{ sdate:Date, jdate:jDate }}
   */
  static bothDates(date: Date | jDate) {
    const jdate = date instanceof Date ? new jDate(date as Date) : (date as jDate);
    const sdate = date instanceof Date ? (date as Date) : jdate.getDate();
    return { sdate, jdate };
  }
  /** Returns true if "thing" is either a string primitive or String object.*/
  static isString(thing: unknown) {
    return typeof thing === "string" || thing instanceof String;
  }
  /** Returns true if "thing" is either a number primitive or a Number object.*/
  static isNumber(thing: unknown) {
    return typeof thing === "number" || thing instanceof Number;
  }

  /** Returns the first value unless it is undefined, null or NaN.
   *
   * This is very useful for boolean, string and integer parameters
   * where we want to keep false, "" and 0 if they were supplied.
   *
   * Similar purpose to default parameters with the difference being that this function will return
   * the second value if the first is NaN or null, while default params will give give you the NaN or the null.
   */
  static setDefault(paramValue: unknown, defValue: unknown) {
    if (typeof paramValue === "undefined" || paramValue === null || isNaN(paramValue as number)) {
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
  static range(start: number, end?: number) {
    const startNumber = typeof end === "undefined" ? 1 : start,
      endNumber = typeof end === "undefined" ? start : end;

    return Array.from({ length: endNumber - startNumber + 1 }, (v, i) => startNumber + i);
  }
  /**
   * Log message to console
   * @param {string} txt
   */
  static log(txt: string, ...optionalItems: any[]) {
    if (__DEV__) {
      console.log(txt, ...optionalItems);
    }
  }
  /**
   * Warn message to console
   * @param {string} txt
   */
  static warn(txt: string, ...optionalItems: any[]) {
    if (__DEV__) {
      console.warn(txt, ...optionalItems);
    }
  }
  /**
   * Error message to console
   * @param {*} txt
   */
  static error(txt: string, ...optionalItems: any[]) {
    if (__DEV__) {
      console.error(txt, ...optionalItems);
    }
  }
}
