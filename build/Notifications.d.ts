import Settings from './Settings';
import jDate from './JCal/jDate';
import { Time } from './jcal-zmanim';
/**
 * Get shul notifications for the given date and location
 * @param {jDate} jdate
 * @param {Date} sdate
 * @param {Time} time
 * @param {Settings} settings
 */
export default function getNotifications(jdate: jDate, sdate: Date, time: Time, settings: Settings): {
    dayNotes: string[];
    tefillahNotes: string[];
};
