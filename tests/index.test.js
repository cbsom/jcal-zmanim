import { jDate, findLocation, Utils, ZmanimUtils, ZmanTypeIds, getZmanType, Molad } from '../dist/index.js';


describe("Basic jDate", () => {
    test('jDate.now().Month should be more than 0', () => {
        expect(jDate.now().Month).toBeGreaterThan(0);
    });

    test('DafYomi', () => {
        expect(jDate.now().getDafYomi().length).toBeGreaterThan(8);
    });

    test('Print out the sunrise and sunset times for 11/10/23 in Dallas', () => {
        //Get the Jewish Date for November 10th, 2023.
        const jd = new jDate("November 10 2023");
        //Gets us Dallas Texas... 
        const dallas = findLocation('Dallas');
        //Acquire the sunrise and sunset times for this date in Dallas
        const { sunrise, sunset } = jd.getSunriseSunset(dallas);
        //Print it out nicely formatted to the console
        const output = `In ${dallas.Name} on ${jd.toString()}, Sunrise is at ${Utils.getTimeString(sunrise)}, and Sunset is at ${Utils.getTimeString(sunset)}`;
        expect(output).toBe('In Dallas, TX on Erev Shabbos, the 26th of Cheshvan 5784, Sunrise is at 6:53:36 AM, and Sunset is at 5:28:59 PM');
    });


    test('Get the current Jewish Date in Hong Kong', () => {
        const hongKong = findLocation('Hong Kong');
        const nowInHongKong = Utils.nowAtLocation(hongKong);
        const output = nowInHongKong.toString();
        expect(output.length).toBeGreaterThan(20);
    });

    test('Print out the candle lighting time for Dallas Texas on Friday November 10th 2023', () => {
        //Get the Jewish Date for Friday, the 10th of November, 2023.
        const erevShabbos = new jDate("November 10 2023");
        //Get Dallas...
        const dallas = findLocation('Dallas');
        //Get the candle-lighting time
        const candles = erevShabbos.getCandleLighting(dallas);
        //Spit in out formatted nicely...
        const output = `Candle lighting time in ${dallas.Name} on ${erevShabbos.toString()} is at ${Utils.getTimeString(candles)}`;
        expect(output).toBe('Candle lighting time in Dallas, TX on Erev Shabbos, the 26th of Cheshvan 5784 is at 5:10:59 PM');
    });

    test('Get location by approximate coordinates', () => {
        const closeToJerusalem = findLocation({ latitude: 31.75, longitude: -35.2 });
        expect(closeToJerusalem.Name).toBe('Jerusalem');
    });
    test('To get a list of particular Zmanim', () => {
        const lakewood = findLocation('Lakewood');
        const purim = new jDate(5789, 12, 14);
        const zmanimTypesWeWant = [
            getZmanType(ZmanTypeIds.Alos72),
            getZmanType(ZmanTypeIds.chatzosDay),
            getZmanType(ZmanTypeIds.shkiaElevation)
        ];
        const zmanimForThose = ZmanimUtils.getZmanTimes(
            zmanimTypesWeWant,
            purim.getDate(),
            purim,
            lakewood
        );
        let output = '';
        for (let zman of zmanimForThose) {
            output += (`${zman.zmanType.eng}: ${Utils.getTimeString(zman.time)}~`)
        }
        expect(output).toBe('Alos Hashachar - 72: 5:17:49 AM~Chatzos - Midday: 12:09:25 PM~Sunset: 5:49:02 PM~');
    });
    test('To calculate 4 *Shaos Zmanios* of the *Magen Avraham* after sunrise in Lakewood NJ on Purim 5789', () => {
        const lakewood = findLocation('Lakewood');
        const purim = new jDate(5789, 12, 14);
        const { sunrise } = purim.getSunriseSunset(lakewood);
        const shaosZmanios = purim.getShaaZmanis(lakewood, 72);
        const lateZman = Utils.addMinutes(sunrise, shaosZmanios * 4);
        const output = `Hanetz on Purim 5789 in Lakewood is: ${Utils.getTimeString(sunrise)}~4 long Sha'os Zmanios after Hanetz is :) ${Utils.getTimeString(lateZman)}`;
        expect(output).toBe('Hanetz on Purim 5789 in Lakewood is: 6:29:49 AM~4 long Sha\'os Zmanios after Hanetz is :) 11:03:49 AM');
    });
    test('Sedra', () => {
        const today = new jDate('12 November 2023');
        const parsha = today.getSedra(true);
        const output = parsha.toString();
        expect(output).toBe('Toldos');
    });
    test('Molad', () => {
        const output = Molad.getString(5784, 9);
        expect(output).toBe('Monday 7:17:00 AM and 2 Chalakim');
    });

    test('Polar Region Exception', () => {
        // Antarctica - verify it throws the expected error
        const antarctica = { Latitude: -82, Longitude: 0, Name: 'Antarctica', UTCOffset: 0, Elevation: 0 };
        const date = new jDate(5785, 4, 1); // Winter in Antarctica (Summer in North) calculations might fail?
        // Actually, Teves (Winter in North) -> Summer in South -> Sun always UP? or Down?
        // In Antarctica:
        // Dec (Summer) -> Sun always UP (Midnight Sun). No Rise/Set.
        // June (Winter) -> Sun always DOWN (Polar Night).
        // Teves 5785 is approx Dec 2024 / Jan 2025.
        // So it should be Polar Day (Midnight Sun).
        // The Exception Check looks for "No conversion".
        // My code throws if !sunrise || !sunset.
        expect(() => {
            date.getSunriseSunset(antarctica);
        }).toThrow(/Zmanim Calculation Error/);
    });
});