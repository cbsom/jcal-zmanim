# jcal-zmanim
A very complete JavaScript library for the Jewish Calendar.
### To add *jcal-zmanim* to your project
> *npm install jcal-zmanim*

OR

> *yarn add jcal-zmanim*

### Some basic uses of *jcal-zmanim*
##### Print out todays Jewish Date
```javascript
import {jDate} from "jcal-zmanim";

const today = jDate.now();
console.log(today.toString());
```
The above code prints out:
> Thursday, the 23rd of Kislev 5784
##### Get the *Daf Yomi* for today
```javascript
import {jDate} from "jcal-zmanim";

//Prints out todays daf: "Baba Kamma, Daf 6"
console.log(jDate.now().getDafYomi());
```
##### Print out the sunrise and sunset times for 11/10/23 in Dallas
```javascript
import {jDate, findLocation, Utils} from "jcal-zmanim";

//Get the Jewish Date for November 10th, 2023.
const jd = new jDate("November 10 2023");

//Gets us Dallas Texas... 
const dallas = findLocation('Dallas');

//Acquire the sunrise and sunset times for this date in Dallas
const {sunrise, sunset} = jd.getSunriseSunset(dallas);

//Print it out nicely formatted to the console
console.log(`In ${dallas.Name} on ${jd.toString()}, Sunrise is at ${Utils.getTimeString(sunrise)}, and Sunset is at ${Utils.getTimeString(sunset)}`);
```
The code above prints out to the console:
>In Dallas, TX on Erev Shabbos, the 26th of Cheshvan 5784, Sunrise is at 6:53:36 AM, and Sunset is at 5:28:59 PM

##### Get your age and the date of your next Jewish Birthday
```javascript
import {jDate, Utils} from 'jcal-zmanim' 

//We start with the date of birth
const myDateOfBirth = new Date("July 18 1995")  

//Get the Jewish Date for that wonderful day
const jewishDob = new jDate(myDateOfBirth) 

//Get your age today (in the Jewish calendar)
const age = jewishDob.diffFullYears(jDate.now()) 

//Get the next birthday in Jewish
const nextBirthday = jewishDob.addYears(age + 1) 

//Get the next birthday as a Date
const nextBirthdayDate = nextBirthday.getDate(); 

//Print it out
console.log(`Your jewish Birthday is the ${Utils.toSuffixed(jewishDob.Day)} day of ${JewishMonthsEng[jewishDob.Month]}.
On ${Utils.toStringDate(nextBirthdayDate)} you will become ${age + 1} in Jewish.`);
```
The code above prints out to the console:
>Your Jewish Birthday is the 20th day of Tamuz.
>On Wednesday, the 16th of July 2025 you will become 29 in Jewish.

##### Get the current Jewish Date in Hong Kong - taking into consideration that it may be after sunset there right now.
```javascript
import {findLocation, jDate, Utils} from 'jcal-zmanim'

//Get Hong Kong
const hongKong= findLocation('Hong Kong');

//Get the Jewish Date right now in Hong Kong
const nowInHongKong = Utils.nowAtLocation(hongKong);

//Print it out
console.log(nowInHongKong.toString());
```

##### Print out the candle lighting time for Dallas Texas on Friday November 10th 2023:
```javascript
import {jDate, findLocation, Utils} from "jcal-zmanim";

//Get the Jewish Date for Friday, the 10th of November, 2023.
const erevShabbos = new jDate("November 10 2023");

//Get Dallas...
const dallas = findLocation('Dallas');

//Get the candle-lighting time
const candles = erevShabbos.getCandleLighting(dallas); 

//Spit in out formatted nicely...
console.log(`Candle lighting time in ${dallas.Name} on ${erevShabbos.toString()} is at ${Utils.getTimeString(candles)}`);
```
The code above, prints out to the console:
> Candle lighting time in Dallas, TX on Erev Shabbos, the 26th of Cheshvan 5784 is at 5:10:59 PM
---------------------------
## The jDate object

A *jDate* is a single day in the Jewish Calendar.<br>
It is used as the basic date unit throughout jcal-zmanim. 

