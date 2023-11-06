import jDate from './jDate.js';
/**
 * Computes the Sedra/Sedras of the week for the given day.
 * The property "sedras" an array of sedras (either one or two) for the given Jewish Date
 * Sample of use to get todays sedra in Israel:
 *     const sedras = new Sedra(new jDate(new Date(), true)).toString();
 * The code was converted to javascript and tweaked by CBS.
 * It is directly based on the C code in Danny Sadinoff's HebCal - Copyright (C) 1994.
 * Portions of that code are Copyright (c) 2002 Michael J. Radwin. All Rights Reserved.
 * Many of the algorithms were taken from hebrew calendar routines implemented by Nachum Dershowitz
 * @property sedras {[{ eng: String, heb: String }]}
 */
export default class Sedra {
    sedras: {
        eng: string;
        heb: string;
    }[];
    /**
     * @param {jDate} jd
     * @param {boolean} israel
     */
    constructor(jd: jDate, israel: boolean);
    /**
     * Gets the sedra/s as a string. If there are two, they are seperated by a " - "
     */
    toString(): string;
    /**
     * Gets the sedra/s as a string. If there are two, they are seperated by a " - "
     */
    toStringHeb(): string;
    static lastCalculatedYear: {
        firstSatInYear: number;
        sedraArray?: number[];
        year: number;
        israel: boolean;
    } | null;
    static sedraList: {
        eng: string;
        heb: string;
    }[];
    static shabbos_short: number[];
    static shabbos_long: number[];
    static mon_short: number[];
    static mon_long: number[];
    static thu_normal: number[];
    static thu_normal_Israel: number[];
    static thu_long: number[];
    static shabbos_short_leap: number[];
    static shabbos_long_leap: number[];
    static mon_short_leap: number[];
    static mon_short_leap_Israel: number[];
    static mon_long_leap: number[];
    static mon_long_leap_Israel: number[];
    static thu_short_leap: number[];
    static thu_long_leap: number[];
    static getDayOnOrBefore(day_of_week: number, date: number): number;
    static getSedraOrder(year: number, israel: boolean): {
        firstSatInYear: number;
        sedraArray?: number[] | undefined;
        year: number;
        israel: boolean;
    };
}
