"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_js_1 = __importDefault(require("./Utils.js"));
const jDate_js_1 = __importDefault(require("./jDate.js"));
const GeneralUtils_js_1 = require("../GeneralUtils.js");
const Location_1 = __importDefault(require("./Location"));
/**
 * Computes the daily Zmanim for any single date at any location.
 * The astronomical and mathematical calculations were directly adapted from the excellent
 * Jewish calendar calculation in C# Copyright © by Ulrich and Ziporah Greve (2005)
 */
class Zmanim {
    /**
     * Gets sunrise and sunset time for given date and Location.
     * Accepts a javascript Date object, a string for creating a javascript date object or a jDate object.
     * Location object is required.
     * @returns {{sunrise:{hour:Number, minute:Number, second:Number},sunset:{hour:Number, minute:Number, second:Number}}}
     * @param {Date | jDate} date A Javascript Date or Jewish Date for which to calculate the sun times.
     * @param {Location} location Where on the globe to calculate the sun times for.
     * @param {Boolean} considerElevation
     */
    static getSunTimes(date, location, considerElevation = true) {
        if (date instanceof jDate_js_1.default) {
            date = date.getDate();
        }
        else if (date instanceof String) {
            date = new Date(date);
        }
        if (!(0, GeneralUtils_js_1.isValidDate)(date)) {
            throw 'Zmanim.getSunTimes: supplied date parameter cannot be converted to a Date';
        }
        let sunrise, sunset, zenithDeg = 90, zenithMin = 50, lonHour = 0, longitude = 0, latitude = 0, cosLat = 0, sinLat = 0, cosZen = 0, sinDec = 0, cosDec = 0, xmRise = 0, xmSet = 0, xlRise = 0, xlSet = 0, aRise = 0, aSet = 0, ahrRise = 0, ahrSet = 0, hRise = 0, hSet = 0, tRise = 0, tSet = 0, utRise = 0, utSet = 0;
        const day = Zmanim.dayOfYear(date), earthRadius = 6356900, zenithAtElevation = Zmanim.degToDec(zenithDeg, zenithMin) +
            Zmanim.radToDeg(Math.acos(earthRadius / (earthRadius +
                (considerElevation ? location.Elevation : 0))));
        zenithDeg = Math.floor(zenithAtElevation);
        zenithMin = (zenithAtElevation - zenithDeg) * 60;
        cosZen = Math.cos(0.01745 * Zmanim.degToDec(zenithDeg, zenithMin));
        longitude = location.Longitude;
        lonHour = longitude / 15;
        latitude = location.Latitude;
        cosLat = Math.cos(0.01745 * latitude);
        sinLat = Math.sin(0.01745 * latitude);
        tRise = day + (6 + lonHour) / 24;
        tSet = day + (18 + lonHour) / 24;
        xmRise = Zmanim.M(tRise);
        xlRise = Zmanim.L(xmRise);
        xmSet = Zmanim.M(tSet);
        xlSet = Zmanim.L(xmSet);
        aRise = 57.29578 * Math.atan(0.91746 * Math.tan(0.01745 * xlRise));
        aSet = 57.29578 * Math.atan(0.91746 * Math.tan(0.01745 * xlSet));
        if (Math.abs(aRise + 360 - xlRise) > 90) {
            aRise += 180;
        }
        if (aRise > 360) {
            aRise -= 360;
        }
        if (Math.abs(aSet + 360 - xlSet) > 90) {
            aSet += 180;
        }
        if (aSet > 360) {
            aSet -= 360;
        }
        ahrRise = aRise / 15;
        sinDec = 0.39782 * Math.sin(0.01745 * xlRise);
        cosDec = Math.sqrt(1 - sinDec * sinDec);
        hRise = (cosZen - sinDec * sinLat) / (cosDec * cosLat);
        ahrSet = aSet / 15;
        sinDec = 0.39782 * Math.sin(0.01745 * xlSet);
        cosDec = Math.sqrt(1 - sinDec * sinDec);
        hSet = (cosZen - sinDec * sinLat) / (cosDec * cosLat);
        if (Math.abs(hRise) <= 1) {
            hRise = 57.29578 * Math.acos(hRise);
            utRise = ((360 - hRise) / 15) + ahrRise + Zmanim.adj(tRise) + lonHour;
            sunrise = Zmanim.timeAdj(utRise + location.UTCOffset, date, location);
            if (sunrise.hour > 12) {
                sunrise.hour -= 12;
            }
        }
        if (Math.abs(hSet) <= 1) {
            hSet = 57.29578 * Math.acos(hSet);
            utSet = (hRise / 15) + ahrSet + Zmanim.adj(tSet) + lonHour;
            sunset = Zmanim.timeAdj(utSet + location.UTCOffset, date, location);
            if (sunset.hour > 0 && sunset.hour < 12) {
                sunset.hour += 12;
            }
        }
        return { sunrise: sunrise, sunset: sunset };
    }
    /**
     * @param {jDate | Date} date
     * @param {Location} location
     */
    static getChatzos(date, location) {
        return Zmanim.getChatzosFromSuntimes(Zmanim.getSunTimes(date, location, false));
    }
    /**
     * @param {{ sunrise: any; sunset: any; }} sunTimes
     */
    static getChatzosFromSuntimes(sunTimes) {
        const rise = sunTimes.sunrise, set = sunTimes.sunset;
        if (isNaN(rise.hour) || isNaN(set.hour)) {
            return { hour: NaN, minute: NaN };
        }
        const chatz = Utils_js_1.default.toInt((Utils_js_1.default.totalSeconds(set) - Utils_js_1.default.totalSeconds(rise)) / 2);
        return Utils_js_1.default.addSeconds(rise, chatz);
    }
    /**
     * @param {jDate | Date} date
     * @param {Location} location
     * @param {any} offset
     */
    static getShaaZmanis(date, location, offset) {
        return Zmanim.getShaaZmanisFromSunTimes(Zmanim.getSunTimes(date, location, false), offset);
    }
    /**
     * @param {{ sunrise: any; sunset: any; }} sunTimes
     * @param {number} [offset]
     */
    static getShaaZmanisFromSunTimes(sunTimes, offset) {
        let rise = sunTimes.sunrise, set = sunTimes.sunset;
        if (isNaN(rise.hour) || isNaN(set.hour)) {
            return NaN;
        }
        if (offset) {
            rise = Utils_js_1.default.addMinutes(rise, -offset);
            set = Utils_js_1.default.addMinutes(set, offset);
        }
        return (Utils_js_1.default.totalSeconds(set) - Utils_js_1.default.totalSeconds(rise)) / 720;
    }
    /**
     * @param {{ sunrise: any; sunset: any; }} sunTimes
     * @param {boolean} israel
     */
    static getShaaZmanisMga(sunTimes, israel) {
        const minutes = israel ? 90 : 72;
        let rise = Utils_js_1.default.addMinutes(sunTimes.sunrise, -minutes), set = Utils_js_1.default.addMinutes(sunTimes.sunset, minutes);
        if (isNaN(rise.hour) || isNaN(set.hour)) {
            return NaN;
        }
        return (Utils_js_1.default.totalSeconds(set) - Utils_js_1.default.totalSeconds(rise)) / 720;
    }
    /**
     * @param {jDate | Date} date
     * @param {Location} location
     */
    static getCandleLighting(date, location) {
        return Zmanim.getCandleLightingFromSunTimes(Zmanim.getSunTimes(date, location), location);
    }
    /**
     * @param {{ sunrise?: { hour: number; minute: number; second: number; }; sunset: any; }} sunTimes
     * @param {any} location
     */
    static getCandleLightingFromSunTimes(sunTimes, location) {
        return Zmanim.getCandleLightingFromSunset(sunTimes.sunset, location);
    }
    /**
     * @param {{ hour: number; minute: number; second: number; }} sunset
     * @param {Location} location
     */
    static getCandleLightingFromSunset(sunset, location) {
        return Utils_js_1.default.addMinutes(sunset, -location.CandleLighting);
    }
    /**
     * @param {Date} date
     */
    static dayOfYear(date) {
        const month = date.getMonth(), isLeap = () => Utils_js_1.default.isSecularLeapYear(date.getFullYear()), yearDay = [0, 1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        return yearDay[month + 1] + date.getDate() + ((month > 1 && isLeap()) ? 1 : 0);
    }
    /**
     * @param {number} deg
     * @param {number} min
     */
    static degToDec(deg, min) {
        return (deg + min / 60);
    }
    /**
     * @param {number} x
     */
    static M(x) {
        return (0.9856 * x - 3.251);
    }
    /**
     * @param {number} x
     */
    static L(x) {
        return (x + 1.916 * Math.sin(0.01745 * x) + 0.02 * Math.sin(2 * 0.01745 * x) + 282.565);
    }
    /**
     * @param {number} x
     */
    static adj(x) {
        return (-0.06571 * x - 6.62);
    }
    /**
     * @param {number} rad
     */
    static radToDeg(rad) {
        return 57.29578 * rad;
    }
    /**
     * @param {number} time
     * @param {Date} date
     * @param {Location} location
     */
    static timeAdj(time, date, location) {
        if (time < 0) {
            time += 24;
        }
        let hour = Utils_js_1.default.toInt(time);
        const minFloat = (time - hour) * 60 + 0.5, min = Utils_js_1.default.toInt(minFloat), sec = Math.round(60.0 * (minFloat - min));
        if (Utils_js_1.default.isDST(location, date)) {
            hour++;
        }
        return Utils_js_1.default.fixTime({ hour: hour, minute: min, second: sec });
    }
}
exports.default = Zmanim;
