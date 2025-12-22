import Location from "./Location.js";
import { Time } from "../jcal-zmanim.js";

const MS_PER_DAY = 8.64e7;
const JS_START_DATE_ABS = 719163;
const JS_START_OFFSET = new Date(0).getTimezoneOffset();

/**
 * Pure Date and Math Utilities
 */
export default class DateUtils {
    /**
     * Converts the given complex number to an integer by removing the decimal part.
     */
    static toInt(float: number) {
        return Math.floor(float);
    }

    /**
     * Add two character suffix to number. e.g. 21st, 102nd, 93rd, 500th
     */
    static toSuffixed(num: number) {
        const t = num.toString();
        let suffix = "th";
        if (t.length === 1 || t[t.length - 2] !== "1") {
            switch (t[t.length - 1]) {
                case "1": suffix = "st"; break;
                case "2": suffix = "nd"; break;
                case "3": suffix = "rd"; break;
            }
        }
        return t + suffix;
    }

    /**
     * Gets the absolute date of the given javascript Date object.
     * @param {Date} date
     */
    static absSd(date: Date): number {
        //Get the correct number of milliseconds since 1/1/1970 00:00:00 UTC until current system time
        const ms = date.valueOf() - date.getTimezoneOffset() * 60000;
        //The number of full days since 1/1/1970.
        const numFullDays = Math.floor(ms / MS_PER_DAY);
        //Add that to the number of days from 1/1/0001 until 1/1/1970 00:00:00 UTC
        return JS_START_DATE_ABS + numFullDays;
    }

    /**
     * Gets a javascript date from an absolute date
     */
    static sdFromAbs(abs: number): Date {
        const offset = JS_START_OFFSET > 0 ? 1 : 0;
        const daysSinceStart = abs - JS_START_DATE_ABS + offset;
        return new Date(daysSinceStart * MS_PER_DAY);
    }

    /**
     * Gets the total number of minutes in the given time.
     */
    static totalMinutes(time: Time) {
        return time ? time.hour * 60 + time.minute : 0;
    }

    /**
     * Gets the total number of seconds in the given time.
     */
    static totalSeconds(time: Time) {
        return time ? DateUtils.totalMinutes(time) * 60 + (time.second || 0) : 0;
    }

    /**
     * Makes sure hour is between 0 and 23 and minute is between 0 and 59.
     */
    static fixTime(time: Time): Time {
        //make a copy
        const result = {
            hour: time.hour,
            minute: time.minute,
            second: time.second || 0,
        };
        while (result.second >= 60) {
            result.minute += 1;
            result.second -= 60;
        }
        while (result.second < 0) {
            result.minute -= 1;
            result.second += 60;
        }
        while (result.minute < 0) {
            result.minute += 60;
            result.hour--;
        }
        while (result.minute >= 60) {
            result.minute -= 60;
            result.hour++;
        }
        if (result.hour < 0) {
            result.hour = 24 + (result.hour % 24);
        }
        if (result.hour > 23) {
            result.hour = result.hour % 24;
        }
        return result;
    }

    /**
     * Add the given number of minutes to the given time.
     */
    static addMinutes(time?: Time, minutes?: number): Time | undefined {
        if (!time) return time;
        return DateUtils.fixTime({
            hour: time.hour,
            minute: time.minute + (minutes || 0),
            second: time.second,
        });
    }

    /**
     * Add the given number of seconds to the given time.
     */
    static addSeconds(time: Time, seconds: number) {
        return DateUtils.fixTime({
            hour: time.hour,
            minute: time.minute,
            second: (time.second || 0) + seconds,
        });
    }

    /**
     * Gets the time difference between two times of day.
     */
    static timeDiff(earlierTime: Time, laterTime: Time, showNegative = false) {
        const earlySec = DateUtils.totalSeconds(earlierTime),
            laterSec = DateUtils.totalSeconds(laterTime),
            time = DateUtils.fixTime({
                hour: 0,
                minute: 0,
                second:
                    earlySec <= laterSec
                        ? laterSec - earlySec
                        : showNegative
                            ? earlySec - laterSec
                            : 86400 - earlySec + laterSec,
            });

        return {
            ...time,
            sign: earlySec <= laterSec || !showNegative ? 1 : -1,
        };
    }

    /**
     * Gets the UTC offset in whole hours for the users time zone.
     */
    static currUtcOffset() {
        const date = new Date(),
            jan = new Date(date.getFullYear(), 0, 1),
            jul = new Date(date.getFullYear(), 6, 1);
        return -DateUtils.toInt(Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset()) / 60);
    }

    /** Determines if the given date is within DST on the users system */
    static isDateDST(date: Date) {
        return -DateUtils.toInt(date.getTimezoneOffset() / 60) !== DateUtils.currUtcOffset();
    }

    static isUSA_DST(date: Date) {
        const year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours();

        if (month < 3 || month == 12) {
            return false;
        } else if (month > 3 && month < 11) {
            return true;
        }
        //DST starts at 2 AM on the second Sunday in March
        else if (month === 3) {
            const firstDOW = new Date(year, 2, 1).getDay(), // month is 0-indexed in JS Date
                targetDate = firstDOW == 0 ? 8 : 7 - ((firstDOW + 7) % 7) + 8;
            return day > targetDate || (day === targetDate && hour >= 2);
        }
        //DST ends at 2 AM on the first Sunday in November
        else {
            const firstDOW = new Date(year, 10, 1).getDay(),
                targetDate = firstDOW === 0 ? 1 : 7 - ((firstDOW + 7) % 7) + 1;
            return day < targetDate || (day === targetDate && hour < 2);
        }
    }

    static isIsrael_DST(date: Date) {
        const year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours();

        if (month > 10 || month < 3) {
            return false;
        } else if (month > 3 && month < 10) {
            return true;
        }
        //DST starts at 2 AM on the Friday before the last Sunday in March
        else if (month === 3) {
            // Friday before last Sunday logic...
            // Utils.getSdDOW uses new Date(year, month-1, day).getDay()
            const lastFriDate = 31 - new Date(year, 2, 31).getDay() - 2;
            return day > lastFriDate || (day === lastFriDate && hour >= 2);
        }
        //DST ends at 2 AM on the last Sunday in October
        else {
            const lastSunDate = 31 - new Date(year, 9, 31).getDay();
            return day < lastSunDate || (day === lastSunDate && hour < 2);
        }
    }

    /**
     * Determines if the given date is within DST in the given location
     */
    static isDST(location: Location, date: Date) {
        if (location.UTCOffset === DateUtils.currUtcOffset()) {
            return DateUtils.isDateDST(date);
        } else if (location.Israel) {
            return DateUtils.isIsrael_DST(date);
        } else {
            return DateUtils.isUSA_DST(date);
        }
    }

    /** Returns whether or not the given, array, string, or argument list contains the given item or substring. */
    static has(o: unknown, ...arr: unknown[]) {
        if (arr.length === 1 && (Array.isArray(arr[0]) || (typeof arr[0] === "string" || arr[0] instanceof String))) {
            return (arr[0] as unknown[]).includes(o);
        } else {
            return arr.includes(o);
        }
    }

    static isSecularLeapYear(year: number) {
        return !(year % 400) || (!!(year % 100) && !(year % 4));
    }

    static isValidDate(thing: unknown) {
        return thing instanceof Date && !isNaN(thing.valueOf());
    }
    static isString(thing: unknown) {
        return typeof thing === "string" || thing instanceof String;
    }
    static isNumber(thing: unknown) {
        return typeof thing === "number" || thing instanceof Number;
    }
}
