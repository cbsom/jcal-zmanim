"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_js_1 = __importDefault(require("./Utils.js"));
const jDate_js_1 = __importDefault(require("./jDate.js"));
const Location_1 = __importDefault(require("./Location"));
/**
 * Gets the molad for the given jewish month and year.
 * Algorithm was adapted from Hebcal by Danny Sadinoff
 *
 * Example of use:
 * const moladString = Molad.getString(5776, 10);
 */
class Molad {
    /**
     *
     * @param {Number} month
     * @param {Number} year
     * @returns {{jDate:jDate,time:{hour:Number,minute:Number,second:Number},chalakim:Number}}
     */
    static getMolad(month, year) {
        let totalMonths, partsElapsed, hoursElapsed, parts, monthAdj = month - 7;
        if (monthAdj < 0) {
            monthAdj += jDate_js_1.default.monthsJYear(year);
        }
        totalMonths = Utils_js_1.default.toInt(monthAdj + 235 * Utils_js_1.default.toInt((year - 1) / 19) + 12 * ((year - 1) % 19) +
            ((((year - 1) % 19) * 7) + 1) / 19);
        partsElapsed = 204 + (793 * (totalMonths % 1080));
        hoursElapsed = 5 + (12 * totalMonths) + 793 * Utils_js_1.default.toInt(totalMonths / 1080) +
            Utils_js_1.default.toInt(partsElapsed / 1080) - 6;
        parts = Utils_js_1.default.toInt((partsElapsed % 1080) + 1080 * (hoursElapsed % 24));
        return {
            jDate: new jDate_js_1.default((1 + (29 * Utils_js_1.default.toInt(totalMonths))) + Utils_js_1.default.toInt((hoursElapsed / 24))),
            time: { hour: Utils_js_1.default.toInt(hoursElapsed) % 24, minute: Utils_js_1.default.toInt((parts % 1080) / 18), second: 0 },
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
    static getString(year, month) {
        const molad = Molad.getMolad(month, year), zmanim = molad.jDate.getSunriseSunset(Location_1.default.getJerusalem()), isNight = Utils_js_1.default.isTimeAfter(zmanim.sunset, molad.time), dow = molad.jDate.getDayOfWeek();
        let str = '';
        if (isNaN(zmanim.sunset.hour)) {
            str += Utils_js_1.default.dowEng[dow];
        }
        else if (dow === 6 && isNight) {
            str += 'Motzai Shabbos,';
        }
        else if (dow === 5 && isNight) {
            str += 'Shabbos Night,';
        }
        else {
            str += Utils_js_1.default.dowEng[dow] + (isNight ? ' Night' : '');
        }
        str += ' ' + Utils_js_1.default.getTimeString(molad.time) + ' and ' +
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
    static getStringHeb(year, month) {
        const molad = Molad.getMolad(month, year), zmanim = molad.jDate.getSunriseSunset(Location_1.default.getJerusalem()), isNight = Utils_js_1.default.isTimeAfter(zmanim.sunset, molad.time) &&
            Utils_js_1.default.isTimeAfter(molad.time, zmanim.sunrise), dow = molad.jDate.getDayOfWeek();
        let str = '';
        if (dow === 6) {
            str += (isNight ? 'מוצאי שב"ק' : 'יום שב"ק');
        }
        else if (dow === 5) {
            str += (isNight ? 'ליל שב"ק' : 'ערב שב"ק');
        }
        else {
            str += (isNight ? 'ליל' : 'יום') +
                Utils_js_1.default.dowHeb[dow].replace('יום', '');
        }
        str += ' ' + Utils_js_1.default.getTimeString(molad.time, true) + ' ' +
            molad.chalakim.toString() + ' חלקים';
        return str;
    }
}
exports.default = Molad;
