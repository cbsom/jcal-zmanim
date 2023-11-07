# jcal-zmanim
A very complete JavaScript library for the Jewish Calendar.

For example, to print out the candle lighting time for Friday, the 11th of November, 2023 in Dallas Texas:
```javascript
import {jDate, findLocation, Utils} from "jcal-zmanim"

//Get the Jewish Date for Friday, the 10th of November, 2023.
const erevShabbos = new jDate("November 10 2023");
//Get Dallas...
const dallas = findLocation('Dallas');
//Get the candle-lighting time
const candeLighting = erevShabbos.getCandleLighting(dallas); 
//the above will get us { hour: 17, minute: 10, second: 59 }
const candeLightingFormatted = Utils.getTimeString(candeLighting); 
//This will get us the nicely formatted time '5:10:59 PM'

//Spit in out...
console.log(`Candle lighting time in ${dallas.Name} on ${erevShabbos.toString()} is at ${candeLightingFormatted}`);

//"Candle lighting time in Dallas, TX on Erev Shabbos, the 26th of Cheshvan 5784 is at 5:10:59 PM"
```   

[**The jDate Object**](#the-jdate-object)
- [jcal-zmanim](#jcal-zmanim)
- [The jDate object](#the-jdate-object)
- [Creating a jDate instance](#creating-a-jdate-instance)
- [Create a jDate using the jDate constructor](#create-a-jdate-using-the-jdate-constructor)
- [Create a jDate using the static *toJDate* function](#create-a-jdate-using-the-static-tojdate-function)
- [jDate instance, properties and functions](#jdate-instance-properties-and-functions)
- [jDate static properties and functions](#jdate-static-properties-and-functions)
- [The Location Object](#the-location-object)
- [The Sedra Object](#the-sedra-object)
  
[**The Location Object**](#the-location-object)

[**The Utils Object**](#the-Utils-object)

[**The AppUtils Object**](#the-AppUtils-object)

[**The DaysOfWeek Object**](#the-DaysOfWeek-object)

[**The getNotifications Object**](#the-getNotifications-object)

[**The Locations Object**](#the-Locations-object)

[**The findLocation Object**](#the-findLocation-object)

[**The closestNameMatch Object**](#the-closestNameMatch-object)

[**The closestDistanceMatch Object**](#the-closestDistanceMatch-object)

[**The ZmanTypes Object**](#the-ZmanTypes-object)

[**The ZmanTypeIds Object**](#the-ZmanTypeIds-object)

[**The Zmanim Object**](#the-Zmanim-object)

[**The Location Object**](#the-Location-object)

[**The Settings Object**](#the-Settings-object)

[**The Molad Object**](#the-Molad-object)

[**The PirkeiAvos Object**](#the-PirkeiAvos-object)

[**The Dafyomi Object**](#the-Dafyomi-object)

[**The Sedra Object**](#the-Sedra-object)

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
    

### jDate instance, properties and functions

| Property | Return Type | Description |
| ---: | :---: | :--- |
| **Day** | `number` | The day of the Jewish month. Starts from 1. Maximum can be 29 or 30. |
| **Month** | `number` | The month of the Jewish year. Nissan is month number 1 and Adar Sheini is 13. | 
| **Year** | `number` |The Jewish year. Valid values are 1 - 6000 | 
| **Abs** | `number` | The number of days elapsed since the theoretical date Sunday, December 31, 0001 BCE. | 
| **DayOfWeek** |`number`| The day of the week for the current Jewish date. Sunday is 0 and *Shabbos* is 6. | 
| **getDate()** | `Date` | Returns the javascript Date of this jDate.<br />This represents the Gregorian date that starts at midnight of the current Jewish Date. | 
| **addDays(numberOfDays)** | `jDate` | Returns a new Jewish Date by adding the given number of days to the current Jewish date. |
| **addMonths(numberOfMonths)** | `jDate` | Returns a new Jewish date by adding the given number of Jewish Months to the current Jewish date.<br />If the current Day is 30 and the new month only has 29 days, the 29th day of the month is returned. |
| **addYears(numberOfYears)** | `jDate` | Returns a new Jewish date represented by adding the given number of Jewish Years to the current Jewish date.<br />If the current Day is 30 and the new dates month only has 29 days, the 29th day of the month is returned. |
| **addSecularMonths(numberOfMonths)** | `jDate`  | Adds the given number of months to the Secular Date of this jDate and returns the result as a jDate  |
| **addSecularYears(numberOfYears)** | `jDate` | Adds the given number of years to the Secular Date of this jDate and returns the result as a jDate |
| **diffDays(otherJDate)** | `number` | Gets the number of days separating this Jewish Date and the given one.<br />If the given date is before this one, the number will be negative. |
| **diffMonths(otherJDate)** | `number` | Gets the number of months separating this Jewish Date and the given one.<br /> Ignores the Day property:<br />`jDate.toJDate(5777, 6, 29).diffMonths(jDate.toJDate(5778, 7, 1))`<br />will return 1 even though they are a day apart.<br />If the given date is before this one, the number will be negative. |
| **diffYears(otherJDate)** | `number` | Gets the number of years separating this Jewish Date and the given one.<br /> Ignores the Day and Month properties:<br /> `jDate.toJDate(5777, 6, 29).diffYears(jDate.toJDate(5778, 7, 1))` will return 1 even though they are a day apart.<br/> If the given date is before this one, the number will be negative. |
| **toString(hideDayOfWeek?, dontCapitalize?)** | `string` | Returns the current Jewish date in the format: "*Thursday, the 3rd of Kislev 5776*".<br />If *hideDayOfWeek* is truthy, the day of the week is left out.<br />If *dontCapitalize* is truthy and *hideDayOfWeek* is truthy, the 't' of "The 3rd etc." will be a regular 't', otherwise it will be a 'T'. This parameter has no effect when *hideDayOfWeek* is falsey. |
| **toShortstring(showDayOfWeek?)**| `string` | Returns the current Jewish date in the format "*Nissan 3, 5778*".<br />If showDayOfWeek is truthy, "*Tuesday Nissan 3, 5778*" is returned. |
| **monthName(showYear? [=true])** | `string` | Returns the current Jewish date in the format "*Nissan 5778*".<br />If *showYear* === false, than just "*Nissan*" is returned. |
|**toStringHeb()**|`string`|Returns the current Jewish date in the format:<br />*"יום חמישי כ"א כסלו תשע"ו"*|
|**getDayOfOmer()**|`number`|ets the day of the omer for the current Jewish date. If the date is not during *sefira*, 0 is returned.|
|**isYomTovOrCholHamoed(inIsrael?)**|`boolean`|Returns true if this day is *yomtov* or *chol hamoed*<br />If *inIsrael* is truthy, then the function will keep 1 day of *yomtov*.|
|**isYomTov(inIsrael?)**|`boolean`|Returns true if this day is *yomtov*.<br />If *inIsrael* is truthy, then the function will keep 1 day of *yomtov*.|
| **isErevYomTov()**|`boolean`|Is this day *Erev Yom Tov*? (includes *Erev* second days of *Sukkos* and *Pesach*)|
|**hasCandleLighting()**|`boolean`|Does the current Jewish date have candle lighting before sunset?<br />Note, on Friday that is *Yomtov*, this will return true.<br />For *Shabbos* when *Yomtov* is on Sunday, this will return false, as candles cannot be lit until after *Shabbos* is over.|
|**hasEiruvTavshilin(inIsrael?)**|boolean|Is the current Jewish Date the day before a *Yomtov* that contains a Friday?|
|**getCandleLighting([location](#the-location-object) , nullIfNoCandles?)**|`{hour: 10, minute: 36, second: 15}`|Gets the candle lighting time for the current Jewish date for the given [Location](#the-location-object).<br />If the current day does not have candle lighting:<ul><li>If *nullIfNoCandles* is truthy, _null_ is returned.<li>Otherwise, a string is returned: *"No candle lighting on Thursday, the 3rd of Kislev 5776"*</ul>|
|**getSedra(inIsrael?)**|[Sedra](#the-sedra-object)|Get the [*Sedra*](#the-sedra-object) of the week for the current Jewish date.|
| **getPirkeiAvos(inIsrael?)** |`number[]`|Gets the *Prakim* of *Pirkei Avos* for the current *Shabbos*.<br/> If the current jDate is not Shabbos, or is during the winter months - where there is no *Pirkei Avos*, an empty array is returned.|
| **getChatzos([location](#the-location-object))**|`{hour: 11, minute: 48}`|Gets Chatzos for both the day and the night for the current Jewish date at the given [Location](#the-location-object).|
| getShaaZmanis([location](#the-location-object), offset)|`number`|Gets the length in minutes for a single *Sha'a Zmanis* for the current Jewish date at the given [Location](#the-location-object).<br />By default, a *Sha'a Zmanis* is the total number of minutes from sunrise to sunset divided by 12.<br />To calculate from 72 minutes before sunrise to 72 minutes after sunset, set the *offset* parameter to 72.|
|**getDafYomi()**|`string`|Returns the daily daf in English. For example: "*Sukkah, Daf 3*".|
|**getDafyomiHeb()**|`string`|Gets the daily daf in Hebrew. For example:<br />*"'סוכה דף כ"*|


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

## The Location Object       

The city or location.
This is very important for calculating *Zmanim* as sunset and sunrise are different for every city.
In addition, there are different *Minhagim* is different cities. A major one would be, in Eretz Yisroel, one day of *Yom Tov* is observed, while everywhere else, two days are kept.

### Finding or Creating a Location

To search for a Location object for anywhere in the world, use the `findLocation` function.
-  `const location = findLocation(locationName)` - Finds a Location with the given name.<br />If the location is in Israel, typing the name in Hebrew will help find the Location.<br />If no exact match is found, the location with the name most similar to the supplied locationName will be returned. **Note:** The alogorthim for this is fairly impresise, so make check to make sure that you have acquired the correct location.<br />A list with all the Locations can be found at `Locations.Locations`.
-  `const location = findLocation(locationCoordinates)` -  find a Location by supplying the coordinates in the format: `{latitude: 31.5, longitude: -32.54}`. The numbers are degree decimals.<br /> For latitude, North is a positive number and South is a negative number.<br /> For longitude, West is a positive number, and East is a negative number.<br /> If no Location is found with those exact coordinates, the Location closest to the supplied coordinate is returned.

## The Sedra Object 
