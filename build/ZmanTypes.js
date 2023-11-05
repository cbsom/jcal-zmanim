"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZmanType = exports.ZmanTypes = exports.ZmanTypeIds = void 0;
exports.ZmanTypeIds = Object.freeze({
    ChatzosLayla: 0,
    Alos90: 1,
    Alos72: 2,
    TalisTefillin: 3,
    NetzAtElevation: 4,
    NetzMishor: 5,
    szksMga: 6,
    szksGra: 7,
    sztMga: 8,
    sztGra: 9,
    chatzosDay: 10,
    minGed: 11,
    minKet: 12,
    plag: 13,
    shkiaAtSeaLevel: 14,
    shkiaElevation: 15,
    tzais45: 16,
    tzais50: 17,
    tzais72: 18,
    rabbeinuTamZmanios: 19,
    rabbeinuTamZmaniosMga: 20,
    candleLighting: 21,
    SofZmanEatingChometz: 22,
    SofZmanBurnChometz: 23,
});
exports.ZmanTypes = [
    {
        id: exports.ZmanTypeIds.ChatzosLayla,
        desc: 'חצות הלילה',
        eng: 'Chatzos - Midnight',
        heb: 'חצות הלילה',
    },
    {
        id: exports.ZmanTypeIds.Alos90,
        desc: 'עלות השחר - 90 דקות',
        eng: 'Alos Hashachar - 90',
        heb: 'עלות השחר (90)',
    },
    {
        id: exports.ZmanTypeIds.Alos72,
        desc: 'עלות השחר - 72 דקות',
        eng: 'Alos Hashachar - 72',
        heb: 'עלות השחר (72)',
    },
    {
        id: exports.ZmanTypeIds.TalisTefillin,
        desc: 'זמן עטיפת טלית ותפילין - 36 דקות',
        eng: 'Taliss and Tefillin',
        heb: 'טלית ותפילין',
    },
    {
        id: exports.ZmanTypeIds.NetzAtElevation,
        desc: 'הנץ החמה בגובה המיקום',
        eng: 'Sunrise at current elevation',
        heb: 'הנץ החמה - מגובה',
    },
    {
        id: exports.ZmanTypeIds.NetzMishor,
        desc: 'הנץ החמה בגובה פני הים',
        eng: 'Sunrise',
        heb: 'הנץ החמה',
    },
    {
        id: exports.ZmanTypeIds.szksMga,
        desc: 'סזק"ש מג"א',
        eng: 'Zman Krias Shma - MG"A',
        heb: 'סזק"ש מג"א',
    },
    {
        id: exports.ZmanTypeIds.szksGra,
        desc: 'סזק"ש הגר"א',
        eng: 'Zman Krias Shma - GR"A',
        heb: 'סזק"ש הגר"א',
    },
    {
        id: exports.ZmanTypeIds.sztMga,
        desc: 'סז"ת מג"א',
        eng: 'Zman Tefilla - MG"A',
        heb: 'סז"ת מג"א',
    },
    {
        id: exports.ZmanTypeIds.sztGra,
        desc: 'סז"ת הגר"א',
        eng: 'Zman Tefilla - GR"A',
        heb: 'סז"ת הגר"א',
    },
    {
        id: exports.ZmanTypeIds.chatzosDay,
        desc: 'חצות היום',
        eng: 'Chatzos - Midday',
        heb: 'חצות היום',
    },
    {
        id: exports.ZmanTypeIds.minGed,
        desc: 'מנחה גדולה',
        eng: 'Mincha Gedola',
        heb: 'מנחה גדולה',
    },
    {
        id: exports.ZmanTypeIds.minKet,
        desc: 'מנחה קטנה',
        eng: 'Mincha Ketana',
        heb: 'מנחה קטנה',
    },
    {
        id: exports.ZmanTypeIds.plag,
        desc: 'פלג המנחה',
        eng: 'Plag HaMincha',
        heb: 'פלג המנחה',
    },
    {
        id: exports.ZmanTypeIds.shkiaAtSeaLevel,
        desc: 'שקיעת החמה מגובה פני הים',
        eng: 'Sunset at sea level',
        heb: 'שקיעת החמה - ממישור',
    },
    {
        id: exports.ZmanTypeIds.shkiaElevation,
        desc: 'שקיעת החמה מגובה המיקום',
        eng: 'Sunset',
        heb: 'שקיעת החמה',
    },
    {
        id: exports.ZmanTypeIds.tzais45,
        desc: '45 דקות אחרי שקיעה',
        eng: 'Nightfall - 45',
        heb: 'צאת הכוכבים (45)',
    },
    {
        id: exports.ZmanTypeIds.tzais50,
        desc: '50 דקות אחרי שקיעה',
        eng: 'Nightfall - 50',
        heb: 'צאת הכוכבים (50)',
    },
    {
        id: exports.ZmanTypeIds.tzais72,
        desc: '72 דקות אחרי שקיעה',
        eng: 'Rabbeinu Tam',
        heb: 'צה"כ ר"ת - 72 דקות',
    },
    {
        id: exports.ZmanTypeIds.rabbeinuTamZmanios,
        desc: '72 דקות זמניות אחרי שקיעה',
        eng: 'Rabbeinu Tam - Zmanios',
        heb: 'צה"כ ר"ת - זמניות',
    },
    {
        id: exports.ZmanTypeIds.rabbeinuTamZmaniosMga,
        desc: '72 דקות זמניות אחרי שקיעה - מג"א',
        eng: 'Rabbeinu Tam - Zmanios MG"A',
        heb: 'צה"כ ר"ת - זמניות מג"א',
    },
    {
        id: exports.ZmanTypeIds.candleLighting,
        desc: 'זמן הדלקת נרות',
        eng: 'Candle lighting time',
        heb: 'זמן הדלקת נרות',
    },
    {
        id: exports.ZmanTypeIds.SofZmanEatingChometz,
        desc: 'סוף זמן אכילת חמץ',
        eng: 'Stop eating Chometz',
        heb: 'סוף זמן אכילת חמץ',
    },
    {
        id: exports.ZmanTypeIds.SofZmanBurnChometz,
        desc: 'סוף זמן ביעור חמץ',
        eng: 'Destroy Chometz',
        heb: 'סוף זמן ביעור חמץ',
    },
];
/**
 * Get the ZmanType with the given id or name.
 * @param {Number} id
 * @returns {{id:number, desc: String, eng: String, heb: String }}
 */
function getZmanType(id) {
    return exports.ZmanTypes.find(zt => zt.id === id);
}
exports.getZmanType = getZmanType;
