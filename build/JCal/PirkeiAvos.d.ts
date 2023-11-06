import jDate from './jDate.js';
/****************************************************************************************************************
 * Computes the Perek/Prakim of the week for the given Shabbos.
 * Returns an array of prakim (integers) (either one or two) for the given Jewish Date
 * Sample of use to get todays sedra in Israel:
 *     const prakim = PirkeiAvos.getPrakim(new jDate(), true);
 *     const str = 'Pirkei Avos: ' + prakim.map(s => `${Utils.toSuffixed(s)} Perek`).join(' and ');
 * ***************************************************************************************************************/
export default class PirkeiAvos {
    static getPrakim(jd: jDate, israel: boolean): number[];
    static _get1stPerek: (jd: jDate, israel: boolean) => number;
    static _ellul: (jd: jDate, israel: boolean) => number[];
}
