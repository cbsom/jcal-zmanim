import Location from './JCal/Location';
import { ZmanToShow } from './jcal-zmanim';
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
    constructor(zmanimToShow?: ZmanToShow[], location?: Location, showNotifications?: boolean, numberOfItemsToShow?: number, minToShowPassedZman?: number, showGaonShir?: boolean, showDafYomi?: boolean, english?: boolean);
    clone(): Settings;
}
