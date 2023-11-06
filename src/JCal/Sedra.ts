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
    sedras: { eng: string, heb: string}[];
    /**
     * @param {jDate} jd
     * @param {boolean} israel
     */
    constructor(jd:jDate, israel:boolean) {
        //If we are between the first day of Sukkos and Simchas Torah, the sedra will always be Vezos Habracha.
        if (jd.Month === 7 && jd.Day >= 15 && jd.Day < (israel ? 23 : 24)) {
            this.sedras = [Sedra.sedraList[53]];
            return;
        }

        let sedraArray:{ eng: string, heb: string}[] = [],
            sedraOrder = Sedra.getSedraOrder(jd.Year, israel),
            absDate = jd.Abs,
            index:number,
            weekNum:number;

        /* find the first saturday on or after today's date */
        absDate = Sedra.getDayOnOrBefore(6, absDate + 6);

        weekNum = (absDate - sedraOrder.firstSatInYear) / 7;

        if (sedraOrder.sedraArray && weekNum >= sedraOrder.sedraArray.length) {
            const indexLast = sedraOrder.sedraArray[sedraOrder.sedraArray.length - 1];
            if (indexLast < 0) {
                /* advance 2 parashiyot ahead after a doubled week */
                index = (-indexLast) + 2;
            }
            else {
                index = indexLast + 1;
            }
        }
        else {
            index = (sedraOrder.sedraArray
                ?sedraOrder.sedraArray[weekNum]
                :-1);
        }

        if (index >= 0) {
            sedraArray = [Sedra.sedraList[index]];
        }
        else {
            const i = -index;      /* undouble the sedra */
            sedraArray = [Sedra.sedraList[i], Sedra.sedraList[i + 1]];
        }
        this.sedras = sedraArray;
    }

    /**
     * Gets the sedra/s as a string. If there are two, they are seperated by a " - "
     */
    toString() {
        return this.sedras.map(s => s.eng).join(' - ');
    }

    /**
     * Gets the sedra/s as a string. If there are two, they are seperated by a " - "
     */
    toStringHeb() {
        return this.sedras.map(s => s.heb).join(' - ');
    }

    static lastCalculatedYear:{firstSatInYear:number,sedraArray?: number[],year: number,israel: boolean}|null = null;
    static sedraList = [{ eng: 'Bereshis', heb: 'בראשית' }, { eng: 'Noach', heb: 'נח' }, { eng: 'Lech-Lecha', heb: 'לך לך' }, { eng: 'Vayera', heb: 'וירא' }, { eng: 'Chayei Sara', heb: 'חיי שרה' }, { eng: 'Toldos', heb: 'תולדות' }, { eng: 'Vayetzei', heb: 'ויצא' }, { eng: 'Vayishlach', heb: 'וישלח' }, { eng: 'Vayeishev', heb: 'וישב' }, { eng: 'Mikeitz', heb: 'מקץ' }, { eng: 'Vayigash', heb: 'ויגש' }, { eng: 'Vayechi', heb: 'ויחי' }, { eng: 'Shemos', heb: 'שמות' }, { eng: 'Va\'era', heb: 'וארא' }, { eng: 'Bo', heb: 'בא' }, { eng: 'Beshalach', heb: 'בשלח' }, { eng: 'Yisro', heb: 'יתרו' }, { eng: 'Mishpatim', heb: 'משפטים' }, { eng: 'Terumah', heb: 'תרומה' }, { eng: 'Tetzaveh', heb: 'תצוה' }, { eng: 'Ki Sisa', heb: 'כי תשא' }, { eng: 'Vayakhel', heb: 'ויקהל' }, { eng: 'Pekudei', heb: 'פקודי' }, { eng: 'Vayikra', heb: 'ויקרא' }, { eng: 'Tzav', heb: 'צו' }, { eng: 'Shmini', heb: 'שמיני' }, { eng: 'Tazria', heb: 'תזריע' }, { eng: 'Metzora', heb: 'מצורע' }, { eng: 'Achrei Mos', heb: 'אחרי מות' }, { eng: 'Kedoshim', heb: 'קדושים' }, { eng: 'Emor', heb: 'אמור' }, { eng: 'Behar', heb: 'בהר' }, { eng: 'Bechukosai', heb: 'בחקותי' }, { eng: 'Bamidbar', heb: 'במדבר' }, { eng: 'Nasso', heb: 'נשא' }, { eng: 'Beha\'aloscha', heb: 'בהעלתך' }, { eng: 'Sh\'lach', heb: 'שלח' }, { eng: 'Korach', heb: 'קרח' }, { eng: 'Chukas', heb: 'חקת' }, { eng: 'Balak', heb: 'בלק' }, { eng: 'Pinchas', heb: 'פינחס' }, { eng: 'Matos', heb: 'מטות' }, { eng: 'Masei', heb: 'מסעי' }, { eng: 'Devarim', heb: 'דברים' }, { eng: 'Va\'eschanan', heb: 'ואתחנן' }, { eng: 'Eikev', heb: 'עקב' }, { eng: 'Re\'eh', heb: 'ראה' }, { eng: 'Shoftim', heb: 'שופטים' }, { eng: 'Ki Seitzei', heb: 'כי תצא' }, { eng: 'Ki Savo', heb: 'כי תבא' }, { eng: 'Nitzavim', heb: 'נצבים' }, { eng: 'Vayeilech', heb: 'וילך' }, { eng: 'Ha\'Azinu', heb: 'האזינו' }, { eng: 'Vezos Habracha', heb: 'וזאת הברכה' }];
    static shabbos_short = [52, 52, 53, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, -21, 23, 24, 25, 25, -26, -28, 30, -31, 33, 34, 35, 36, 37, 38, 39, 40, -41, 43, 44, 45, 46, 47, 48, 49, 50];
    static shabbos_long = [52, 52, 53, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, -21, 23, 24, 25, 25, -26, -28, 30, -31, 33, 34, 35, 36, 37, 38, 39, 40, -41, 43, 44, 45, 46, 47, 48, 49, -50];
    static mon_short = [51, 52, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, -21, 23, 24, 25, 25, -26, -28, 30, -31, 33, 34, 35, 36, 37, 38, 39, 40, -41, 43, 44, 45, 46, 47, 48, 49, -50];
    static mon_long = [51, 52, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, -21, 23, 24, 25, 25, -26, -28, 30, -31, 33, 34, 34, 35, 36, 37, -38, 40, -41, 43, 44, 45, 46, 47, 48, 49, -50];
    static thu_normal = [52, 53, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, -21, 23, 24, 25, 25, 25, -26, -28, 30, -31, 33, 34, 35, 36, 37, 38, 39, 40, -41, 43, 44, 45, 46, 47, 48, 49, 50];
    static thu_normal_Israel = [52, 53, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, -21, 23, 24, 25, 25, -26, -28, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, -41, 43, 44, 45, 46, 47, 48, 49, 50];
    static thu_long = [52, 53, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 25, -26, -28, 30, -31, 33, 34, 35, 36, 37, 38, 39, 40, -41, 43, 44, 45, 46, 47, 48, 49, 50];
    static shabbos_short_leap = [52, 52, 53, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, -41, 43, 44, 45, 46, 47, 48, 49, -50];
    static shabbos_long_leap = [52, 52, 53, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 28, 29, 30, 31, 32, 33, 34, 34, 35, 36, 37, -38, 40, -41, 43, 44, 45, 46, 47, 48, 49, -50];
    static mon_short_leap = [51, 52, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 28, 29, 30, 31, 32, 33, 34, 34, 35, 36, 37, -38, 40, -41, 43, 44, 45, 46, 47, 48, 49, -50];
    static mon_short_leap_Israel = [51, 52, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, -41, 43, 44, 45, 46, 47, 48, 49, -50];
    static mon_long_leap = [51, 52, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 28, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, -41, 43, 44, 45, 46, 47, 48, 49, 50];
    static mon_long_leap_Israel = [51, 52, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
    static thu_short_leap = [52, 53, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
    static thu_long_leap = [52, 53, 53, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, -50];

    static getDayOnOrBefore(day_of_week:number, date:number) {
        return date - ((date - day_of_week) % 7);
    }

    static getSedraOrder(year:number, israel:boolean) {
        //If the last call is within the same year as this one, we reuse the data.
        //If memory is an issue, remove these next few lines
        if (Sedra.lastCalculatedYear != null &&
            Sedra.lastCalculatedYear.year === year &&
            Sedra.lastCalculatedYear.israel === israel) {
            return Sedra.lastCalculatedYear;
        }

        const longCheshvon = jDate.isLongCheshvan(year),
            shortKislev = jDate.isShortKislev(year),
            roshHashana = jDate.absJd(year, 7, 1),
            roshHashanaDOW = Math.abs(roshHashana % 7),
            firstSatInYear = Sedra.getDayOnOrBefore(6, roshHashana + 6);
        let yearType,
            sArray;

        if (longCheshvon && !shortKislev)
            yearType = 'complete';
        else if (!longCheshvon && shortKislev)
            yearType = 'incomplete';
        else
            yearType = 'regular';

        if (!jDate.isJdLeapY(year)) {
            switch (roshHashanaDOW) {
                case 6:
                    if (yearType === 'incomplete') {
                        sArray = Sedra.shabbos_short;
                    }
                    else if (yearType === 'complete') {
                        sArray = Sedra.shabbos_long;
                    }
                    break;

                case 1:
                    if (yearType === 'incomplete') {
                        sArray = Sedra.mon_short;
                    }
                    else if (yearType === 'complete') {
                        sArray = israel ? Sedra.mon_short : Sedra.mon_long;
                    }
                    break;

                case 2:
                    if (yearType === 'regular') {
                        sArray = israel ? Sedra.mon_short : Sedra.mon_long;
                    }
                    break;

                case 4:
                    if (yearType === 'regular') {
                        sArray = israel ? Sedra.thu_normal_Israel : Sedra.thu_normal;
                    }
                    else if (yearType === 'complete') {
                        sArray = Sedra.thu_long;
                    }
                    break;

                default:
                    throw 'improper sedra year type calculated.';
            }
        }
        else  /* leap year */ {
            switch (roshHashanaDOW) {
                case 6:
                    if (yearType === 'incomplete') {
                        sArray = Sedra.shabbos_short_leap;
                    }
                    else if (yearType === 'complete') {
                        sArray = israel ? Sedra.shabbos_short_leap : Sedra.shabbos_long_leap;
                    }
                    break;

                case 1:
                    if (yearType === 'incomplete') {
                        sArray = israel ? Sedra.mon_short_leap_Israel : Sedra.mon_short_leap;
                    }
                    else if (yearType === 'complete') {
                        sArray = israel ? Sedra.mon_long_leap_Israel : Sedra.mon_long_leap;
                    }
                    break;

                case 2:
                    if (yearType === 'regular') {
                        sArray = israel ? Sedra.mon_long_leap_Israel : Sedra.mon_long_leap;
                    }
                    break;

                case 4:
                    if (yearType === 'incomplete') {
                        sArray = Sedra.thu_short_leap;
                    }
                    else if (yearType === 'complete') {
                        sArray = Sedra.thu_long_leap;
                    }
                    break;

                default:
                    throw 'improper sedra year type calculated.';
            }
        }

        const retobj = {
            firstSatInYear: firstSatInYear,
            sedraArray: sArray,
            year: year,
            israel: israel
        };

        //Save the data in case the next call is for the same year
        Sedra.lastCalculatedYear = retobj;

        return retobj;
    }
}