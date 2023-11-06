import { ZmanToShow } from './jcal-zmanim';
export declare const ZmanTypeIds: Readonly<{
    ChatzosLayla: 0;
    Alos90: 1;
    Alos72: 2;
    TalisTefillin: 3;
    NetzAtElevation: 4;
    NetzMishor: 5;
    szksMga: 6;
    szksGra: 7;
    sztMga: 8;
    sztGra: 9;
    chatzosDay: 10;
    minGed: 11;
    minKet: 12;
    plag: 13;
    shkiaAtSeaLevel: 14;
    shkiaElevation: 15;
    tzais45: 16;
    tzais50: 17;
    tzais72: 18;
    rabbeinuTamZmanios: 19;
    rabbeinuTamZmaniosMga: 20;
    candleLighting: 21;
    SofZmanEatingChometz: 22;
    SofZmanBurnChometz: 23;
}>;
export declare const ZmanTypes: ZmanToShow[];
/**
 * Get the ZmanType with the given id or name.
 * @param {Number} id
 * @returns {{id:number, desc: String, eng: String, heb: String }}
 */
export declare function getZmanType(id: number): ZmanToShow | undefined;
