import Location from "./JCal/Location";
export type Time = { hour: number, minute: number, second?: number };
export type SunTimes = { sunrise?: Time, sunset?: Time };
export type ZmanToShow = { id: number, desc: string, eng: string, heb: string, offset?: number, whichDaysFlags?: number };