```javascript
import {jDate} from "jcal-zmanim"

//The following will create a Jewish Date object for todays Date.
const jdate = new jDate();

//The following will output the above Jewish Date in the format: Thursday, the 3rd of Kislev 5784.
console.log(jdate.toString());
```
### Creating a jDate instance
A jDate can be created in a number of ways:
#### Create a jDate using the jDate constructor
-  `const jdate = new jDate()` - Sets the Jewish Date for the current system date
-  `const jdate = new jDate(javascriptDateObject)` - Sets to the Jewish date on the given Gregorian date
-  `const jdate = new jDate("January 1 2045")` - Accepts any valid javascript Date string (uses JavaScript's new Date(string))
-  `const jdate = new jDate(jewishYear, jewishMonth, jewishDay)` - Months start at 1. Nissan is month 1 Adar Sheini is 13.
-  `const jdate = new jDate(jewishYear, jewishMonth)` - Same as above, with Day defaulting to 1
-  `const jdate = new jDate( { year: 5776, month: 4, day: 5 } )` - same as new jDate(jewishYear, jewishMonth, jewishDay)
-  `const jdate = new jDate( { year: 5776, month: 4 } )` - same as new jDate(jewishYear, jewishMonth)
-  `const jdate = new jDate( { year: 5776 } )` - sets to the first day of Rosh Hashana on the given year
-  `const jdate = new jDate(absoluteDate)` - The number of days elapsed since the theoretical date Sunday, December 31, 0001 BCE
-  `const jdate = new jDate(jewishYear, jewishMonth, jewishDay, absoluteDate)` - Most efficient constructor. Needs no calculations at all.
-  `const jdate = new jDate( { year: 5776, month: 4, day: 5, abs: 122548708 } )` - same as new jDate(jewishYear, jewishMonth, jewishDay, absoluteDate)

#### Create a jDate using the static *toJDate* function

 -   `jDate.toJDate()` OR `jDate.now()` - To get the current Jewish Date.
 ```javascript
 //To print out the current Jewish Date in English.
 console.log(jDate.toJDate().toString());
 //A shortcut to get the current jDate.
const currentJDate = jDate.now();
 //To print out the current Jewish Date in Hebrew: 
 console.log(jDate.now().toStringHeb());
 ```
 - `jDate.toJDate(Date)` - Sets to the Jewish date on the given Javascript Date object
 - `jDate.toJDate("January 1 2045")` - Accepts any valid Javascript Date string (uses string constructor of Date object)
```javascript
 //To print out the Jewish Date for January 3rd 2026.
 console.log(jDate.toJDate(new Date(2026, 0, 3)).toString());

 //To print out the Jewish Date for March 23rd 2027: 
 console.log(jDate.toJDate('March 23 2027').toString());
 ```
 - `jDate.toJDate(jewishYear, jewishMonth, jewishDay)` - Months start at 1. *Nissan* is month 1, and *Adar Sheini* is 13.
```javascript
 //To print out the Jewish Date for the 6th day of Kislev 5785 in Hebrew: 
 console.log(jDate.toJDate(5785, 11, 6).toStringHeb());
 //Prints out: יום שלישי ו שבט תשפ"ה
```
 - `jDate.toJDate(jewishYear, jewishMonth)` - Same as above, with Day defaulting to 1
 - `jDate.toJDate(jewishYear)` - sets to the first day of *Rosh Hashana* on the given year
 - `jDate.toJDate( { year: 5776, month: 4, day: 5 } )` - Months start at 1. Nissan is month 1 Adara Sheini is 13.
 - `jDate.toJDate( { year: 5776, month: 4 } )` - Same as above, with Day defaulting to 1
 - `jDate.toJDate( { year: 5776 } )` - sets to the first day of *Rosh Hashana* on the given year
 - `jDate.toJDate(jewishYear, jewishMonth, jewishDay, absoluteDate)` - Most efficient. Needs no calculations at all. The absoluteDate is the number of days elapsed since the theoretical date Sunday, December 31, 0001 BCE.
 - `jDate.toJDate( { year: 5776, month: 4, day: 5, abs: 122548708 } ) `- same as `jDate.toJDate(jewishYear, jewishMonth, jewishDay, absoluteDate)`
------------------------------------------------------------------  
### jDate instance, properties and functions

| Property | Return Type | Description |
| ---: | :---: | :--- |
| **Day** | `number` | The day of the Jewish month. Starts from 1. Maximum can be 29 or 30. |
| **Month** | `number` | The month of the Jewish year. Nissan is month number 1 and Adar Sheini is 13. | 
| **Year** | `number` |The Jewish year. Valid values are 1 - 6000 | 
| **Abs** | `number` | The number of days elapsed since the theoretical date Sunday, December 31, 0001 BCE. | 
| **DayOfWeek** |`number`| The day of the week for the current Jewish date. Sunday is 0 and *Shabbos* is 6.<br>**Helpful tip**: Use the `DaysOfWeek` enum to compare days of the week.<br>For example:<br> `if(jdate.DayOfWeek === DaysOfWeek.FRIDAY) {`<br>&nbsp;&nbsp;`console.log('Today is Erev Shabbos!')`<br>`}`  | 
| **getDate()** | `Date` | Returns the javascript Date of this jDate.<br />This represents the Gregorian date that starts at midnight of the current Jewish Date. | 
| **toString(hideDayOfWeek?, dontCapitalize?)** | `string` | Returns the current Jewish date in the format: "*Thursday, the 3rd of Kislev 5776*".<br />If *hideDayOfWeek* is truthy, the day of the week is left out.<br />If *dontCapitalize* is truthy and *hideDayOfWeek* is truthy, the 't' of "The 3rd etc." will be a regular 't', otherwise it will be a 'T'. This parameter has no effect when *hideDayOfWeek* is falsey. |
| **toShortstring(showDayOfWeek?)**| `string` | Returns the current Jewish date in the format "*Nissan 3, 5778*".<br />If showDayOfWeek is truthy, "*Tuesday Nissan 3, 5778*" is returned. |
|**toStringHeb()**|`string`|Returns the current Jewish date in the format:<br />*"יום חמישי כ"א כסלו תשע"ו"*|
| **addDays(numberOfDays)** | `jDate` | Returns a new Jewish Date by adding the given number of days to the current Jewish date.<br><br>Here is a nice trick that can be used to get the upcoming Shabbos:<br>-------------<br>`import {jDate, DaysOfWeek} from "jcal-zmanim";`<br>`const now = jDate.now();`<br>`const shabbos = now.addDays(DaysOfWeek.SHABBOS - (now.DayOfWeek % DaysOfWeek.SHABBOS));`<br>-------------<br>This can be used for any upcoming day - just substitute the DaysOfWeek you need.|
| **addMonths(numberOfMonths)** | `jDate` | Returns a new Jewish date by adding the given number of Jewish Months to the current Jewish date.<br />If the current Day is 30 and the new month only has 29 days, the 29th day of the month is returned. |
| **addYears(numberOfYears)** | `jDate` | Returns a new Jewish date represented by adding the given number of Jewish Years to the current Jewish date.<br />If the current Day is 30 and the new dates month only has 29 days, the 29th day of the month is returned. |
| **addSecularMonths(numberOfMonths)** | `jDate`  | Adds the given number of months to the Secular Date of this jDate and returns the result as a jDate  |
| **addSecularYears(numberOfYears)** | `jDate` | Adds the given number of years to the Secular Date of this jDate and returns the result as a jDate |
| **diffDays(otherJDate)** | `number` | Gets the number of days separating this Jewish Date and the given one.<br />If the given date is before this one, the number will be negative. |
| **diffMonths(otherJDate)** | `number` | Gets the number of months separating this Jewish Date and the given one.<br /> Ignores the Day property:<br />`jDate.toJDate(5777, 6, 29).diffMonths(jDate.toJDate(5778, 7, 1))`<br />will return 1 even though they are a day apart.<br />If the given date is before this one, the number will be negative. |
|**diffFullMonths(otherDate)**|`number`|Gets the number of full months separating this Jewish Date and the given one.<br>If the given date is before this one, the number will be negative.|
| **diffYears(otherJDate)** | `number` | Gets the number of years separating this Jewish Date and the given one.<br /> Ignores the Day and Month properties:<br /> `jDate.toJDate(5777, 6, 29).diffYears(jDate.toJDate(5778, 7, 1))` will return 1 even though they are a day apart.<br/> If the given date is before this one, the number will be negative. |
|diffFullYears(otherDate)|`number`|Use this function to calculate someones age.<br>Gets the number of full years separating this Jewish Date and the given one.<br>If the given date is before this one, the number will be negative.|
| **monthName(showYear? [=true])** | `string` | Returns the current Jewish date in the format "*Nissan 5778*".<br />If *showYear* === false, than just "*Nissan*" is returned. |
|**getDayOfOmer()**|`number`|Gets the day of the omer for the current Jewish date. If the date is not during *sefira*, 0 is returned.|
|**isYomTovOrCholHamoed(inIsrael?)**|`boolean`|Returns true if this day is *yomtov* or *chol hamoed*<br />If *inIsrael* is truthy, then the function will keep 1 day of *yomtov*.|
|**isYomTov(inIsrael?)**|`boolean`|Returns true if this day is *yomtov*.<br />If *inIsrael* is truthy, then the function will keep 1 day of *yomtov*.|
| **isErevYomTov()**|`boolean`|Is this day *Erev Yom Tov*? (includes *Erev* second days of *Sukkos* and *Pesach*)|
|**hasCandleLighting()**|`boolean`|Does the current Jewish date have candle lighting before sunset?<br />Note, on Friday that is *Yomtov*, this will return true.<br />For *Shabbos* when *Yomtov* is on Sunday, this will return false, as candles cannot be lit until after *Shabbos* is over.|
|**hasEiruvTavshilin(inIsrael?)**|boolean|Is the current Jewish Date the day before a *Yomtov* that contains a Friday?|
|**getCandleLighting([location](#the-location-object), nullIfNoCandles?)**|`{hour: 10, minute: 36, second: 15}`|Gets the candle lighting time for the current Jewish date for the given [Location](#the-location-object).<br />If the current day does not have candle lighting:<ul><li>If *nullIfNoCandles* is truthy, _null_ is returned.<li>Otherwise, a string is returned: *"No candle lighting on Thursday, the 3rd of Kislev 5776"*</ul>|
|**getSedra(inIsrael?)**|[Sedra](#the-sedra-object)|Get the [*Sedra*](#the-sedra-object) of the week for the current Jewish date.|
| **getPirkeiAvos(inIsrael?)** |`number[]`|Gets the *Prakim* of *Pirkei Avos* for the current *Shabbos*.<br/> If the current jDate is not Shabbos, or is during the winter months - where there is no *Pirkei Avos*, an empty array is returned.|
|**getSunriseSunset([location](#the-location-object), ignoreElevation?)**|`{sunrise: {hour: 6, minute: 18}, sunset: {hour: 19, minute: 41}}`|Gets sunrise and sunset time for the current Jewish date at the given [Location](#the-location-object).<br>If *ignoreElevation* is true, the calculations used to determine the sunrise and sunset, will assume that the Location is at sea level.<br>This is necessary for determining some of the daily *Zmanim*.|
| **getChatzos([location](#the-location-object))**|`{hour: 11, minute: 48}`|Gets Chatzos for both the day and the night for the current Jewish date at the given [Location](#the-location-object).|
|**getShaaZmanis**([location](#the-location-object), offset)|`number`|Gets the length in minutes for a single *Sha'a Zmanis* for the current Jewish date at the given [Location](#the-location-object).<br />By default, a *Sha'a Zmanis* is the total number of minutes from sunrise to sunset divided by 12.<br />To calculate from 72 minutes before sunrise to 72 minutes after sunset, set the *offset* parameter to 72.|
|**getDafYomi()**|`string`|Returns the daily daf in English. For example: "*Sukkah, Daf 3*".|
|**getDafyomiHeb()**|`string`|Gets the daily daf in Hebrew. For example:<br />*"'סוכה דף כ"*|
------------------------------------------------------------------
### jDate static properties and functions
| Property | Return Type | Description |
| ---: | :---: | :--- |
|[**jDate.toJDate(....)**](#create-a-jdate-using-the-static-tojdate-function)|`jDate`|[See all parameter options here...](#create-a-jdate-using-the-static-tojdate-function)|
|**jDate.now()**|`jDate`|Returns the current jDate. Shortcut for `jDate.toJDate()`|
|**jDate.fromAbs(absoluteDate)**|`jDate`|Calculates the Jewish Date for the given absolute date.<br />The absoluteDate is the number of days elapsed since the theoretical date Sunday, December 31, 0001 BCE.|
|**jDate.absSd(Date)**|`number`|Gets the absolute date of the given javascript Date object.|
|**jDate.absJd(jewishYear, jewishMonth, jewishDay)**|`number`|Calculate the absolute date for the given Jewish Date.<br>For the *jewishMonth*, *Nissan* is 1 and *Adar Sheini* is 13.|
|**jDate.sdFromAbs(absoluteDate)**|`Date`|Gets a javascript Date from an absolute date.|
|**jDate.daysJMonth(jewishYear, jewishMonth)**|`number`|The number of days in the given Jewish Month.<br>*Nissan* is 1 and *Adar Sheini* is 13.|
|**jDate.daysJYear(jewishYear)**|`number`|The number of days in the given Jewish Year.|
|**jDate.isLongCheshvan(jewishYear)**|`boolean`|Does *Cheshvan* for the given Jewish Year have 30 days?|
|**jDate.isShortKislev(jewishYear)** |`boolean`|Does Kislev for the given Jewish Year have 29 days?|
|**jDate.isJdLeapY(jewishYear)**|`boolean`|Does the given Jewish Year have 13 months?|
|**jDate.monthsJYear(jewishYear)**|`number`|The number of months in the given Jewish Year.|
------------------------------------------------------------------
## The Location Object       

The city or location.<br>
This is very important for calculating any *Zmanim*, as sunset and sunrise are different for every city.<br>
In addition, there are different *Minhagim* in different cities.<br>A major example of this would be, in Eretz Yisroel, one day of *Yom Tov* is observed, while everywhere else, two days are kept.

##### To acquire the entire list of Locations:
```javascript
import {Locations} from "jcal-zmanim";

//Prints out the entire list of all 1,288 Location objects
for(let location of Locations) {
  console.log(location);
}
```
### Finding a Location

##### To search for a Location object for anywhere in the world, import and use the `findLocation` function.
```javascript
import {findLocation} from "jcal-zmanim";

//By city name
const myCity = findLocation('Jersusalem');

//Or in Hebrew
const myCityHebrew = findLocation('ירושלים');

//Or by coordinates
const cityByCoords = findLocation({latitude: 31.77, longitude: -35.23});

//The coordinates do not have to be exact. The function will find the closest Location to the given coordinates.
const closeToJerusalem = findLocation({latitude: 31.75, longitude: -35.2});
```
##### There are 2 ways to search for a Location:
-  `const location = findLocation(locationName)` - Finds a Location with the given name.<br />If no exact match is found, the location with the name most similar to the supplied locationName will be returned.<br>**Note:** The algorithm for this is fairly imprecise, so check to make sure that you have acquired the correct location.<br />If the location is in Israel, typing the name in Hebrew may help find the Location.  
-  `const location = findLocation(locationCoordinates)` -  find a Location by supplying the coordinates in the format: `{latitude: 31.5, longitude: -32.54}`. The numbers are degree decimals.<br /> For latitude, North is a positive number and South is a negative number.<br /> For longitude, West is a positive number, and East is a negative number.<br /> If no Location is found with those exact coordinates, the Location closest to the supplied coordinates is returned.

### Location properties and functions
| Property | Return Type | Description |
| ---: | :---: | :--- |
|**Name**|`string`|The name of the Location.|
|**NameHebrew**|`string`|The name of the Location in Hebrew. Only available for Locations in Israel.|
|**Israel**|`boolean`|Is this Location in Israel?|
|**Latitude**|`number`|The *degree decimal* for the Locations latitude.<br>North is a positive number and South is a negative number.|
|**Longitude**|`number`|The *degree decimal* for the Locations longitude.<br>West is a positive number and East is a negative number.|
|**UTCOffset**|`number`|The time zone. Israel is 2 and New York is -5.|
|**Elevation**|`number`|Elevation in meters.<br>To convert from meters to feet, each meter is 3.2808 feet. |
|**CandleLighting**|`number`|Number of minutes before sunset the candles are lit on Friday|
|**Location.getJerusalem()**|`Location`|Static function that gets us the Location for Yerushalayim.|
|**Location.getLakewood()**|`Location`|Static function that gets us the Location for Lakewood NJ.|
  
### Creating a new Location
##### To create a Location for anywhere in the world, use the Location object constructor:
```javascript
import {Location} from "jcal-zmanim";

const myLocation = new Location(
  'Nowhere', // The location name
  'יהופיץ',     //The name in Hebrew.
  false,     // This place is not in Israel
  35.01      // The latitude.  North is positive.
  -155.23,   // The longitude. East is negative.
  11,        // The Time Zone: The number of hours offset from UTC.
  1106,      // The elevation in Meters. (Feet x 3.2808)
  18)        // The number of minutes before sunset candles are lit on Erev Shabbos. 
);
```

----------------------------------

## Zmanim
The following functions can be used to get *Halachic Zmanim* for any date, anywhere.
##### To get the daily Sunset, Sunrise and *Chatzos* for any location in the world:
```javascript
import {findLocation, jDate} from "jcal-zmanim";

//The following code gets Sunset, Sunrise and Chatzos for Lakewood NJ on Purim 5789.

const lakewood = findLocation('Lakewood');
const purim = new jDate(5789,12, 14);
const {sunset, sunrise} = purim.getSunriseSunset(lakewood);
const chatzos = purim.getChatzos(lakewood);

console.log(`Sunset: ${Utils.getTimeString(sunset)}`);
console.log(`Sunrise: ${Utils.getTimeString(sunrise)}`);
console.log(`chatzos: ${Utils.getTimeString(chatzos)}`);
```
The code above prints out: 
>Sunset: 5:49:02 PM<br>
>Sunrise: 6:29:49 AM<br>
>chatzos: 12:09:25 PM

##### To get <u>all</u> the *Halachic Zmanim* for a given day and Location:
```javascript
import {findLocation, jDate, ZmanimUtils, Utils} from 'jcal-zmanim';

const lakewood = findLocation('Lakewood');
const purim = new jDate(5789,12, 14);

//This will return an array of Zmanim in the format: 
//[{zmanType:{eng, heb}, time: {hour, minute, second}}]
const allZmanim = ZmanimUtils.getAllZmanim(purim, lakewood);

for(let zman of allZmanim) {  
  console.log(`${zman.zmanType.eng}: ${Utils.getTimeString(zman.time)}`)
}
```
The code above prints out:
> Chatzos - Midnight: 12:09:25 AM<br>
> Alos Hashachar - 90: 4:59:49 AM<br>
> Alos Hashachar - 72: 5:17:49 AM<br>
> Taliss and Tefillin: 5:53:49 AM<br>
> Sunrise at current elevation: 6:29:49 AM<br>
> Sunrise: 6:29:49 AM<br>
> Zman Krias Shma - MG"A: 8:33:49 AM<br>
> Zman Krias Shma - GR"A: 9:18:49 AM<br>
> Zman Tefilla - MG"A: 9:45:49 AM<br>
> Zman Tefilla - GR"A: 10:15:49 AM<br>
> Chatzos - Midday: 12:09:25 PM<br>
> Mincha Gedola: 12:37:25 PM<br>
> Mincha Ketana: 3:26:49 PM<br>
> Plag HaMincha: 4:37:49 PM<br>
> Sunset at sea level: 5:49:02 PM<br>
> Sunset: 5:49:02 PM<br>
> Nightfall - 45: 6:34:02 PM<br>
> Nightfall - 50: 6:39:02 PM<br>
> Rabbeinu Tam: 7:01:02 PM<br>
> Rabbeinu Tam - Zmanios: 6:56:02 PM<br>
> Rabbeinu Tam - Zmanios MG"A: 7:14:02 PM
##### To get just the basic daily *Halachic Zmanim* for a given day and Location:
```javascript
import {findLocation, jDate, ZmanimUtils, Utils} from 'jcal-zmanim';

const lakewood = findLocation('Lakewood');
const purim = new jDate(5789,12, 14);

//This will return an array of Zmanim in the format: 
//[{zmanType:{eng, heb}, time: {hour, minute, second}}]
const someZmanim = ZmanimUtils.getBasicShulZmanim(purim, lakewood);

for(let zman of someZmanim) {  
  console.log(`${zman.zmanType.eng}: ${Utils.getTimeString(zman.time)}`)
}
```
The code above prints out:
> Chatzos - Midday: 12:09:25 PM<br>
> Alos Hashachar - 90: 4:59:49 AM<br>
> Sunset: 5:49:02 PM<br>
> Candle lighting time: 5:31:02  PM

### Zmanim Types
The ZmanTypes enum can be acquired by importing `ZmanTypeIds` from 'jcal-zmanim'.<br>
If you need to print out the Zman Type description etc., use the `getZmanType` function.

Here is a list of the in-built *Zmanim Types*: 

|ZmanTypeId|Description|English|Hebrew|
| ---: | :--- | :--- | :--- |
| `ZmanTypeIds.ChatzosLayla` |חצות הלילה|Chatzos - Midnight|חצות הלילה|
|  `ZmanTypeIds.Alos90`|עלות השחר - 90 דקות|Alos Hashachar - 90|עלות השחר (90)|
|  `ZmanTypeIds.Alos72`|עלות השחר - 72 דקות|Alos Hashachar - 72|עלות השחר (72)|
|  `ZmanTypeIds.TalisTefillin`|זמן עטיפת טלית ותפילין - 36 דקות|Taliss and Tefillin|טלית ותפילין|
|  `ZmanTypeIds.NetzAtElevation`|הנץ החמה בגובה המיקום|Sunrise at current elevation|הנץ החמה - מגובה|
|  `ZmanTypeIds.NetzMishor`|הנץ החמה בגובה פני הים|Sunrise|הנץ החמה|
|  `ZmanTypeIds.szksMga`|סזק"ש מג"א|Zman Krias Shma - MG"A|סזק"ש מג"א|
|  `ZmanTypeIds.szksGra`|סזק"ש הגר"א|Zman Krias Shma - GR"A|סזק"ש הגר"א|
|  `ZmanTypeIds.sztMga`|סז"ת מג"א|Zman Tefilla - MG"A|סז"ת מג"א|
|  `ZmanTypeIds.sztGra`|סז"ת הגר"א|Zman Tefilla - GR"A|סז"ת הגר"א|
|  `ZmanTypeIds.chatzosDay`|חצות היום|Chatzos - Midday|חצות היום|
|  `ZmanTypeIds.minGed`|מנחה גדולה|Mincha Gedola|מנחה גדולה|
|  `ZmanTypeIds.minKet`|מנחה קטנה|Mincha Ketana|מנחה קטנה|
|  `ZmanTypeIds.plag`|פלג המנחה|Plag HaMincha|פלג המנחה|
|  `ZmanTypeIds.shkiaAtSeaLevel`|שקיעת החמה מגובה פני הים|Sunset at sea level|שקיעת החמה - ממישור|
|  `ZmanTypeIds.shkiaElevation`|שקיעת החמה מגובה המיקום|Sunset|שקיעת החמה|
|  `ZmanTypeIds.tzais45`|45 דקות אחרי שקיעה|Nightfall - 45|צאת הכוכבים (45)|
|  `ZmanTypeIds.tzais50`|50 דקות אחרי שקיעה|Nightfall - 50|צאת הכוכבים (50)|
|  `ZmanTypeIds.tzais72`|72 דקות אחרי שקיעה|Rabbeinu Tam|צה"כ ר"ת - 72 דקות|
|  `ZmanTypeIds.rabbeinuTamZmanios`|72 דקות זמניות אחרי שקיעה|Rabbeinu Tam - Zmanios|צה"כ ר"ת - זמניות|
|  `ZmanTypeIds.rabbeinuTamZmaniosMga`|72 דקות זמניות אחרי שקיעה - מג"א|Rabbeinu Tam - Zmanios MG"A|צה"כ ר"ת - זמניות מג"א|
|  `ZmanTypeIds.candleLighting`|זמן הדלקת נרות|Candle lighting time|זמן הדלקת נרות|
|  `ZmanTypeIds.SofZmanEatingChometz`|סוף זמן אכילת חמץ|Stop eating Chometz|סוף זמן אכילת חמץ|
|  `ZmanTypeIds.SofZmanBurnChometz`|סוף זמן ביעור חמץ|Destroy Chometz|סוף זמן ביעור חמץ|
##### To get a list of particular Zmanim:
```javascript
import {jDate, findLocation, ZmanimUtils, ZmanTypeIds, getZmanType} from 'jcal-zmanim';

//Get Lakewood, NJ
const lakewood = findLocation('Lakewood');

//Get the Jewish Date of Purim 5789
const purim = new jDate(5789,12, 14);

//Here is a list of the Zmanim Types we want
const zmanimTypesWeWant= [                
    getZmanType(ZmanTypeIds.Alos72),
    getZmanType(ZmanTypeIds.chatzosDay),
    getZmanType(ZmanTypeIds.shkiaElevation)
];

//This will return an array of these Zmanim in the format: 
//[{zmanType:{eng, heb}, time: {hour, minute, second}}]
const zmanimForThose = ZmanimUtils.getZmanTimes(
    zmanimTypesWeWant,
    purim.getDate(),
    purim,
    lakewood
);

//Print them out nicely
for(let zman of zmanimForThose) {  
  console.log(`${zman.zmanType.eng}: ${Utils.getTimeString(zman.time)}`)
}
```
### Calculate other Zmanim
To calculate any other *Zman*, add the number of minutes or *Shaas Zmanimios* to sunset, sunrise or *Chatzos*.
##### For example, to calculate 4 *Shaos Zmanios* of the *Magen Avraham* after sunrise in Lakewood NJ on Purim 5789:
```javascript
import {jDate, findLocation, Utils} from 'jcal-zmanim';

//Get Lakewood, NJ
const lakewood = findLocation('Lakewood');

//Get the Jewish Date of Purim 5789
const purim = new jDate(5789, 12, 14);

//Get Hanetz Hachama
const {sunrise} = purim.getSunriseSunset(lakewood);

//Get the longer Shaos Zmanios length for this day -
//from 72 minutes before sunrise until 72 minutes after sunset
const shaosZmanios = purim.getShaaZmanis(lakewood, 72);

//Add 4 long Shaos Zmanios to Hanetz Hachama (Why not? it's Purim...)
const lateZman = Utils.addMinutes(sunrise, shaosZmanios * 4);

//Print it out nicely
console.log(`Hanetz on Purim 5789 in Lakewood is: ${Utils.getTimeString(sunrise)}\n4 long Sha'os Zmanios after Hanetz is :) ${Utils.getTimeString(lateZman)}`)
```
The code above prints out:
>Hanetz on Purim 5789 in Lakewood is: 6:29:49 AM<br>
>4 long Sha'os Zmanios after Hanetz is :) 11:03:49 AM

---------------------

## The Sedra Object 
The *Sedra* object is obtained by calling getSedra on a [jDate](#the-jdate-object).

```javascript
import {jDate} from "jcal-zmanim";

const today = jDate.now();

//Gets the sedra for today out of Israel
const parsha = today.getSedra(false);

//Print that out
console.log(parsha.toString());
```
The above code printed out:
>Chayei Sara

#### Sedra Property and Functions:
|Name|Type|Description|
| ---: | :---: |:--- |
| **sedras** |`[{eng, heb}]`|An array for the `Sedra` of the week for the current [jDate](#the-jdate-object).<br>Each item in the array contains the `eng` (English) name of that *parsha* and `heb`, the Hebrew name.|
|**toString()**|`string`|Gets the sedra/s names in English as a string. If there are two, they are seperated by a " - "|
|**toStringHeb()**|`string`|Gets the sedra/s names in Hebrew as a string. If there are two, they are seperated by a " - "|

------------------------------------------
## The Molad Functions
|Name|Type|Description|
| ---: | :---: |:--- |
| **Molad.getMolad(jewishMonth, jewishYear)** |`{jDate,time,chalakim}`|Gets the *Molad* for the given Jewish Year and Month.<br>For the Month, Nissan is 1 and Adar Sheini is 13.<br>The returned object contains the [jDate](#the-jdate-object), the time of day in the format `{hour, minute}` and the number of *Chalakim*|
|**Molad.getString(jewishYear, jewishMonth)**|`string`|Gets the *Molad* for the given Jewish Year and Month.<br>For the Month, Nissan is 1 and Adar Sheini is 13.<br>Returns the time of the molad as a string in the format: *Monday Night, 8:33 PM and 12 Chalakim*.<br>The molad is always in Jerusalem so we use the Jerusalem sunset times to determine whether to display "Night" or *Motzai Shabbos* etc.|
|**Molad.getStringHeb(jewishYear, jewishMonth)**|`string`|Gets the *Molad* for the given Jewish Year and Month.<br>For the Month, Nissan is 1 and Adar Sheini is 13.<br>Returns the time of the molad as a string in the format: *ליל שני 20:33 12 חלקים* <br>The molad is always in Jerusalem so we use the Jerusalem sunset times to determine whether to display "ליל/יום" or "מוצאי שב"ק" etc.|
------------------------------------
## Daily *Notifications* and *Shul Notifications*
Get a list of Halacha related information about any [jDate](#the-jdate-object).<br>
This is very useful for creating an application that shows the daily information and *Zmanim* in a *Shul* etc.
<br>
To get these notifications, use the *getNotifications* function.

#### There are two lists that are returned from the *getNotifications* function.
- **Daily Notifications** - These are information about the given day, such as if it is Shabbos or YomTov, the *Daf Yomi*, day of *Sefirah* etc.
- **Shul Notifications** - These are *shul* and *davening* realted information about the given day, such as the *Torah* reading, skipping *Tachnun*, saying *Hallel*, the *Shir Shel Yom* etc.
##### Sample use of daily and *tefillah* notifications:
```javascript
import {jDate, getNotifications, findLocation} from "jcal-zmanim";

//Get Lakewood NJ
const lakewood = findLocation('Lakewood');

//Get Purim 5784
const purim = new jDate(5784, 13, 14);

//We want to get the notifications that are relevant at 8 o'clock in the morning.
const morningTime = { hour:8, minute:0 };

//Get Purim's notifications
const {dayNotes, tefillahNotes} = getNotifications(purim, morningTime, lakewood, true, true, true);

//Print them out
console.log(`Purim: ${purim.toString()}\nDaily Notes:\n\t${dayNotes.join('\n\t')}\nTefillah Notes:\n\t${tefillahNotes.join('\n\t')}`);
```
The above code prints out:
> Purim:  Sunday, the 14th of Adar Sheini 5784<br>
> Daily Notes:
> - Megilas Esther
> - Purim
> - Baba Metzia Daf 25
>
> Tefillah Notes: 
> - No Laminatzeach
> - Al Hanissim
> - שיר של יום - כ"ב - למנצח על אילת השחר
> - No Tachnun
### The **getNotifications** Function - parameters
|Parameter|Type|Description|
|-----:|:-------:|:--------|
|**date**|`Date` or `jDate`|Either a jDate or a javascript Date|
|**time**|`{hour, minute}}`|The time of day for which to show notifications for. <br>For example, "Hallel" will not be shown at night etc.|
|**location**|`Location`|Where in the world to show notifications for?|
|**english**|`boolean`|Should the notifications be in English or Hebrew?|
|**showGaonShir**|`boolean`|Should the *Shir Shel Yom* of the Gr"a be shown?<br>If this paremeter is undefined, it will not be shown, unless the location is in Israel.|
|**showDafYomi**|`boolean`|Should the daily *Daf* be shown in the daily notifications?<br>Defaults to **true**.|

------------------------------------------
## The Utils Functions
The Utils Class contains many useful jDate and regular Date functions.<br>
It also has some extremely useful general functions.

|Function|Return Type|Description|
|-----:|:-------:|:--------|
|**Utils.toJewishNumber(number)**|`string`|Gets the Jewish representation of a number (365 = שס"ה)<br>Minimum number is 1 and maximum is 9999.|
|**Utils.toStringDate(Date, hideDayOfWeek?, dontCapitalize?)**|`string`|Returns the javascript date in the format: Thursday, the 3rd of January 2018.|
|**Utils.toShortStringDate(Date, monthFirst?)**|`string`|Returns the javascript date in the format: 132020.|
|**Utils.toSuffixed(number)**|`string`|Add two character suffix to number. e.g. 21st, 102nd, 93rd, 500th|
|**Utils.isSecularLeapYear(year)**|`boolean`|Returns if the given full secular year has a February 29th|
|**Utils.getSdDOW(year, month, day)**|`number`|Get day of week using Javascripts getDay function.<br>Important note: months starts at 1 not 0 like javascript<br>The DOW returned has Sunday = 0|
|**Utils.fixTime(Time)**|`{hour, minute, second}`|Makes sure hour is between 0 and 23 and minute is between 0 and 59.<br>Overlaps get addedsubtracted.<br>The argument needs to be an object in the format {hour : 12, minute : 42, second : 18}|
|**Utils.addMinutes(Time, minutes)**|`{hour, minute, second}`|Add the given number of minutes to the given time.<br>The argument needs to be an object in the format {hour : 12, minute : 42, second : 18 }|
|**Utils.addSeconds(Time, seconds)**|`{hour, minute, second}`|Add the given number of seconds to the given time.<br>The argument needs to be an object in the format {hour : 12, minute :42, second : 18}|
|**Utils.timeDiff(earlierTime, laterTime, showNegative?)**|`{hour, minute, second, sign}`|Gets the time difference between two times of day.<br>If showNegative is falsey, assumes that the earlier time is always before the later time.<br>So, if laterTime is less than earlierTime, the returned diff is until the next day.<br>Both arguments need to be an object in the format {hour : 12, minute : 42, second : 18 }|
|**Utils.totalMinutes(Time)**|`number`|Gets the total number of minutes in the given time. |
|**Utils.totalSeconds(Time)**|`number`|Gets the total number of seconds in the given time. |
|**Utils.timeFromDate(Date)**|`{hour, minute, second}`|Returns the time of the given javascript date.|
|**Utils.isTimeAfter(beforeTime, afterTime)**|`boolean`|Determines if the second given time is after (or at) the first given time|
|**Utils.getTimeIntervalTextStringHeb(Time)**|`string`|Returns the given time interval in a formatted string.|
|**Utils.getTimeIntervalTextString(Time)**|`string`|Returns the given time interval in a formatted string.|
|**Utils.getTimeString(Time, sign?, army?, roundUp?)**|`string`|Returns the given time in a formatted string.|
|**Utils.getOmerNusach(dayOfOmer, nusach)**|`string`|Returns the nusach for Sefiras Ha'omer for the given day and minhag<br>The *nusach* parameter should be either *'ashkenaz'* or *'sefard'* or *'sefardi'*)|
|**Utils.currUtcOffset()**|`number`|Gets the UTC offset in whole hours for the users time zone.<br>Note: this is not affected by DST - unlike javascripts getTimezoneOffset() function which gives you the current offset.|
|**Utils.isDateDST( Date)**|`boolean`|Determines if the given date is within DST on the users system|
|**Utils.isDST(Location, Date)**|`boolean`|Determines if the given date is within DST in the given location<br>Note: This may not be correct if the user has set the Location to a time zone outside Israel or the USA which is not the current system time zone.|
|**Utils.isUSA_DST(date: Date)**|`boolean`|Determines if the given javascript date is during DST according to the USA rules|
|**Utils.isIsrael_DST(date: Date)**|`boolean`|Determines if the given Javascript date is during DST according to the current (5776) Israeli rules|
|**Utils.getSdNowInIsrael()**|`Date`|The current time in Israel - determined by the current users system time and time zone offset|
|**Utils.addDaysToSdate(Date, days)**|`Date`|Adds the given number of days to the given javascript Date and returns the new date |
|**Utils.isSameSdate(Date1, Date2)**|`boolean`|Compares two js dates to se if they both refer to the same day - time is ignored.|
|**Utils.isSameJdate(jDate1, jDate2)**|`boolean`|Compares two jDates to se if they both refer to the same day - time is ignored.|
|**Utils.isSameJMonth(jDate1, jDate2)**|`boolean`|Compares two jDates to see if they both refer to the same Jewish Month.|
|**Utils.isSameSMonth(Date1, Date2)**|`boolean`|Compares two javascript dates to see if they both refer to the same Secular Month.|
|**Utils.isAfterSunset(Date, Location)**|`boolean`|Determines if the time of the given Date() is after sunset at the given Location|
|**Utils.nowAtLocation(Location)**|`jDate`|Gets the current Jewish Date at the given Location|
|**Utils.toInt(float)**|`number`|Converts the given complex number to an integer by removing the decimal part.<br>Returns same results as Math.floor for positive numbers and Math.ceil for negative ones.<br>Almost identical functionality to Math.trunc and parseInt.<br>The difference is if the argument is NaN. Math.trunc returns NaN while ths fuction returns 0.<br>In performance tests, this function was found to be quicker than the alternatives.|
|**Utils.bothDates(Date)**|`{ sdate:Date, jdate:jDate }`|Takes either a jDate or a Date and returns both|
|**Utils.isString(thing)**|`boolean`|Returns true if "thing" is either a string primitive or String object.|
|**Utils.isNumber(thing)**|`boolean`|Returns true if "thing" is either a number primitive or a Number object.|
|**Utils.isValidDate(thing)**|`boolean`|Returns true if "thing" is a Date object containing a valid date.|
|**Utils.has(thing, ...paramsOrArrayOrString)**|`boolean`|Returns whether or not the given, array, string, or argument list contains the given item or substring.<br>This function is awfully similar to Array.includes, but has the added plus of accepting any number or type of arguments.|
|**Utils.setDefault(paramValue, defValue)**|`any`|Returns the first value unless it is undefined, null or NaN.<br>This is very useful for boolean, string and integer parameters<br>where we want to keep false, "" and 0 if they were supplied.<br>Similar purpose to default parameters with the difference being that this function will return the second value if the first is NaN or null, while default params will give give you the NaN or the null.|
|**Utils.log(string, ...optionalItems)**||Log message to console|
|**Utils.warn(string, ...optionalItems)**||Warn message to console|
|**Utils.error(string, ...optionalItems)**||Error message to console|