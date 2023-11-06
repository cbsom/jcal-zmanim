import Location from './JCal/Location';
import { findLocation } from './Locations';
import { setDefault } from './GeneralUtils';
import { ZmanTypeIds, getZmanType } from './ZmanTypes';
import { ZmanToShow } from './jcal-zmanim';


/**
 * Class that represents a set of Settings to use while generating zmanim, notifications etc.
 * All the options are optional.
 */
export default class Settings {
    zmanimToShow: ZmanToShow[];
    location: Location;
    showNotifications: boolean;
    numberOfItemsToShow: number;
    minToShowPassedZman: number;
    showGaonShir: boolean;
    showDafYomi: boolean;
    english: boolean;
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
    constructor(
        zmanimToShow?: ZmanToShow[],
        location?: Location,
        showNotifications?: boolean,
        numberOfItemsToShow?: number,
        minToShowPassedZman?: number,
        showGaonShir?: boolean,
        showDafYomi?: boolean,
        english?: boolean,
    ) {
        /**
         * @property {[ZmanToShow]} zmanimToShow List of which zmanim to show
         */
        this.zmanimToShow = (zmanimToShow || [
            getZmanType(ZmanTypeIds.ChatzosLayla), //chatzosNight
            getZmanType(ZmanTypeIds.Alos72), //alos72
            getZmanType(ZmanTypeIds.TalisTefillin), //talisTefillin
            getZmanType(ZmanTypeIds.NetzMishor), //netzMishor
            getZmanType(ZmanTypeIds.szksMga), //szksMga
            getZmanType(ZmanTypeIds.szksGra), //szksGra
            getZmanType(ZmanTypeIds.sztMga), //sztMga
            getZmanType(ZmanTypeIds.sztGra), //sztGra
            getZmanType(ZmanTypeIds.chatzosDay), //chatzosDay
            getZmanType(ZmanTypeIds.minGed), //minGed
            getZmanType(ZmanTypeIds.minKet), //minKet
            getZmanType(ZmanTypeIds.plag), //plag
            getZmanType(ZmanTypeIds.shkiaElevation), //shkiaElevation
            getZmanType(ZmanTypeIds.tzais50), //tzais50
            getZmanType(ZmanTypeIds.tzais72), //tzais72
            getZmanType(ZmanTypeIds.candleLighting), //candleLighting
            getZmanType(ZmanTypeIds.SofZmanEatingChometz), //Sof Zman eating Chometz
            getZmanType(ZmanTypeIds.SofZmanBurnChometz), //Sof Zman burn Chometz
        ]) as ZmanToShow[];
        /**
         * @property {Location} location
         */
        this.location = (location || findLocation('Lakewood NJ')) as Location;
        /**
         * @property {boolean} showNotifications Show shul notifications?
         */
        this.showNotifications = setDefault(showNotifications, true) as boolean;
        /**
         * @property {number} numberOfItemsToShow Number of zmanim to show on the main screen
         */
        this.numberOfItemsToShow = setDefault(numberOfItemsToShow, 5) as number;
        /**
         * @property {number} minToShowPassedZman Number of minutes to continue showing zmanim that have passed
         */
        this.minToShowPassedZman = setDefault(minToShowPassedZman, 15) as number;
        /**
         * @property {boolean} [showGaonShir] Show the Shir Shel Yom of the Gr"a?
         */
        this.showGaonShir = setDefault(showGaonShir, false) as boolean;
        /**
         * @property {boolean} [showDafYomi] Show Daf Yomi?
         */
        this.showDafYomi = setDefault(showDafYomi, true) as boolean;
        /**
         * @property {boolean} [english] Should the language be English?
         */
        this.english = setDefault(english, true) as boolean;
    }
    /**
     * 
     * @returns {Settings} a copy of this Settings object.
     */
    clone() {
        return new Settings(
            [...this.zmanimToShow],
            this.location,
            this.showNotifications,
            this.numberOfItemsToShow,
            this.minToShowPassedZman,
            this.showGaonShir,
            this.showDafYomi,
            this.english,
        );
    }
}
