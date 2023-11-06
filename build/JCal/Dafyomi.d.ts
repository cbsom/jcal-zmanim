import jDate from './jDate.js';
/** *********************************************************************************************************
 * Computes the Day Yomi for the given day.
 * Sample of use - to get todays daf:
 *     const dafEng = Dafyomi.toString(new jDate(new Date()));
 *     const dafHeb = Dafyomi.toStringHeb(new jDate(new Date()));
 * The code was converted to javascript and tweaked by CBS.
 * It is directly based on the C code in Danny Sadinoff's HebCal - Copyright (C) 1994.
 * The HebCal code for dafyomi was adapted by Aaron Peromsik from Bob Newell's public domain daf.el.
***********************************************************************************************************/
export default class Dafyomi {
    static masechtaList: {
        eng: string;
        heb: string;
        daf: number;
    }[];
    static getDaf(jdate: jDate): {
        masechet: {
            eng: string;
            heb: string;
            daf: number;
        };
        daf: number;
    } | null;
    static toString(jd: jDate): string | undefined;
    static toStringHeb(jd: jDate): string | undefined;
}
