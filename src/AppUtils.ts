import Utils from './JCal/Utils';
import Zmanim from './JCal/Zmanim';
import Location from './JCal/Location';
import Settings from './Settings';
import jDate from './JCal/jDate';
import { ZmanTypes, ZmanTypeIds, getZmanType } from './ZmanTypes';
import { SunTimes, Time, ZmanToShow } from './jcal-zmanim';

type ZmanTime = {
    date: Date,
    location: Location,
    sunrise: Time | undefined,
    sunset: Time | undefined,
    suntimesMishor: SunTimes | undefined,
    sunriseMishor: Time | undefined,
    sunsetMishor: Time | undefined,
    mishorNeg90: Time | undefined,
    chatzos: Time | undefined,
    shaaZmanis: number | undefined,
    shaaZmanisMga: number | undefined,
};

export const DaysOfWeek = Object.freeze({
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SHABBOS: 6,
});

export const WhichDaysFlags = Object.freeze({
    SUNDAY: 1,
    MONDAY: 2,
    TUESDAY: 4,
    WEDNESDAY: 8,
    THURSDAY: 16,
    FRIDAY: 32,
    SHABBOS: 64,
    YOMTOV: 128,
});

export default class AppUtils {
    static zmanTimesCache: ZmanTime[] = [];

