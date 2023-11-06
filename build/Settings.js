"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Locations_1 = require("./Locations");
const GeneralUtils_1 = require("./GeneralUtils");
const ZmanTypes_1 = require("./ZmanTypes");
class Settings {
    /**
     *
     * @param {[ZmanToShow]} [zmanimToShow] List of which zmanim to show
     * @param {Location} [location]
     * @param {boolean} [showNotifications] Show shul notifications?
     * @param {number} [numberOfItemsToShow] Number of zmanim to show on the main screen
     * @param {number} [minToShowPassedZman] Number of minutes to continue showing zmanim that have passed
     * @param {boolean} [showGaonShir] Show the Shir Shel Yom of the Gr"a?
     * @param {boolean} [showDafYomi] Show the Daf Yomi?
     * @param {boolean} [english] Show in English?
     */
    constructor(zmanimToShow, location, showNotifications, numberOfItemsToShow, minToShowPassedZman, showGaonShir, showDafYomi, english) {
        /**
         * @property {[ZmanToShow]} zmanimToShow List of which zmanim to show
         */
        this.zmanimToShow = (zmanimToShow || [
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.ChatzosLayla),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.Alos72),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.TalisTefillin),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.NetzMishor),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.szksMga),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.szksGra),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.sztMga),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.sztGra),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.chatzosDay),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.minGed),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.minKet),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.plag),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.shkiaElevation),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.tzais50),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.tzais72),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.candleLighting),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.SofZmanEatingChometz),
            (0, ZmanTypes_1.getZmanType)(ZmanTypes_1.ZmanTypeIds.SofZmanBurnChometz), //Sof Zman burn Chometz
        ]);
        /**
         * @property {Location} location
         */
        this.location = (location || (0, Locations_1.findLocation)('Lakewood NJ'));
        /**
         * @property {boolean} showNotifications Show shul notifications?
         */
        this.showNotifications = (0, GeneralUtils_1.setDefault)(showNotifications, true);
        /**
         * @property {number} numberOfItemsToShow Number of zmanim to show on the main screen
         */
        this.numberOfItemsToShow = (0, GeneralUtils_1.setDefault)(numberOfItemsToShow, 5);
        /**
         * @property {number} minToShowPassedZman Number of minutes to continue showing zmanim that have passed
         */
        this.minToShowPassedZman = (0, GeneralUtils_1.setDefault)(minToShowPassedZman, 15);
        /**
         * @property {boolean} [showGaonShir] Show the Shir Shel Yom of the Gr"a?
         */
        this.showGaonShir = (0, GeneralUtils_1.setDefault)(showGaonShir, false);
        /**
         * @property {boolean} [showDafYomi] Show Daf Yomi?
         */
        this.showDafYomi = (0, GeneralUtils_1.setDefault)(showDafYomi, true);
        /**
         * @property {boolean} [english] Should the language be English?
         */
        this.english = (0, GeneralUtils_1.setDefault)(english, true);
    }
    clone() {
        return new Settings([...this.zmanimToShow], this.location, this.showNotifications, this.numberOfItemsToShow, this.minToShowPassedZman, this.showGaonShir, this.showDafYomi, this.english);
    }
}
exports.default = Settings;
