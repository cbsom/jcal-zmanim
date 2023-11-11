import Utils from './Utils.js';
import jDate from './jDate.js';
import Location from './Location.js';
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
     * @param {Number} month
     * @param {Number} year
     * @returns {{jDate:jDate,time:Time,chalakim:number}}
     */
    static getMolad(month: number, year: number): { jDate: jDate, time: Time, chalakim: number } {
        let totalMonths, partsElapsed, hoursElapsed, parts, monthAdj = month - 7;

        if (monthAdj < 0) {
            monthAdj += jDate.monthsJYear(year);
        }
        totalMonths = Utils.toInt(monthAdj + 235 * Utils.toInt((year - 1) / 19) + 12 * ((year - 1) % 19) +
            ((((year - 1) % 19) * 7) + 1) / 19);
        partsElapsed = 204 + (793 * (totalMonths % 1080));
        hoursElapsed = 5 + (12 * totalMonths) + 793 * Utils.toInt(totalMonths / 1080) +
            Utils.toInt(partsElapsed / 1080) - 6;
        parts = Utils.toInt((partsElapsed % 1080) + 1080 * (hoursElapsed % 24));

        return {
            jDate: new jDate((1 + (29 * Utils.toInt(totalMonths))) + Utils.toInt((hoursElapsed / 24))),
            time: { hour: Utils.toInt(hoursElapsed) % 24, minute: Utils.toInt((parts % 1080) / 18), second: 0 },
            chalakim: parts % 18
        };
    }

    /**
     * Returns the time of the molad as a string in the format: Monday Night, 8:33 PM and 12 Chalakim
     * The molad is always in Jerusalem so we use the Jerusalem sunset times
     * to determine whether to display "Night" or "Motzai Shabbos" etc. (check this...)
     * @param {Number} year
     * @param {Number} month
     */
    static getString(year: number, month: number): string {
        const molad = Molad.getMolad(month, year),
            zmanim = molad.jDate.getSunriseSunset(Location.getJerusalem()),
            isNight = Utils.isTimeAfter(zmanim.sunset, molad.time),
            dow = molad.jDate.getDayOfWeek();
        let str = '';

        if (!zmanim.sunset || isNaN(zmanim.sunset.hour)) {
            str += Utils.dowEng[dow];
        }
        else if (dow === 6 && isNight) {
            str += 'Motzai Shabbos,';
        }
        else if (dow === 5 && isNight) {
            str += 'Shabbos Night,';
        }
        else {
            str += Utils.dowEng[dow] + (isNight ? ' Night' : '');
        }
        str += ' ' + Utils.getTimeString(molad.time) + ' and ' +
            molad.chalakim.toString() + ' Chalakim';

        return str;
    }

    /**
     * Returns the time of the molad as a string in the format: ליל שני 20:33 12 חלקים
     * The molad is always in Jerusalem so we use the Jerusalem sunset times
     * to determine whether to display "ליל/יום" or "מוצאי שב"ק" etc.
     * @param {Number} year
     * @param {Number} month
     */
    static getStringHeb(year: number, month: number): string {
        const molad = Molad.getMolad(month, year),
            zmanim = molad.jDate.getSunriseSunset(Location.getJerusalem()),
            isNight = Utils.isTimeAfter(zmanim.sunset, molad.time) &&
                Utils.isTimeAfter(molad.time, zmanim.sunrise),
            dow = molad.jDate.getDayOfWeek();
        let str = '';

        if (dow === 6) {
            str += (isNight ? 'מוצאי שב"ק' : 'יום שב"ק');
        }
        else if (dow === 5) {
            str += (isNight ? 'ליל שב"ק' : 'ערב שב"ק');
        }
        else {
            str += (isNight ? 'ליל' : 'יום') +
                Utils.dowHeb[dow].replace('יום', '');
        }
        str += ' ' + Utils.getTimeString(molad.time, 1, true) + ' ' +
            molad.chalakim.toString() + ' חלקים';

        return str;
    }
}