    /**
     * Returns the date corrected time of the given zmanim on the given date at the given location
     * If the zman is after or within 30 minutes of the given time, this days zman is returned, othwise tomorrows zman is returned.
     * @param {Date} sdate
     * @param {jDate} jdate
     * @param {Time} time
     * @param {Settings} settings
     * @param {Time} sunset
     * @returns {[{zmanType:ZmanToShow,time:Time, isTomorrow:boolean}]}
     */
    static getCorrectZmanTimes(sdate: Date, jdate: jDate, time: Time, settings: Settings, sunset: Time) {
        const correctedTimes = [],
            zmanTypes = settings.zmanimToShow,
            location = settings.location,
            tomorrowJd = jdate.addDays(1),
            tomorrowSd = Utils.addDaysToSdate(sdate, 1),
            /*  Candle lighting and chometz times are not shown after sunset.
                This solves the issue of Candle lighting showing as having "passed 20 minutes ago"
                Thursday evening after sunset - which shows as hasCandleLighting = true
                as it is already Friday... */
            zmanTimes = AppUtils.getZmanTimes(
                zmanTypes.filter(
                    (zt) => ![21, 22, 23].includes(zt.id) || Utils.isTimeAfter(time, sunset),
                ),
                sdate,
                jdate,
                location,
            ),
            tomorrowTimes = AppUtils.getZmanTimes(
                //Candle lighting tomorrow is never shown...
                zmanTypes.filter((zt) => zt.id !== 21),
                tomorrowSd,
                tomorrowJd,
                location,
            );

        for (let zt of zmanTimes) {
            let oTime = zt.time as Time,
                isTomorrow = false,
                diff = Utils.timeDiff(time, oTime, true);
            if (
                diff.sign < 1 &&
                Utils.totalMinutes(diff) >= settings.minToShowPassedZman
            ) {
                const tom = tomorrowTimes.find(
                    (t) => t.zmanType === zt.zmanType,
                );
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
        return correctedTimes.sort(
            (a, b) =>
                (a.isTomorrow ? 1 : -1) - (b.isTomorrow ? 1 : -1) ||
                Utils.totalSeconds(a.time) - Utils.totalSeconds(b.time),
        );
    }

    /**
     * Gets the zmanim for all the types in the given list.
     * @param {[ZmanToShow]} zmanTypes An array of ZmanTypes to get the zman for.
     * @param {Date} date The secular date to get the zmanim for
     * @param {jDate} jdate The jewish date to get the zmanim for
     * @param {Location} location The location for which to get the zmanim
     * @returns{[{zmanType:{id:number,offset:?number,desc:string,eng:string,heb:string },time:Time}]}
     */
    static getZmanTimes(zmanTypes: ZmanToShow[], date: Date, jdate: jDate, location: Location): { zmanType: ZmanToShow, time?: Time }[] {
        const mem = AppUtils.zmanTimesCache.find(
            (z) =>
                Utils.isSameSdate(z.date, date) &&
                z.location.Name === location.Name,
        ),
            zmanTimes: { zmanType: ZmanToShow, time?: Time }[] = [],
            whichDay = AppUtils.getWhichDays(date, jdate, location);
        let sunrise: Time | undefined,
            sunset: Time | undefined,
            suntimesMishor: SunTimes | undefined,
            sunriseMishor: Time | undefined,
            sunsetMishor: Time | undefined,
            mishorNeg90: Time | undefined,
            chatzos: Time | undefined,
            shaaZmanis: number | undefined,
            shaaZmanisMga: number | undefined;
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
        } else {
            const suntimes = Zmanim.getSunTimes(date, location, true);
            sunrise = suntimes.sunrise;
            sunset = suntimes.sunset;
            suntimesMishor = Zmanim.getSunTimes(date, location, false);
            sunriseMishor = suntimesMishor.sunrise;
            sunsetMishor = suntimesMishor.sunset;
            mishorNeg90 = Utils.addMinutes(sunriseMishor, -90);
            chatzos =
                sunriseMishor &&
                sunsetMishor &&
                Zmanim.getChatzosFromSuntimes(suntimesMishor);
            shaaZmanis =
                sunriseMishor &&
                sunsetMishor &&
                Zmanim.getShaaZmanisFromSunTimes(suntimesMishor);
            shaaZmanisMga =
                sunriseMishor &&
                sunsetMishor &&
                Zmanim.getShaaZmanisMga(suntimesMishor, true);

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
                case ZmanTypeIds.ChatzosLayla: // chatzosNight
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(chatzos, 720 + offset),
                    });
                    break;
                case ZmanTypeIds.Alos90: // alos90
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(mishorNeg90, offset)
                            : mishorNeg90,
                    });
                    break;
                case ZmanTypeIds.Alos72: // alos72
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, -72 + offset),
                    });
                    break;
                case ZmanTypeIds.TalisTefillin: //talisTefillin
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunriseMishor, -36 + offset),
                    });
                    break;
                case ZmanTypeIds.NetzAtElevation: //netzElevation
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(sunrise, offset)
                            : sunrise,
                    });
                    break;
                case ZmanTypeIds.NetzMishor: // netzMishor:
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(sunriseMishor, offset)
                            : sunriseMishor,
                    });
                    break;
                case ZmanTypeIds.szksMga: //szksMga
                    if (shaaZmanisMga)
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                mishorNeg90,
                                Math.floor(shaaZmanisMga * 3) + offset,
                            ),
                        });
                    break;
                case ZmanTypeIds.szksGra: //szksGra
                    if (shaaZmanis)
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                sunriseMishor,
                                Math.floor(shaaZmanis * 3) + offset,
                            ),
                        });
                    break;
                case ZmanTypeIds.sztMga: // sztMga
                    if (shaaZmanisMga)
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                mishorNeg90,
                                Math.floor(shaaZmanisMga * 4) + offset,
                            ),
                        });
                    break;
                case ZmanTypeIds.sztGra: //sztGra
                    if (shaaZmanis)
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                sunriseMishor,
                                Math.floor(shaaZmanis * 4) + offset,
                            ),
                        });
                    break;
                case ZmanTypeIds.chatzosDay: //chatzos
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(chatzos, offset)
                            : chatzos,
                    });
                    break;
                case ZmanTypeIds.minGed: //minGed
                    if (shaaZmanis)
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                chatzos,
                                shaaZmanis * 0.5 + offset,
                            ),
                        });
                    break;
                case ZmanTypeIds.minKet: //minKet
                    if (shaaZmanis)
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                sunriseMishor,
                                shaaZmanis * 9.5 + offset,
                            ),
                        });
                    break;
                case ZmanTypeIds.plag: //plag
                    if (shaaZmanis)
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                sunriseMishor,
                                shaaZmanis * 10.75 + offset,
                            ),
                        });
                    break;
                case ZmanTypeIds.shkiaAtSeaLevel: //shkiaMishor
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(sunsetMishor, offset)
                            : sunsetMishor,
                    });
                    break;
                case ZmanTypeIds.shkiaElevation: //shkiaElevation
                    zmanTimes.push({
                        zmanType,
                        time: offset
                            ? Utils.addMinutes(sunset, offset)
                            : sunset,
                    });
                    break;
                case ZmanTypeIds.tzais45: // tzais45
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 45 + offset),
                    });
                    break;
                case ZmanTypeIds.tzais50: //tzais50
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 50 + offset),
                    });
                    break;
                case ZmanTypeIds.tzais72: //tzais72
                    zmanTimes.push({
                        zmanType,
                        time: Utils.addMinutes(sunset, 72 + offset),
                    });
                    break;
                case ZmanTypeIds.rabbeinuTamZmanios: //tzais72Zmaniot
                    if (shaaZmanis)
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                sunset,
                                shaaZmanis * 1.2 + offset,
                            ),
                        });
                    break;
                case ZmanTypeIds.rabbeinuTamZmaniosMga: //tzais72ZmaniotMA
                    if (shaaZmanisMga)
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                sunset,
                                shaaZmanisMga * 1.2 + offset,
                            ),
                        });
                    break;
                case ZmanTypeIds.candleLighting: //candleLighting
                    if (sunset && jdate.hasCandleLighting()) {
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                Zmanim.getCandleLightingFromSunset(
                                    sunset,
                                    location,
                                ),
                                offset,
                            ),
                        });
                    }
                    break;
                case ZmanTypeIds.SofZmanEatingChometz: //Sof Zman Achilas Chometz
                    if (shaaZmanisMga && jdate.Month === 1 &&
                        jdate.Day === 14 &&
                        Utils.isTimeAfter(sunrise, Utils.timeFromDate(date))) {
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                sunrise,
                                -90 + offset + shaaZmanisMga * 4,
                            ),
                        });
                    }
                    break;
                case ZmanTypeIds.SofZmanBurnChometz: //Sof Zman Biur Chometz
                    if (shaaZmanisMga &&
                        jdate.Month === 1 &&
                        (jdate.Day === 14 ||
                            (jdate.DayOfWeek === DaysOfWeek.FRIDAY &&
                                jdate.Day === 13)) &&
                        Utils.isTimeAfter(sunrise, Utils.timeFromDate(date))
                    ) {
                        zmanTimes.push({
                            zmanType,
                            time: Utils.addMinutes(
                                sunrise,
                                -90 + offset + shaaZmanisMga * 5,
                            ),
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
    static getWhichDays(date: Date, jdate: jDate, location: Location) {
        if (jdate.isYomTov(!!location.Israel)) {
            return WhichDaysFlags.YOMTOV;
        }
        switch (date.getDay()) {
            case DaysOfWeek.SUNDAY:
                return WhichDaysFlags.SUNDAY;
            case DaysOfWeek.MONDAY:
                return WhichDaysFlags.MONDAY;
            case DaysOfWeek.TUESDAY:
                return WhichDaysFlags.TUESDAY;
            case DaysOfWeek.WEDNESDAY:
                return WhichDaysFlags.WEDNESDAY;
            case DaysOfWeek.THURSDAY:
                return WhichDaysFlags.THURSDAY;
            case DaysOfWeek.FRIDAY:
                return WhichDaysFlags.FRIDAY;
            case DaysOfWeek.SHABBOS:
                return WhichDaysFlags.SHABBOS;
        }
        return 0;
    }

    /**
     * Returns the zmanim necessary for showing basic shul notifications: chatzosHayom, chatzosHalayla, alos
     * @param {jDate} jdate
     * @param {Date} sdate
     * @param {Location} location
     * @returns {{chatzosHayom:Time, chatzosHalayla:Time, alos:Time, shkia:Time }}
     */
    static getBasicShulZmanim(jdate: jDate, sdate: Date, location: Location) {
        const zmanim = AppUtils.getZmanTimes(
            [
                getZmanType(ZmanTypeIds.chatzosDay) as ZmanToShow, //Chatzos hayom
                getZmanType(ZmanTypeIds.Alos90) as ZmanToShow, //alos90
                getZmanType(ZmanTypeIds.shkiaElevation) as ZmanToShow, //shkiaElevation,
                getZmanType(ZmanTypeIds.candleLighting) as ZmanToShow, //candleLighting,
            ],
            sdate,
            jdate,
            location,
        );
        return {
            chatzosHayom: zmanim[0].time,
            chatzosHalayla: Utils.addMinutes(zmanim[0].time, 720),
            alos: zmanim[1].time,
            shkia: zmanim[2].time,
        };
    }

    /**
    * Returns all the zmanim for the given day    
    * @param {Date|jDate} date
    * @param {Location} location
    * @returns {{zmanType:ZmanToShow, time?:Time }[]}
    */
    static getAllZmanim(date: jDate | Date, location: Location) {
        const jd = date instanceof Date
            ? new jDate(date as Date)
            : date as jDate;
        return AppUtils.getZmanTimes(ZmanTypes, jd.getDate(), jd, location,);
    }

    /**
     * Compares two zmanim for showing to see if they are the same
     * @param {{id:number,offset:?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }} zman1
     * @param {{id:number,offset:?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }} zman2
     */
    static IsSameZmanToShow(zman1: ZmanToShow, zman2: ZmanToShow) {
        return (
            zman1.id === zman2.id &&
            zman1.desc === zman2.desc &&
            zman1.eng === zman2.eng &&
            zman1.heb === zman2.heb &&
            (zman1.offset || 0) === (zman2.offset || 0) &&
            (zman1.whichDaysFlags || 0) === (zman2.whichDaysFlags || 0)
        );
    }

    /**
     * Returns all available ZmanTypes - including baseTypes and custom added types
     * @param {Settings} settings
     */
    static AllZmanTypes(settings: Settings) {
        return [...ZmanTypes]/*.concat(settings.customZmanim)*/;
    }
}
