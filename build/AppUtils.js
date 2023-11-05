"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhichDaysFlags = exports.DaysOfWeek = void 0;
const Utils_1 = __importDefault(require("./JCal/Utils"));
const Zmanim_1 = __importDefault(require("./JCal/Zmanim"));
const Location_1 = __importDefault(require("./JCal/Location"));
const Settings_1 = __importDefault(require("./Settings"));
const jDate_1 = __importDefault(require("./JCal/jDate"));
const ZmanTypes_1 = require("./ZmanTypes");
exports.DaysOfWeek = Object.freeze({
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SHABBOS: 6,
});
exports.WhichDaysFlags = Object.freeze({
    SUNDAY: 1,
    MONDAY: 2,
    TUESDAY: 4,
    WEDNESDAY: 8,
    THURSDAY: 16,
    FRIDAY: 32,
    SHABBOS: 64,
    YOMTOV: 128,
});
class AppUtils {
    /**
     * Returns the date corrected time of the given zmanim on the given date at the given location
     * If the zman is after or within 30 minutes of the given time, this days zman is returned, othwise tomorrows zman is returned.
     * @param {Date} sdate
     * @param {jDate} jdate
     * @param {{hour : Number, minute :Number, second: Number }} time
     * @param {Settings} settings
     * @param {{hour : Number, minute :Number, second: Number }} sunset
     * @returns {[{zmanType:{id:Number,offset:?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String },time:{hour : Number, minute :Number, second: Number }, isTomorrow:Boolean}]}
     */
    static getCorrectZmanTimes(sdate, jdate, time, settings, sunset) {
        const correctedTimes = [], zmanTypes = settings.zmanimToShow, location = settings.location, tomorrowJd = jdate.addDays(1), tomorrowSd = Utils_1.default.addDaysToSdate(sdate, 1), 
        /*  Candle lighting and chometz times are not shown after sunset.
            This solves the issue of Candle lighting showing as having "passed 20 minutes ago"
            Thursday evening after sunset - which shows as hasCandleLighting = true
            as it is already Friday... */
        zmanTimes = AppUtils.getZmanTimes(zmanTypes.filter((zt) => ![21, 22, 23].includes(zt.id) || Utils_1.default.isTimeAfter(time, sunset)), sdate, jdate, location), tomorrowTimes = AppUtils.getZmanTimes(
        //Candle lighting tomorrow is never shown...
        zmanTypes.filter((zt) => zt.id !== 21), tomorrowSd, tomorrowJd, location);
        for (let zt of zmanTimes) {
            let oTime = zt.time, isTomorrow = false, diff = Utils_1.default.timeDiff(time, oTime, true);
            if (diff.sign < 1 &&
                Utils_1.default.totalMinutes(diff) >= settings.minToShowPassedZman) {
                const tom = tomorrowTimes.find((t) => t.zmanType === zt.zmanType);
                if (tom && tom.time) {
                    oTime = tom.time;
                    isTomorrow = true;
                }
            }
            correctedTimes.push({
                zmanType: zt.zmanType,
                time: oTime,
                isTomorrow,
            });
        }
        return correctedTimes.sort((a, b) => (a.isTomorrow ? 1 : -1) - (b.isTomorrow ? 1 : -1) ||
            Utils_1.default.totalSeconds(a.time) - Utils_1.default.totalSeconds(b.time));
    }
    /**
     * Gets the zmanim for all the types in the given list.
     * @param {[{id:number,offset:?number, whichDaysFlags:?Number,desc:?String,eng:?String,heb:?String}]} zmanTypes An array of ZmanTypes to get the zman for.
     * @param {Date} date The secular date to get the zmanim for
     * @param {jDate} jdate The jewish date to get the zmanim for
     * @param {Location} location The location for which to get the zmanim
     * @returns{[{zmanType:{id:number,offset:?number,desc:String,eng:String,heb:String },time:{hour:Number,minute:Number,second:Number}}]}
     */
    static getZmanTimes(zmanTypes, date, jdate, location) {
        const mem = AppUtils.zmanTimesCache.find((z) => Utils_1.default.isSameSdate(z.date, date) &&
            z.location.Name === location.Name), zmanTimes = [], whichDay = AppUtils.getWhichDays(date, jdate, location);
        let sunrise, sunset, suntimesMishor, sunriseMishor, sunsetMishor, mishorNeg90, chatzos, shaaZmanis, shaaZmanisMga;
        if (mem) {
            sunrise = mem.sunrise;
            sunset = mem.sunset;
            suntimesMishor = mem.suntimesMishor;
            sunriseMishor = mem.sunriseMishor;
            sunsetMishor = mem.sunsetMishor;
            mishorNeg90 = mem.mishorNeg90;
            chatzos = mem.chatzos;
            shaaZmanis = mem.shaaZmanis;
            shaaZmanisMga = mem.shaaZmanisMga;
        }
        else {
            const suntimes = Zmanim_1.default.getSunTimes(date, location, true);
            sunrise = suntimes.sunrise;
            sunset = suntimes.sunset;
            suntimesMishor = Zmanim_1.default.getSunTimes(date, location, false);
            sunriseMishor = suntimesMishor.sunrise;
            sunsetMishor = suntimesMishor.sunset;
            mishorNeg90 = Utils_1.default.addMinutes(sunriseMishor, -90);
            chatzos =
                sunriseMishor &&
                    sunsetMishor &&
                    Zmanim_1.default.getChatzosFromSuntimes(suntimesMishor);
            shaaZmanis =
                sunriseMishor &&
                    sunsetMishor &&
                    Zmanim_1.default.getShaaZmanisFromSunTimes(suntimesMishor);
            shaaZmanisMga =
                sunriseMishor &&
                    sunsetMishor &&
                    Zmanim_1.default.getShaaZmanisMga(suntimesMishor, true);
            AppUtils.zmanTimesCache.push({
                date,
                location,
                sunrise,
                sunset,
                suntimesMishor,
                sunriseMishor,
                sunsetMishor,
                mishorNeg90,
                chatzos,
                shaaZmanis,
                shaaZmanisMga,
            });
        }
        for (let zmanType of zmanTypes) {
            const offset = zmanType.offset &&
                (!zmanType.whichDaysFlags || zmanType.whichDaysFlags & whichDay)
                ? zmanType.offset
                : 0;
            switch (zmanType.id) {
                case ZmanTypes_1.ZmanTypeIds.ChatzosLayla: // chatzosNight
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(chatzos, 720 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.Alos90: // alos90
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils_1.default.addMinutes(mishorNeg90, offset)
                            : mishorNeg90,
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.Alos72: // alos72
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunriseMishor, -72 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.TalisTefillin: //talisTefillin
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunriseMishor, -36 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.NetzAtElevation: //netzElevation
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils_1.default.addMinutes(sunrise, offset)
                            : sunrise,
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.NetzMishor: // netzMishor:
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils_1.default.addMinutes(sunriseMishor, offset)
                            : sunriseMishor,
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.szksMga: //szksMga
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(mishorNeg90, Math.floor(shaaZmanisMga * 3) + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.szksGra: //szksGra
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunriseMishor, Math.floor(shaaZmanis * 3) + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.sztMga: // sztMga
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(mishorNeg90, Math.floor(shaaZmanisMga * 4) + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.sztGra: //sztGra
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunriseMishor, Math.floor(shaaZmanis * 4) + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.chatzosDay: //chatzos
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils_1.default.addMinutes(chatzos, offset)
                            : chatzos,
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.minGed: //minGed
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(chatzos, shaaZmanis * 0.5 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.minKet: //minKet
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunriseMishor, shaaZmanis * 9.5 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.plag: //plag
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunriseMishor, shaaZmanis * 10.75 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.shkiaAtSeaLevel: //shkiaMishor
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils_1.default.addMinutes(sunsetMishor, offset)
                            : sunsetMishor,
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.shkiaElevation: //shkiaElevation
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils_1.default.addMinutes(sunset, offset)
                            : sunset,
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.tzais45: // tzais45
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunset, 45 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.tzais50: //tzais50
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunset, 50 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.tzais72: //tzais72
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunset, 72 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.rabbeinuTamZmanios: //tzais72Zmaniot
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunset, shaaZmanis * 1.2 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.rabbeinuTamZmaniosMga: //tzais72ZmaniotMA
                    zmanTimes.push({
                        zmanType,
                        time: Utils_1.default.addMinutes(sunset, shaaZmanisMga * 1.2 + offset),
                    });
                    break;
                case ZmanTypes_1.ZmanTypeIds.candleLighting: //candleLighting
                    if (jdate.hasCandleLighting()) {
                        zmanTimes.push({
                            zmanType,
                            time: Utils_1.default.addMinutes(Zmanim_1.default.getCandleLightingFromSunset(sunset, location), offset),
                        });
                    }
                    break;
                case ZmanTypes_1.ZmanTypeIds.SofZmanEatingChometz: //Sof Zman Achilas Chometz
                    if (jdate.Month === 1 &&
                        jdate.Day === 14 &&
                        Utils_1.default.isTimeAfter(sunrise, Utils_1.default.timeFromDate(date))) {
                        zmanTimes.push({
                            zmanType,
                            time: Utils_1.default.addMinutes(sunrise, -90 + offset + shaaZmanisMga * 4),
                        });
                    }
                    break;
                case ZmanTypes_1.ZmanTypeIds.SofZmanBurnChometz: //Sof Zman Biur Chometz
                    if (jdate.Month === 1 &&
                        (jdate.Day === 14 ||
                            (jdate.DayOfWeek === exports.DaysOfWeek.FRIDAY &&
                                jdate.Day === 13)) &&
                        Utils_1.default.isTimeAfter(sunrise, Utils_1.default.timeFromDate(date))) {
                        zmanTimes.push({
                            zmanType,
                            time: Utils_1.default.addMinutes(sunrise, -90 + offset + shaaZmanisMga * 5),
                        });
                    }
                    break;
            }
        }
        return zmanTimes;
    }
    /**
     * Get the WhichDaysFlags for the given secular date
     * @param {Date} date
     * @param {jDate} jdate
     * @param {Location} location
     */
    static getWhichDays(date, jdate, location) {
        if (jdate.isYomTov(location.Israel)) {
            return exports.WhichDaysFlags.YOMTOV;
        }
        switch (date.getDay()) {
            case exports.DaysOfWeek.SUNDAY:
                return exports.WhichDaysFlags.SUNDAY;
            case exports.DaysOfWeek.MONDAY:
                return exports.WhichDaysFlags.MONDAY;
            case exports.DaysOfWeek.TUESDAY:
                return exports.WhichDaysFlags.TUESDAY;
            case exports.DaysOfWeek.WEDNESDAY:
                return exports.WhichDaysFlags.WEDNESDAY;
            case exports.DaysOfWeek.THURSDAY:
                return exports.WhichDaysFlags.THURSDAY;
            case exports.DaysOfWeek.FRIDAY:
                return exports.WhichDaysFlags.FRIDAY;
            case exports.DaysOfWeek.SHABBOS:
                return exports.WhichDaysFlags.SHABBOS;
        }
        return 0;
    }
    /**
     * Returns the zmanim necessary for showing basic shul notifications: chatzosHayom, chatzosHalayla, alos
     * @param {Date} sdate
     * @param {Location} location
     * @returns {{chatzosHayom:{hour:Number,minute:Number,second:Number}, chatzosHalayla:{hour:Number,minute:Number,second:Number}, alos:{hour:Number,minute:Number,second:Number}, shkia:{hour:Number,minute:Number,second:Number} }}
     */
    static getBasicShulZmanim(sdate, jdate, location) {
        const zmanim = AppUtils.getZmanTimes([
            { id: ZmanTypes_1.ZmanTypeIds.chatzosDay },
            { id: ZmanTypes_1.ZmanTypeIds.Alos90 },
            { id: ZmanTypes_1.ZmanTypeIds.shkiaElevation },
            { id: ZmanTypes_1.ZmanTypeIds.candleLighting }, //candleLighting,
        ], sdate, jdate, location);
        return {
            chatzosHayom: zmanim[0].time,
            chatzosHalayla: Utils_1.default.addMinutes(zmanim[0].time, 720),
            alos: zmanim[1].time,
            shkia: zmanim[2].time,
        };
    }
    /**
     * Compares two zmanim for showing to see if they are the same
     * @param {{id:Number,offset:?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }} zman1
     * @param {{id:Number,offset:?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }} zman2
     */
    static IsSameZmanToShow(zman1, zman2) {
        return (zman1.id === zman2.id &&
            zman1.desc === zman2.desc &&
            zman1.eng === zman2.eng &&
            zman1.heb === zman2.heb &&
            (zman1.offset || 0) === (zman2.offset || 0) &&
            (zman1.whichDaysFlags || 0) === (zman2.whichDaysFlags || 0));
    }
    /**
     * Returns all available ZmanTypes - including baseTypes and custom added types
     * @param {Settings} settings
     */
    static AllZmanTypes(settings) {
        return [...ZmanTypes_1.ZmanTypes] /*.concat(settings.customZmanim)*/;
    }
}
AppUtils.zmanTimesCache = [];
exports.default = AppUtils;
