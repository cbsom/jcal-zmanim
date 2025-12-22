
import { Utils } from '../Utils.js';
import jDate from './jDate.js';
import Location from './Location.js';
import { SunTimes, Time } from '../jcal-zmanim.js';

/**
 * Computes the daily Zmanim for any single date at any location.
 * The astronomical and mathematical calculations were directly adapted from the excellent
 * Jewish calendar calculation in C# Copyright © by Ulrich and Ziporah Greve (2005)
 */
export default class Zmanim {
    private static _sunTimesCache = new Map<string, SunTimes>();
    /**
     * Gets sunrise and sunset time for given date and Location.
     * Accepts a javascript Date object, a string for creating a javascript date object or a jDate object.
     * Location object is required.
     * @returns {SunTimes}
     * @param {Date | jDate} date A Javascript Date or Jewish Date for which to calculate the sun times.
     * @param {Location} location Where on the globe to calculate the sun times for.
     * @param {Boolean} considerElevation
     */
    static getSunTimes(date: Date | jDate | string, location: Location, considerElevation = true): SunTimes {
        let absDate: number;
        if (date instanceof jDate) {
            absDate = date.Abs;
            date = date.getDate();
        } else {
            if (typeof date === 'string' || date instanceof String) {
                date = new Date(date as string);
            }
            if (!Utils.isValidDate(date)) {
                throw 'Zmanim.getSunTimes: supplied date parameter cannot be converted to a Date';
            }
            absDate = jDate.absSd(date as Date);
        }

        const cacheKey = `${absDate}|${location.Name}|${location.Latitude}|${location.Longitude}|${location.Elevation}|${considerElevation}`;
        if (Zmanim._sunTimesCache.has(cacheKey)) {
            return Zmanim._sunTimesCache.get(cacheKey)!;
        }

        let sunrise, sunset,
            zenithDeg = 90, zenithMin = 50, lonHour = 0, longitude = 0, latitude = 0,
            cosLat = 0, sinLat = 0, cosZen = 0, sinDec = 0, cosDec = 0,
            xmRise = 0, xmSet = 0, xlRise = 0, xlSet = 0, aRise = 0, aSet = 0, ahrRise = 0, ahrSet = 0,
            hRise = 0, hSet = 0, tRise = 0, tSet = 0, utRise = 0, utSet = 0;

        const day = Zmanim.dayOfYear(date),
            earthRadius = 6356900,
            zenithAtElevation = Zmanim.degToDec(zenithDeg, zenithMin) +
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

        if (!sunrise || !sunset) {
            const formattedDate = typeof (date as any).toDateString === 'function' ? (date as Date).toDateString() : date.toString();
            throw new Error(`Zmanim Calculation Error: The sun does not rise or set at location "${location.Name}" (Lat: ${location.Latitude}) on ${formattedDate}. The location may be in a Polar region (Polar Night/Day).`);
        }

        const result = { sunrise: sunrise, sunset: sunset };
        Zmanim._sunTimesCache.set(cacheKey, result);
        if (Zmanim._sunTimesCache.size > 2000) Zmanim._sunTimesCache.clear();
        return result;
    }

    /**
     * @param {jDate | Date} date
     * @param {Location} location
     */
    static getChatzos(date: jDate | Date, location: Location) {
        return Zmanim.getChatzosFromSuntimes(
            Zmanim.getSunTimes(date, location, false));
    }

    /**
     * @param {SunTimes} sunTimes
     */
    static getChatzosFromSuntimes(sunTimes: SunTimes): Time {
        const rise = sunTimes.sunrise,
            set = sunTimes.sunset;

        if (rise === undefined || isNaN(rise.hour) || set === undefined || isNaN(set.hour)) {
            return { hour: NaN, minute: NaN };
        }
        const chatz = Utils.toInt((Utils.totalSeconds(set) - Utils.totalSeconds(rise)) / 2);
        return Utils.addSeconds(rise, chatz);
    }

