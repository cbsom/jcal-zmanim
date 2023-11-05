import Utils from './Utils.js';
import jDate from './jDate.js';

'use strict';
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
    static masechtaList = [
        { eng: 'Berachos', heb: 'ברכות', daf: 64 },
        { eng: 'Shabbos', heb: 'שבת', daf: 157 },
        { eng: 'Eruvin', heb: 'ערובין', daf: 105 },
        { eng: 'Pesachim', heb: 'פסחים', daf: 121 },
        { eng: 'Shekalim', heb: 'שקלים', daf: 22 },
        { eng: 'Yoma', heb: 'יומא', daf: 88 },
        { eng: 'Sukkah', heb: 'סוכה', daf: 56 },
        { eng: 'Beitzah', heb: 'ביצה', daf: 40 },
        { eng: 'Rosh Hashana', heb: 'ראש השנה', daf: 35 },
        { eng: 'Taanis', heb: 'תענית', daf: 31 },
        { eng: 'Megillah', heb: 'מגילה', daf: 32 },
        { eng: 'Moed Katan', heb: 'מועד קטן', daf: 29 },
        { eng: 'Chagigah', heb: 'חגיגה', daf: 27 },
        { eng: 'Yevamos', heb: 'יבמות', daf: 122 },
        { eng: 'Kesubos', heb: 'כתובות', daf: 112 },
        { eng: 'Nedarim', heb: 'נדרים', daf: 91 },
        { eng: 'Nazir', heb: 'נזיר', daf: 66 },
        { eng: 'Sotah', heb: 'סוטה', daf: 49 },
        { eng: 'Gitin', heb: 'גיטין', daf: 90 },
        { eng: 'Kiddushin', heb: 'קדושין', daf: 82 },
        { eng: 'Baba Kamma', heb: 'בבא קמא', daf: 119 },
        { eng: 'Baba Metzia', heb: 'בבא מציעא', daf: 119 },
        { eng: 'Baba Basra', heb: 'בבא בתרא', daf: 176 },
        { eng: 'Sanhedrin', heb: 'סנהדרין', daf: 113 },
        { eng: 'Makkot', heb: 'מכות', daf: 24 },
        { eng: 'Shevuot', heb: 'שבועות', daf: 49 },
        { eng: 'Avodah Zarah', heb: 'עבודה זרה', daf: 76 },
        { eng: 'Horayot', heb: 'הוריות', daf: 14 },
        { eng: 'Zevachim', heb: 'זבחים', daf: 120 },
        { eng: 'Menachos', heb: 'מנחות', daf: 110 },
        { eng: 'Chullin', heb: 'חולין', daf: 142 },
        { eng: 'Bechoros', heb: 'בכורות', daf: 61 },
        { eng: 'Arachin', heb: 'ערכין', daf: 34 },
        { eng: 'Temurah', heb: 'תמורה', daf: 34 },
        { eng: 'Kerisos', heb: 'כריתות', daf: 28 },
        { eng: 'Meilah', heb: 'מעילה', daf: 22 },
        { eng: 'Kinnim', heb: 'קנים', daf: 4 },
        { eng: 'Tamid', heb: 'תמיד', daf: 10 },
        { eng: 'Midos', heb: 'מדות', daf: 4 },
        { eng: 'Niddah', heb: 'נדה', daf: 73 }];

    static getDaf(jdate) {
        const absoluteDate = jdate.Abs;
        let dafcnt = 40, cno, dno, osday, nsday, total, count, j, blatt;

        osday = jDate.absSd(new Date(1923, 8, 11));
        nsday = jDate.absSd(new Date(1975, 5, 24));

        /*  No cycle, new cycle, old cycle */
        if (absoluteDate < osday)
            return null; /* daf yomi hadn't started yet */
        if (absoluteDate >= nsday) {
            cno = 8 + Utils.toInt(((absoluteDate - nsday) / 2711));
            dno = (absoluteDate - nsday) % 2711;
        }
        else {
            cno = 1 + Utils.toInt((absoluteDate - osday) / 2702);
            dno = Utils.toInt((absoluteDate - osday) / 2702);
        }

        /* Find the daf taking note that the cycle changed slightly after cycle 7. */
        total = blatt = 0;
        count = -1;

        /* Fix Shekalim for old cycles */
        if (cno <= 7)
            Dafyomi.masechtaList[4].daf = 13;
        else
            Dafyomi.masechtaList[4].daf = 22;

        /* Find the daf */
        j = 0;
        while (j < dafcnt) {
            count++;
            total = total + Dafyomi.masechtaList[j].daf - 1;
            if (dno < total) {
                blatt = (Dafyomi.masechtaList[j].daf + 1) - (total - dno);
                /* fiddle with the weird ones near the end */
                switch (count) {
                    case 36:
                        blatt = blatt + 21;
                        break;
                    case 37:
                        blatt = blatt + 24;
                        break;
                    case 38:
                        blatt = blatt + 33;
                        break;
                    default:
                        break;
                }
                /* Bailout */
                j = 1 + dafcnt;
            }
            j++;
        }

        return {
            masechet: Dafyomi.masechtaList[count],
            daf: blatt
        };
    }

    // Returns the name of the Masechta and daf number in English, For example: Sukkah, Daf 3
    static toString(jd) {
        const d = Dafyomi.getDaf(jd);
        return d.masechet.eng + ', Daf ' + d.daf.toString();
    }

    //Returns the name of the Masechta and daf number in Hebrew. For example: 'סוכה דף כ.
    static toStringHeb(jd) {
        const d = Dafyomi.getDaf(jd);
        return d.masechet.heb + ' דף ' + Utils.toJNum(d.daf);
    }
}