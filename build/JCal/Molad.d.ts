import jDate from './jDate.js';
import { Time } from '../jcal-zmanim.js';
/**
 * Gets the molad for the given jewish month and year.
 * Algorithm was adapted from Hebcal by Danny Sadinoff
 *
 * Example of use:
 * const moladString = Molad.getString(5776, 10);
 */
export default class Molad {
    /**
     *
     * @param {Number} month
     * @param {Number} year
     * @returns {{jDate:jDate,time:Time,chalakim:number}}
     */
    static getMolad(month: number, year: number): {
        jDate: jDate;
        time: Time;
        chalakim: number;
    };
    /**
     * Returns the time of the molad as a string in the format: Monday Night, 8:33 PM and 12 Chalakim
     * The molad is always in Jerusalem so we use the Jerusalem sunset times
     * to determine whether to display "Night" or "Motzai Shabbos" etc. (check this...)
     * @param {Number} year
     * @param {Number} month
     */
    static getString(year: number, month: number): string;
    time(sunset: any, time: any): void;
    /**
     * Returns the time of the molad as a string in the format: ליל שני 20:33 12 חלקים
     * The molad is always in Jerusalem so we use the Jerusalem sunset times
     * to determine whether to display "ליל/יום" or "מוצאי שב"ק" etc.
     * @param {Number} year
     * @param {Number} month
     */
    static getStringHeb(year: number, month: number): string;
}
