"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jDate_js_1 = __importDefault(require("./jDate.js"));
const Utils_1 = __importDefault(require("./Utils"));
'use strict';
/****************************************************************************************************************
 * Computes the Perek/Prakim of the week for the given Shabbos.
 * Returns an array of prakim (integers) (either one or two) for the given Jewish Date
 * Sample of use to get todays sedra in Israel:
 *     const prakim = PirkeiAvos.getPrakim(new jDate(), true);
 *     const str = 'Pirkei Avos: ' + prakim.map(s => `${Utils.toSuffixed(s)} Perek`).join(' and ');
 * ***************************************************************************************************************/
class PirkeiAvos {
    static getPrakim(jd, israel) {
        if (jd.getDayOfWeek() !== 6) {
            return [];
        }
        const jMonth = jd.Month, jDay = jd.Day;
        //Pirkei Avos is from after Pesach until Rosh Hashana
        if ((jMonth === 1 && jDay > (israel ? 21 : 22)) ||
            //All Shabbosim through Iyar, Sivan, Tamuz, Av - besides for the day/s of Shavuos and Tisha B'Av
            ((jMonth > 1 && jMonth < 6 &&
                (!((jMonth === 3 && jDay === 6) || (!israel && jMonth === 3 && jDay === 7))) &&
                (!(jMonth === 5 && jDay === 9))))) {
            return [PirkeiAvos._get1stPerek(jd, israel)];
        }
        //Ellul can have multiple prakim
        else if (jMonth === 6) {
            return PirkeiAvos._ellul(jd, israel);
        }
        //No Pirkei Avos
        else {
            return [];
        }
    }
}
PirkeiAvos._get1stPerek = function (jd, israel) {
    const jYear = jd.Year, jMonth = jd.Month, jDay = jd.Day, pes1 = new jDate_js_1.default(jYear, 1, 15), 
    //How many days after the first day of pesach was the first shabbos after pesach
    shb1 = (israel ? 7 : 8) + (6 - pes1.getDayOfWeek()), 
    //What number shabbos after pesach is the current date
    cShb = ((jMonth === 1 && jDay === (shb1 + 15)) ? 1 :
        Utils_1.default.toInt((jd.Abs - (pes1.Abs + shb1)) / 7) + 1);
    let prk = cShb % 6;
    if (prk === 0)
        prk = 6;
    //If the second day of Shavuos was on Shabbos, we missed a week.
    //The second day of Pesach is always the same day as the first day of Shavuos.
    //So if Pesach was on Thursday, Shavuos will be on Friday and Shabbos in Chu"l.
    //Pesach can never come out on Friday, so in E. Yisroel Shavuos is never on Shabbos.
    if ((!israel) && pes1.getDayOfWeek() === 4 && (jMonth > 3 || (jMonth === 3 && jDay > 6))) {
        prk = prk === 1 ? 6 : prk - 1;
    }
    //If Tisha B'Av was on Shabbos, we missed a week. The first day of Pesach is always the same day of the week as Tisha b'av.
    if (pes1.getDayOfWeek() === 6 && (jMonth > 5 || (jMonth === 5 && jDay > 9))) {
        prk = prk === 1 ? 6 : prk - 1;
    }
    return prk;
};
PirkeiAvos._ellul = function (jd, israel) {
    let prakim;
    const jYear = jd.Year, jDay = jd.Day, 
    //The fist day of Ellul.
    //The year/month/day/absoluteDay constructor for JDate is used for efficiency.
    day1 = new jDate_js_1.default(jYear, 6, 1, jd.Abs - jd.Day + 1), day1DOW = day1.getDayOfWeek(), shabbos1Day = day1DOW === 6 ? 1 : ((6 - (day1DOW + 6) % 6) + 1), shabbos1Date = new jDate_js_1.default(jYear, 6, shabbos1Day, day1.Abs + shabbos1Day - 1), 
    //Which shabbos in Ellul are we working out now?
    cShb = jDay === shabbos1Day ? 1 : Utils_1.default.toInt((jDay - shabbos1Day) / 7) + 1;
    switch (PirkeiAvos._get1stPerek(shabbos1Date, israel)) {
        case 1:
            switch (cShb) {
                case 1:
                    prakim = [1];
                    break;
                case 2:
                    prakim = [2];
                    break;
                case 3:
                    prakim = [3, 4];
                    break;
                case 4:
                    prakim = [5, 6];
                    break;
            }
            break;
        case 2:
            switch (cShb) {
                case 1:
                    prakim = [2];
                    break;
                case 2:
                    prakim = [3];
                    break;
                case 3:
                    prakim = [4];
                    break;
                case 4:
                    prakim = [5, 6];
                    break;
            }
            break;
        case 3:
            switch (cShb) {
                case 1:
                    prakim = [3];
                    break;
                case 2:
                    prakim = [4];
                    break;
                case 3:
                    prakim = [5];
                    break;
                case 4:
                    prakim = [6];
                    break;
            }
            break;
        case 4:
            //This can only happen in Chutz La'aretz
            switch (cShb) {
                case 1:
                    prakim = [4, 5];
                    break;
                case 2:
                    prakim = [6, 1];
                    break;
                case 3:
                    prakim = [2, 3];
                    break;
                case 4:
                    prakim = [4, 5, 6];
                    break;
            }
            break;
        case 5:
            switch (cShb) {
                case 1:
                    prakim = [5, 6];
                    break;
                case 2:
                    prakim = [1, 2];
                    break;
                case 3:
                    prakim = [3, 4];
                    break;
                case 4:
                    prakim = [5, 6];
                    break;
            }
            break;
        case 6:
            switch (cShb) {
                case 1:
                    prakim = [6];
                    break;
                case 2:
                    prakim = [1, 2];
                    break;
                case 3:
                    prakim = [3, 4];
                    break;
                case 4:
                    prakim = [5, 6];
                    break;
            }
            break;
    }
    return prakim || [];
};
exports.default = PirkeiAvos;
