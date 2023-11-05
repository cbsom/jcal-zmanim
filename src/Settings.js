import Location from './JCal/Location';
import {findLocation} from './Locations';
import {setDefault} from './GeneralUtils';
import {ZmanTypeIds, getZmanType} from './ZmanTypes';

export default class Settings {
    /**
     *
     * @param {[{id:Number, offset: ?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }]} [zmanimToShow] List of which zmanim to show
     * @param {[{id:Number, offset: Number, whichDaysFlags: Number }]} [customZmanim] List of which zmanim were added
     * @param {Location} [location]
     * @param {boolean} [showNotifications] Show shul notifications?
     * @param {number} [numberOfItemsToShow] Number of zmanim to show on the main screen
     * @param {number} [minToShowPassedZman] Number of minutes to continue showing zmanim that have passed
     * @param {boolean} [showGaonShir] Show the Shir Shel Yom of the Gr"a?
     * @param {string} [theme] The name of the theme
     * @param {boolean} [showDafYomi] Show the Daf Yomi?
     * @param {boolean} [english] Show in English?
     */
    constructor(
        zmanimToShow,
        customZmanim,
        location,
        showNotifications,
        numberOfItemsToShow,
        minToShowPassedZman,
        showGaonShir,
        theme,
        showDafYomi,
        english,
    ) {
        /**
         * @property {[{id:Number, offset: ?Number, whichDaysFlags:?Number, desc: String, eng: String, heb: String }]} zmanimToShow List of which zmanim to show
         */
        this.zmanimToShow = zmanimToShow || [
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
        ];
        /**
         * @property {[{id:Number, offset: Number, whichDaysFlags: Number, desc: String, eng: String, heb: String }]} customZmanim List of added zmanim
         * Note: the id needs to be one of the ids of ZmanTypes list in the file ZmanTypes.js
         * The offset is the number of minutes to be added/subtracted to this ZmanType.
         * The whichDaysFlags is an integer which contains a bit-flag of WhichDaysFlags values (contained in AppUtils.js)
         */
        this.customZmanim = customZmanim || [];
        /**
         * @property {Location} location
         */
        this.location = location || findLocation('Lakewood NJ');
        /**
         * @property {boolean} showNotifications Show shul notifications?
         */
        this.showNotifications = setDefault(showNotifications, true);
        /**
         * @property {number} numberOfItemsToShow Number of zmanim to show on the main screen
         */
        this.numberOfItemsToShow = setDefault(numberOfItemsToShow, 5);
        /**
         * @property {number} minToShowPassedZman Number of minutes to continue showing zmanim that have passed
         */
        this.minToShowPassedZman = setDefault(minToShowPassedZman, 15);
        /**
         * @property {boolean} [showGaonShir] Show the Shir Shel Yom of the Gr"a?
         */
        this.showGaonShir = setDefault(showGaonShir, false);
        /**
         * @property {string} [theme] name of the style theme
         */
        this.theme = theme || 'dark';
        /**
         * @property {boolean} [showDafYomi] Show Daf Yomi?
         */
        this.showDafYomi = setDefault(showDafYomi, true);
        /**
         * @property {boolean} [english] Should the language be English?
         */
        this.english = setDefault(english, true);
    }
    clone() {
        return new Settings(
            [...this.zmanimToShow],
            [...this.customZmanim],
            this.location,
            this.showNotifications,
            this.numberOfItemsToShow,
            this.minToShowPassedZman,
            this.showGaonShir,
            this.theme,
            this.showDafYomi,
            this.english,
        );
    }    
}