    /**
     * @param {jDate | Date} date
     * @param {Location} location
     * @param {any} offset
     */
    static getShaaZmanis(date: jDate | Date, location: Location, offset: number): number {
        return Zmanim.getShaaZmanisFromSunTimes(
            Zmanim.getSunTimes(date, location, false),
            offset);
    }

    /**
     * @param {{ sunrise: any; sunset: any; }} sunTimes
     * @param {number} [offset]
     */
    static getShaaZmanisFromSunTimes(sunTimes: SunTimes, offset?: number): number {
        if (!sunTimes || !sunTimes.sunrise || !sunTimes.sunset) {
            return 0;
        }
        let rise = sunTimes.sunrise,
            set = sunTimes.sunset;

        if (!rise || isNaN(rise.hour) || !set || isNaN(set.hour)) {
            return NaN;
        }

        if (offset) {
            rise = Utils.addMinutes(rise, -offset) as Time;
            set = Utils.addMinutes(set, offset) as Time;
        }

        return (Utils.totalSeconds(set) - Utils.totalSeconds(rise)) / 720;
    }

    /**
     * @param {{ sunrise: any; sunset: any; }} sunTimes
     * @param {boolean} israel
     */
    static getShaaZmanisMga(sunTimes: SunTimes, israel: boolean) {
        const minutes = israel ? 90 : 72;
        let rise = sunTimes.sunrise && Utils.addMinutes(sunTimes.sunrise, -minutes),
            set = sunTimes.sunset && Utils.addMinutes(sunTimes.sunset, minutes);

        if (!rise || isNaN(rise.hour) || !set || isNaN(set.hour)) {
            return NaN;
        }

        return (Utils.totalSeconds(set) - Utils.totalSeconds(rise)) / 720;
    }

    /**
     * @param {jDate | Date} date
     * @param {Location} location
     */
    static getCandleLighting(date: Date | jDate, location: Location) {
        return Zmanim.getCandleLightingFromSunTimes(
            Zmanim.getSunTimes(date, location),
            location);
    }

    /**
     * @param {SunTimes} sunTimes
     * @param {any} location
     */
    static getCandleLightingFromSunTimes(sunTimes: SunTimes, location: Location) {
        return sunTimes.sunset && Zmanim.getCandleLightingFromSunset(sunTimes.sunset, location);
    }


    /**
     * @param {Time} sunset
     * @param {Location} location
     */
    static getCandleLightingFromSunset(sunset: Time, location: Location) {
        return Utils.addMinutes(sunset, -(location.CandleLighting || 0));
    }

    /**
     * @param {Date} date
     */
    static dayOfYear(date: Date) {
        const month = date.getMonth(),
            isLeap = () => Utils.isSecularLeapYear(date.getFullYear()),
            yearDay = [0, 1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
        return yearDay[month + 1] + date.getDate() + ((month > 1 && isLeap()) ? 1 : 0);
    }

    /**
     * @param {number} deg
     * @param {number} min
     */
    static degToDec(deg: number, min: number) {
        return (deg + min / 60);
    }

    /**
     * @param {number} x
     */
    static M(x: number) {
        return (0.9856 * x - 3.251);
    }

    /**
     * @param {number} x
     */
    static L(x: number) {
        return (x + 1.916 * Math.sin(0.01745 * x) + 0.02 * Math.sin(2 * 0.01745 * x) + 282.565);
    }

    /**
     * @param {number} x
     */
    static adj(x: number) {
        return (-0.06571 * x - 6.62);
    }

    /**
     * @param {number} rad
     */
    static radToDeg(rad: number) {
        return 57.29578 * rad;
    }

    /**
     * @param {number} time
     * @param {Date} date
     * @param {Location} location
     */
    static timeAdj(time: number, date: Date, location: Location) {
        if (time < 0) {
            time += 24;
        }
        let hour = Utils.toInt(time);
        const minFloat = (time - hour) * 60 + 0.5,
            min = Utils.toInt(minFloat),
            sec = Math.round(60.0 * (minFloat - min));

        if (Utils.isDST(location, date)) {
            hour++;
        }

        return Utils.fixTime({ hour: hour, minute: min, second: sec });
    }
}