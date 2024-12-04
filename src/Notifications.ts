import { Utils, DaysOfWeek, JewishMonthsNames as m } from "./Utils.js";
import jDate from "./JCal/jDate.js";
import Molad from "./JCal/Molad.js";
import PirkeiAvos from "./JCal/PirkeiAvos.js";
import ZmanimUtils from "./JCal/ZmanimUtils.js";
import Location from "./JCal/Location.js";
import { Time } from "./jcal-zmanim.js";

type DayInfo = {
  jdate: jDate;
  sdate: Date;
  month: number;
  day: number;
  dow: number;
  isAfterChatzosHayom: boolean;
  isAfterChatzosHalayla: boolean;
  isAfterAlos: boolean;
  isAfterShkia: boolean;
  isDaytime: boolean;
  isNightTime: boolean;
  isMorning: boolean;
  isAfternoon: boolean;
  isYomTov: boolean;
  isLeapYear: boolean;
  noTachnun: boolean;
  location: Location;
};
const dayNotes: string[] = [];
const tefillahNotes: string[] = [];
let showEnglish = false,
  dayInfo: DayInfo,
  showGaonShirShelYom = true,
  israel = true;

/**
 * Get shul notifications for the given date and location
 * @param date
 * @param time
 * @param location
 * @param english
 * @param showGaonShir
 * @param showDafYomi
 * @returns {{ dayNotes: string[], tefillahNotes: string[]}}
 */
export function getNotifications(
  date: jDate | Date,
  time: Time,
  location: Location,
  english: boolean,
  showGaonShir?: boolean,
  showDafYomi?: boolean
) {
  const { sdate, jdate } = Utils.bothDates(date);
  dayNotes.length = 0;
  tefillahNotes.length = 0;
  const month = jdate.Month,
    day = jdate.Day,
    dow = jdate.DayOfWeek,
    { chatzosHayom, chatzosHalayla, alos, shkia } = ZmanimUtils.getBasicShulZmanim(date, location),
    isAfterChatzosHayom = Utils.isTimeAfter(chatzosHayom, time),
    isAfterChatzosHalayla =
      typeof chatzosHalayla !== "undefined" &&
      (Utils.isTimeAfter(chatzosHalayla, time) || (chatzosHalayla.hour > 12 && time.hour < 12)), //Chatzos is before 0:00 and time is after 0:00
    isAfterAlos = Utils.isTimeAfter(alos, time),
    isAfterShkia = Utils.isTimeAfter(shkia, time),
    isDaytime = isAfterAlos && !isAfterShkia,
    isNightTime = !isDaytime,
    isNotBeinHasmashos = !isAfterShkia || Utils.isTimeAfter(Utils.addMinutes(shkia, 18), time),
    isMorning = isDaytime && !isAfterChatzosHayom,
    isAfternoon = isDaytime && isAfterChatzosHayom,
    isYomTov = jdate.isYomTovOrCholHamoed(location.Israel),
    isLeapYear = jDate.isJdLeapY(jdate.Year),
    noTachnun = isAfternoon && (dow === DaysOfWeek.FRIDAY || day === 29);

  dayInfo = {
    jdate,
    sdate,
    month,
    day,
    dow,
    isAfterChatzosHayom,
    isAfterChatzosHalayla,
    isAfterAlos,
    isAfterShkia,
    isDaytime,
    isNightTime,
    isMorning,
    isAfternoon,
    isYomTov,
    isLeapYear,
    noTachnun,
    location,
  };
  showEnglish = english;
  israel = location.Israel;
  showGaonShirShelYom = typeof showGaonShir === "undefined" ? israel : !!showGaonShir;

  if (dow === DaysOfWeek.SHABBOS) {
    getShabbosNotifications();
  } else {
    getWeekDayNotifications();
  }
  getAroundTheYearNotifications();

  if (dayInfo.noTachnun && isDaytime && !isYomTov) {
    if (dow !== DaysOfWeek.SHABBOS) {
      addTefillahNote("No Tachnun", 'א"א תחנון');
    } else if (isAfternoon) {
      addTefillahNote("No Tzidkascha", 'א"א צדקתך');
    } else if (
      !((month === m.NISSAN && day > 21) || month === m.IYAR || (month === m.SIVAN && day < 6))
    ) {
      addTefillahNote("No Av Harachamim", 'א"א אב הרחמים');
    }
  }
  if (showDafYomi !== false) {
    addDayNote(jdate.getDafYomi(), jdate.getDafyomiHeb());
  }

  //If it is after the earliest Nacht during Sefiras Ha'omer
  if (
    isNotBeinHasmashos &&
    ((month === m.NISSAN && day > 15) || month === m.IYAR || (month === m.SIVAN && day < 6))
  ) {
    const dayOfSefirah = jdate.getDayOfOmer();
    if (dayOfSefirah > 0) {
      addTefillahNote(Utils.getOmerNusach(dayOfSefirah, "ashkenaz"));
    }
  }

  //return only unique values
  return {
    dayNotes: [...new Set(dayNotes)],
    tefillahNotes: [...new Set(tefillahNotes)],
  };
}

function getShabbosNotifications() {
  const { month, day, isLeapYear, isMorning, isYomTov, jdate, isDaytime, isAfternoon } = dayInfo;
  if (month === m.NISSAN && day > 7 && day < 15) {
    addDayNote("Shabbos Hagadol", "שבת הגדול");
  } else if (month === m.TISHREI && day > 2 && day < 10) {
    addDayNote("Shabbos Shuva", "שבת שובה");
  } else if (month === m.AV && day > 2 && day < 10) {
    addDayNote("Shabbos Chazon", "שבת חזון");
  } else if (
    (month === (isLeapYear ? m.ADAR : m.SHVAT) && day > 24) ||
    (month === (isLeapYear ? m.ADAR_SHEINI : m.ADAR) && day === 1)
  ) {
    addDayNote("Parshas Shkalim", "פרשת שקלים");
  } else if (month === (isLeapYear ? m.ADAR_SHEINI : m.ADAR) && day > 7 && day < 14) {
    addDayNote("Parshas Zachor", "פרשת זכור");
  } else if (month === (isLeapYear ? m.ADAR_SHEINI : m.ADAR) && day > 16 && day < 24) {
    addDayNote("Parshas Parah", "פרשת פרה");
  } else if (
    (month === (isLeapYear ? m.ADAR_SHEINI : m.ADAR) && day > 23 && day < 30) ||
    (month === m.NISSAN && day === 1)
  ) {
    addDayNote("Parshas Hachodesh", "פרשת החודש");
  }
  if (isMorning && !isYomTov) {
    const sedra = jdate.getSedra(israel);
    if (sedra.sedras.length > 0) {
      addTefillahNote(
        `Kriyas Hatorah Parshas ${sedra.toString()}`,
        `קה"ת פרשת ${sedra.toStringHeb()}`
      );
    }
    //All months but Tishrei have Shabbos Mevarchim on the Shabbos before Rosh Chodesh
    if (month !== m.ELLUL && day > 22 && day < 30) {
      const nextMonth = jdate.addMonths(1);
      addTefillahNote(
        "The molad will be " + Molad.getString(nextMonth.Year, nextMonth.Month),
        "המולד יהיה ב" + Molad.getStringHeb(nextMonth.Year, nextMonth.Month)
      );
      addTefillahNote("Bircas Hachodesh", "מברכים החודש");
      //Rosh Chodesh Bentching during Sefira, we do say Av Harachamim
      if (month !== m.NISSAN && month !== m.IYAR) {
        addTefillahNote("No Av Harachamim", 'א"א אב הרחמים');
      }
    }
  }
  //Rosh Chodesh
  if (month !== m.TISHREI && (day === 1 || day === 30)) {
    addDayNote("Rosh Chodesh", "ראש חודש");
    addTefillahNote("Ya`aleh Viyavo", "יעלה ויבא");
    if (showGaonShirShelYom && isDaytime) {
      addTefillahNote("Barchi Nafshi", 'שיר של יום - קי"ד - ברכי נפשי');
    }
    //Rosh Chodesh Teves is during Chanuka
    if (isDaytime && month !== m.TEVES && !(month === m.KISLEV && day === 30)) {
      addTefillahNote("Chatzi Hallel", "חצי הלל");
    }
    addTefillahNote("No Av Harachamim", 'א"א אב הרחמים');
  } else if (isYomTov) {
    addTefillahNote("No Av Harachamim", 'א"א אב הרחמים');
    if (showGaonShirShelYom && isDaytime) {
      addTefillahNote("שיר של יום - מזמור שיר ליום השבת");
    }
  }
  //Kriyas Hatora - Shabbos by mincha - besides for Yom Kippur
  if (isAfternoon && !(month === m.TISHREI && day === 10)) {
    const sedra = jdate.addDays(1).getSedra(israel);
    addTefillahNote(
      "Kriyas Hatorah Mincha Parshas " + sedra.sedras[0].eng,
      'קה"ת במנחה פרשת ' + sedra.sedras[0].heb
    );
  }
  if (
    isAfternoon &&
    ((month === m.NISSAN && day > 21) ||
      (month <= m.ELLUL && !(month === m.AV && [8, 9].includes(day))))
  ) {
    const prakim = PirkeiAvos.getPrakim(jdate, israel);
    if (prakim.length > 0) {
      addDayNote(
        "Pirkei Avos - " +
          prakim.map((s: number) => `Perek ${Utils.toJewishNumber(s)}`).join(" and "),
        "פרקי אבות - " + prakim.map((s: number) => `פרק ${Utils.toJewishNumber(s)}`).join(" ו")
      );
    }
  }
}

function getWeekDayNotifications() {
  const {
    isNightTime,
    dow,
    isYomTov,
    month,
    day,
    isMorning,
    jdate,
    location,
    isDaytime,
    isAfternoon,
  } = dayInfo;

  //מוצאי שבת
  if (isNightTime && dow === DaysOfWeek.SUNDAY) {
    //הבדלה בתפילה for מוצאי שבת
    addTefillahNote(
      (month === m.NISSAN && day === 15) || (month === m.SIVAN && day === 6)
        ? "ותודיעינו"
        : "אתה חוננתנו"
    );
    //Motzai Shabbos before Yom Tov - no ויהי נועם
    if (
      (month === m.ELLUL && day > 22) ||
      (month === m.TISHREI && day > 4 && day < 22) ||
      (month === m.NISSAN && day > 8 && day < 15) ||
      (month === m.SIVAN && day < 6)
    ) {
      addTefillahNote("No Vihi Noam", 'א"א ויהי נועם');
    }
  }
  //אתה חוננתנו for מוצאי יו"ט
  else if (
    isNightTime &&
    ((month === m.NISSAN && (day === 16 || day === 22)) ||
      (month === m.SIVAN && day === 7) ||
      (month === m.TISHREI && [3, 11, 16, 23].includes(day)))
  ) {
    addTefillahNote("Ata Chonantanu", "אתה חוננתנו");
  }
  //Kriyas hatorah for monday and thursday
  //when it's not chol hamoed, chanuka, purim, a fast day or rosh chodesh
  if (
    isMorning &&
    !isYomTov &&
    (dow === DaysOfWeek.MONDAY || dow === DaysOfWeek.THURSDAY) &&
    !hasOwnKriyasHatorah(jdate, location)
  ) {
    const sedra = jdate.getSedra(israel);
    if (sedra.sedras.length > 0) {
      addTefillahNote(
        `Kriyas Hatorah Parshas ${sedra.sedras[0].eng}`,
        `קה"ת פרשת ${sedra.sedras[0].heb}`
      );
    }
  }
  //Rosh Chodesh
  if ((month !== m.TISHREI && day === 1) || day === 30) {
    dayInfo.noTachnun = true;
    addDayNote("Rosh Chodesh", "ראש חודש");
    addTefillahNote("Ya`aleh Viyavo", "יעלה ויבא");
    if (showGaonShirShelYom && isDaytime) {
      addTefillahNote("Barchi Nafshi", 'שיר של יום - קי"ד - ברכי נפשי');
    }
    //Rosh Chodesh Teves is during Chanuka
    if (isDaytime && month !== m.TEVES && !(month === m.KISLEV && day === 30)) {
      addTefillahNote("Chatzi Hallel", "חצי הלל");
      if (isMorning && dow !== DaysOfWeek.SHABBOS) {
        noLaminatzeach();
      }
    }
  }
  //Yom Kippur Kattan
  else if (
    month !== m.ELLUL &&
    ((dow < DaysOfWeek.FRIDAY && day === 29) || (dow === DaysOfWeek.THURSDAY && day === 28)) &&
    isAfternoon
  ) {
    addTefillahNote("Yom Kippur Kattan", 'יו"כ קטן');
  }
  if (jdate.hasEiruvTavshilin(israel)) {
    addDayNote("Eruv Tavshilin", "עירוב תבשילין");
  }
}

function getAroundTheYearNotifications() {
  const {
    month,
    day,
    isNightTime,
    dow,
    isAfternoon,
    isDaytime,
    isMorning,
    isAfterChatzosHalayla,
    jdate,
    sdate,
    isLeapYear,
    location,
  } = dayInfo;

  /**
   * A flag indicating whether to show "V'sain Tal U'Matar" in Chutz La'aretz.
   * If the Jewish year is divisible by 4, then it is said from the 6th of December.
   * Otherwise it is said from the 5th of December.
   */
  let showVsainTalUmatarInChul = false;

  if (!location.Israel && sdate.getMonth() === 11 && sdate.getDate() > 4) {
    const startVsainTalUmatar = jdate.Year % 4 === 0 ? 6 : 5;
    showVsainTalUmatarInChul =
      sdate.getDate() >= startVsainTalUmatar && sdate.getDate() <= startVsainTalUmatar + 14;
  }

  switch (month) {
    case m.NISSAN:
      dayInfo.noTachnun = true;
      if (day > 15) {
        addTefillahNote("Morid Hatal", "מוריד הטל");
      }
      if (dow !== DaysOfWeek.SHABBOS && day > 15 && day !== 21) {
        addTefillahNote("Vesain Bracha", "ותן ברכה");
      }
      if (isMorning && dow !== DaysOfWeek.SHABBOS && [14, 16, 17, 18, 19, 20].includes(day)) {
        addTefillahNote("No Mizmor Lesodah", 'א"א מזמור לתודה');
        if (dow !== DaysOfWeek.SHABBOS) {
          noLaminatzeach();
        }
      }
      if (day === 15) {
        addDayNote("First Day of Pesach", 'יו"ט ראשון של פסח');
        addTefillahNote("Full Hallel", "הלל השלם");
        if (isAfternoon) {
          addTefillahNote("Morid Hatal", "מוריד הטל");
        }
        if (showGaonShirShelYom && isDaytime && dow !== DaysOfWeek.SHABBOS) {
          addTefillahNote('שיר של יום - קי"ד - בצאת ישראל');
        }
        addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
      } else if (day === 16 && !israel) {
        addDayNote("Second Day of Pesach", 'יו"ט שני של פסח');
        addTefillahNote("Full Hallel", "הלל השלם");
        addTefillahNote("Morid Hatal", "מוריד הטל");
        if (showGaonShirShelYom && isDaytime && dow !== DaysOfWeek.SHABBOS) {
          addTefillahNote('שיר של יום - קי"ד - בצאת ישראל');
        }
        addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
      } else if ([16, 17, 18, 19, 20, 21].includes(day)) {
        if (day === 21) {
          addDayNote("Shvi`i Shel Pesach", "שביעי של פםח");
          if (isDaytime) {
            if (israel) {
              addTefillahNote("Yizkor", "יזכור");
            }
            if (showGaonShirShelYom && dow !== DaysOfWeek.SHABBOS) {
              addTefillahNote("שיר של יום - י\"ח - למנצח לעבד ה'");
            }
          }
        } else {
          addDayNote("Chol Ha`moed Pesach", "פסח - חול המועד");
          addTefillahNote("Ya`aleh Viyavo", "יעלה ויבא");
          if (isMorning && dow !== DaysOfWeek.SHABBOS) noLaminatzeach();
          if (showGaonShirShelYom && isDaytime && dow !== DaysOfWeek.SHABBOS) {
            switch (day) {
              case 16:
                if (dow === DaysOfWeek.SUNDAY) {
                  addTefillahNote('שיר של יום - קי"ד - בצאת ישראל');
                } else {
                  addTefillahNote('שיר של יום - ע"ח - משכיל לאסף');
                }
                break;
              case 17:
                if (dow === DaysOfWeek.MONDAY) {
                  addTefillahNote('שיר של יום - ע"ח - משכיל לאסף');
                } else {
                  addTefillahNote("שיר של יום - פ' - למנצח אל שושנים");
                }
                break;
              case 18:
                if (dow === DaysOfWeek.TUESDAY || dow === DaysOfWeek.SUNDAY) {
                  addTefillahNote("שיר של יום - פ' - למנצח אל שושנים");
                } else {
                  addTefillahNote("שיר של יום - ק\"ה - הודו לה'");
                }
                break;
              case 19:
                if (dow === DaysOfWeek.THURSDAY) {
                  addTefillahNote('שיר של יום - קל"ה - הללוי-ה הללו את שם');
                } else {
                  addTefillahNote("שיר של יום - ק\"ה - הודו לה'");
                }
                break;
              case 20:
                if (dow === DaysOfWeek.FRIDAY) {
                  addTefillahNote('שיר של יום - ס"ו - למנצח שיר מזמור');
                } else {
                  addTefillahNote('שיר של יום - קל"ה - הללוי-ה הללו את שם');
                }
                break;
            }
          }
        }
        if (isDaytime) addTefillahNote("Half Hallel", "חצי הלל");
        addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
      }
      if (day === 22) {
        if (israel) {
          addDayNote("Isru Chag", "איסרו חג");
        } else {
          addDayNote("Acharon Shel Pesach", "אחרון של פסח");
          if (isDaytime) {
            addTefillahNote("Yizkor", "יזכור");
            addTefillahNote("Half Hallel", "חצי הלל");
          }
          addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
        }
        if (dow !== DaysOfWeek.SHABBOS && isMorning) {
          noLaminatzeach();
        }
      }
      if (
        dow === DaysOfWeek.SHABBOS &&
        ([15, 16, 17, 18, 19, 20, 21].includes(day) || (!israel && day === 22))
      ) {
        addTefillahNote("Shir Hashirim", "מגילת שיר השירים");
      }
      break;
    case m.IYAR:
      if (day <= 15) {
        addTefillahNote("Morid Hatal", "מוריד הטל");
        if (dow !== DaysOfWeek.SHABBOS) {
          addTefillahNote("V`sain Bracha", "ותן ברכה");
        }
      }
      //Pesach Sheini and Lag Ba'Omer
      if (day === 14 || (day === 13 && isAfternoon) || day === 18 || (day === 17 && isAfternoon)) {
        dayInfo.noTachnun = true;
        if (day === 14) {
          addDayNote("Pesach Sheini", "פסח שני");
        }
      }
      //Baha"b
      if (
        isMorning &&
        ((dow === DaysOfWeek.MONDAY && day > 3 && day < 13) ||
          (dow === DaysOfWeek.THURSDAY && day > 6 && day < 14) ||
          (dow === DaysOfWeek.MONDAY && day > 10 && day < 18 && day !== 14))
      ) {
        addTefillahNote("Ba`hab", 'סליחות בה"ב');
        addTefillahNote("Avinu Malkeinu", "אבינו מלכנו");
      }
      break;
    case m.SIVAN:
      if (day < 13) {
        dayInfo.noTachnun = true;
      }

      if (day === 6) {
        addDayNote("Shavuos", "יום טוב של שבועות");
        if (isDaytime) {
          addTefillahNote("Full Hallel", "הלל השלם");
          addTefillahNote("Megilas Rus", "מגילת רות");
          addTefillahNote("Akdamus", "אקדמות");
          if (israel) addTefillahNote("Yizkor", "יזכור");
          if (showGaonShirShelYom) {
            addTefillahNote('שיר של יום - י"ט - ..השמים מספרים..');
          }
        }
        addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
      } else if (day === 7) {
        if (israel) {
          addDayNote("Issru Chag", "איסרו חג");
          if (isMorning && dow !== DaysOfWeek.SHABBOS) {
            noLaminatzeach();
          }
        } else {
          addDayNote("Shavuos Second Day", "יום טוב של שבועות");
          if (isDaytime) {
            addTefillahNote("Full Hallel", "הלל השלם");
            addTefillahNote("Yizkor", "יזכור");
          }
          addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
        }
      }

      break;
    case m.TAMUZ:
      if (
        isDaytime &&
        ((day === 17 && DaysOfWeek.SHABBOS !== 6) || (day === 18 && dow === DaysOfWeek.SUNDAY))
      ) {
        if (isDaytime) {
          addDayNote("Shiva Asar B`Tamuz", 'י"ז בתמוז');
          addTefillahNote("Avinu Malkeinu", "אבינו מלכנו");
          addTefillahNote("Aneinu", "עננו");
        }
        if (isMorning) {
          addTefillahNote("Selichos", "סליחות");
        }
      }
      break;
    case m.AV:
      if (isAfternoon && day === 8 && dow !== DaysOfWeek.FRIDAY) {
        dayInfo.noTachnun = true;
      } else if (
        (day === 9 && dow !== DaysOfWeek.SHABBOS) ||
        (day === 10 && dow === DaysOfWeek.SUNDAY)
      ) {
        addDayNote("Tish B`Av", "תשעה באב");
        if (isDaytime) {
          addTefillahNote("Kinos", "קינות");
          addTefillahNote("Aneinu", "עננו");
          if (isMorning && dow !== DaysOfWeek.SHABBOS) {
            noLaminatzeach();
          }
        } else {
          addTefillahNote("Megilas Eicha", "מגילת איכה");
          if (isNightTime && dow === DaysOfWeek.SUNDAY) {
            addTefillahNote("No Vihi Noam", 'א"א ויהי נועם');
          }
        }
        dayInfo.noTachnun = true;
      } else if (isAfternoon && day === 14) {
        dayInfo.noTachnun = true;
      } else if (day === 15) {
        addDayNote("Tu B`Av", 'ט"ו באב');
        dayInfo.noTachnun = true;
      }
      break;
    case m.ELLUL:
      addTefillahNote("L`Dovid Hashem Ori", "לדוד ה");
      if (day > 20 && dow !== DaysOfWeek.SHABBOS && (isAfterChatzosHalayla || isMorning)) {
        let startedSelichos = day >= 26;
        if (day < 26) {
          const daysToRH = 30 - day,
            dowRH = (daysToRH + dow) % 7;
          switch (dowRH) {
            case DaysOfWeek.MONDAY:
              startedSelichos = day >= 22;
              break;
            case DaysOfWeek.TUESDAY:
              startedSelichos = day >= 21;
              break;
            case DaysOfWeek.SHABBOS:
              startedSelichos = day >= 24;
              break;
          }
        }
        if (startedSelichos) {
          addTefillahNote("Selichos", "סליחות");
        }
      }
      if (day === 29) {
        dayInfo.noTachnun = true;
      }
      break;
    case m.TISHREI:
      if (day < 11) {
        addTefillahNote("Hamelech Hakadosh", "המלך הקדוש");
        if (dow !== DaysOfWeek.SHABBOS && day !== 9) {
          addTefillahNote("Avinu Malkeinu", "אבינו מלכנו");
        }
      }
      //Days of Rosh Hashana, Tzom Gedaliah and Yom Kippur are dealt with individually below.
      if (day > 4 && day < 10 && dow !== DaysOfWeek.SHABBOS) {
        addTefillahNote("Selichos", "סליחות");
        addTefillahNote("Hamelech Hamishpat", "המלך המשפט");
      }
      if (dow === DaysOfWeek.SHABBOS && day > 2 && day < 10) {
        addDayNote("Shabbos Shuva", "שבת שובה");
      }
      if (day >= 10) {
        dayInfo.noTachnun = true;
      }
      switch (day) {
        case 1:
          addDayNote("Rosh Hashana", "ראש השנה");
          if (dow !== DaysOfWeek.SHABBOS && isDaytime) {
            addTefillahNote("Tekias Shofar", "תקיעת שופר");
            if (showGaonShirShelYom) {
              addTefillahNote('שיר של יום - פ"א - למנצח על הגתית');
            }
            if (isAfternoon) {
              addDayNote("Tashlich", "תשליך");
            }
          }
          addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
          break;
        case 2:
          addDayNote("Rosh Hashana", "ראש השנה");
          if (isDaytime) {
            addTefillahNote("Tekias Shofar", "תקיעת שופר");
            if (showGaonShirShelYom) {
              addTefillahNote('שיר של יום - פ"א - למנצח על הגתית');
            }
            if (dow === DaysOfWeek.SUNDAY && isAfternoon) {
              addDayNote("Tashlich", "תשליך");
            }
          }
          addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
          break;
        case 3:
          if (dow !== DaysOfWeek.SHABBOS) {
            if (isDaytime) {
              addDayNote("Fast of Tzom Gedalya", "צום גדליה");
              addTefillahNote("Aneinu", "עננו");
            }
            if (isAfterChatzosHalayla || isMorning) {
              addTefillahNote("Selichos", "סליחות");
            }
            addTefillahNote("Hamelech Hamishpat", "המלך המשפט");
          }
          break;
        case 4:
          if (dow === DaysOfWeek.SUNDAY) {
            if (isDaytime) {
              addDayNote("Fast of Tzom Gedalya", "צום גדליה");
              addTefillahNote("Aneinu", "עננו");
            }
            if (isAfterChatzosHalayla || isMorning) {
              addTefillahNote("Selichos", "סליחות");
            }
            addTefillahNote("Hamelech Hamishpat", "המלך המשפט");
          } else if (dow !== DaysOfWeek.SHABBOS) {
            addTefillahNote("Hamelech Hamishpat", "המלך המשפט");
            if (isAfterChatzosHalayla || isMorning) {
              addTefillahNote("Selichos", "סליחות");
            }
          }
          break;
        case 9:
          addDayNote("Erev Yom Kippur", "ערב יום כיפור");
          if (isMorning) {
            addTefillahNote("No Mizmor L`Sodah", 'א"א מזמור לתודה');
            if (dow !== DaysOfWeek.SHABBOS) {
              noLaminatzeach();
            }
            if (dow === DaysOfWeek.FRIDAY) {
              addTefillahNote("Avinu Malkeinu", "אבינו מלכנו");
            }
          } else if (isAfternoon) {
            addTefillahNote("Vidduy", "ודוי בעמידה");
          }
          if (isDaytime && dow !== DaysOfWeek.FRIDAY) {
            addTefillahNote("No Avinu Malkeinu", 'א"א אבינו מלכנו');
          }
          dayInfo.noTachnun = true;
          break;
        case 10:
          addDayNote("Yom Kippur", "יום הכיפורים");
          addDayNote("לפני ה' תטהרו");
          if (isDaytime) {
            addTefillahNote("Yizkor", "יזכור");
            if (showGaonShirShelYom && dow !== DaysOfWeek.SHABBOS) {
              addTefillahNote('שיר של יום - ל"ב - לדוד משכיל');
            }
          }
          if (isAfternoon) {
            //only Yom Kippur has its own Kriyas Hatorah
            addTefillahNote('קה"ת במנחה סוף פרשת אח"מ');
          }
          break;
        case 11:
          if (isNightTime) {
            addDayNote("לך אכל בשמחה לחמך כי כבר רצה האלקים את מעשיך");
          }
        case 15:
          addDayNote("First day of Sukkos", 'יו"ט ראשון של סוכות');
          addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
          if (isDaytime) {
            addTefillahNote("Full Hallel", "הלל השלם");
            if (dow !== DaysOfWeek.SHABBOS) {
              addTefillahNote("Hoshanos - למען אמתך", "הושענות - למען אמתך");
              addTefillahNote("Kah Keli", "קה קלי");
              if (showGaonShirShelYom) {
                addTefillahNote('שיר של יום - ע"ו - למנצח בנגינות מזמור');
              }
            } else {
              addTefillahNote("Hoshanos - אום נצורה", "הושענות - אום נצורה");
            }
          }
          break;
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
          addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
          if (day === 16 && !israel) {
            addDayNote("Second day of Sukkos", "סוכות - יום טוב שני");
          } else if (!israel) {
            addDayNote("Chol Hamoed Sukkos", "סוכות - חול המועד");
            addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
          }
          if (isDaytime) {
            addTefillahNote("Full Hallel", "הלל השלם");
            switch (day) {
              case 16:
                addTefillahNote(
                  "הושענות - " + (dow === DaysOfWeek.SUNDAY ? "למען אמתך" : "אבן שתיה")
                );
                if (showGaonShirShelYom && dow !== DaysOfWeek.SHABBOS) {
                  addTefillahNote("שיר של יום - כ\"ט - ..הבו לה' בני אלים");
                }
                break;
              case 17:
                addTefillahNote(
                  (showEnglish ? "Hoshanos" : "הושענות") +
                    " - " +
                    (dow === DaysOfWeek.SHABBOS ? "אום נצורה" : "אערוך שועי")
                );
                if (showGaonShirShelYom && dow !== DaysOfWeek.SHABBOS) {
                  addTefillahNote("שיר של יום - נ' - מזמור לאסף");
                }
                break;
              case 18:
                if (dow === DaysOfWeek.SUNDAY) {
                  addTefillahNote((showEnglish ? "Hoshanos" : "הושענות") + " - " + "אערוך שועי");
                  if (showGaonShirShelYom) {
                    addTefillahNote("שיר של יום - נ' - מזמור לאסף");
                  }
                } else {
                  if (dow === DaysOfWeek.TUESDAY) {
                    addTefillahNote((showEnglish ? "Hoshanos" : "הושענות") + " - " + "אבן שתיה");
                  } else if (dow === DaysOfWeek.THURSDAY) {
                    addTefillahNote(
                      (showEnglish ? "Hoshanos" : "הושענות") + " - " + "אום אני חומה"
                    );
                  } else if (dow === DaysOfWeek.FRIDAY) {
                    addTefillahNote((showEnglish ? "Hoshanos" : "הושענות") + " - " + "א-ל למושעות");
                  }
                  if (showGaonShirShelYom && dow !== DaysOfWeek.SHABBOS) {
                    addTefillahNote('שיר של יום - צ"ד - ..מי יקום לי..');
                  }
                }
                break;
              case 19:
                addTefillahNote(
                  (showEnglish ? "Hoshanos" : "הושענות") +
                    " - " +
                    (dow === DaysOfWeek.SHABBOS ? "אום נצורה" : "א-ל למושעות")
                );
                if (showGaonShirShelYom && dow !== DaysOfWeek.SHABBOS) {
                  if (dow === DaysOfWeek.MONDAY) {
                    addTefillahNote('שיר של יום - צ"ד - ..מי יקום לי..');
                  } else {
                    addTefillahNote('שיר של יום - צ"ד - א-ל נקמות.. ישרי לב');
                  }
                }
                break;
              case 20:
                addTefillahNote(
                  (showEnglish ? "Hoshanos" : "הושענות") +
                    " - " +
                    (dow === DaysOfWeek.SHABBOS ? "אום נצורה" : "אדון המושיע")
                );
                if (showGaonShirShelYom && dow !== DaysOfWeek.SHABBOS) {
                  if (dow === DaysOfWeek.THURSDAY) {
                    addTefillahNote('שיר של יום - פ"א - למנצח על הגתית');
                  } else {
                    addTefillahNote('שיר של יום - צ"ד - א-ל נקמות.. ישרי לב');
                  }
                }
                break;
            }
          }
          break;
        case 21:
          addDayNote("Hoshana Raba", "הושעה רבה");
          addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
          if (isNightTime) {
            addTefillahNote("Mishneh Torah", "משנה תורה");
          } else {
            addTefillahNote("Hoshanos", "הושענות");
            addTefillahNote("Full Hallel", "הלל השלם");
            if (showGaonShirShelYom) {
              if (dow === DaysOfWeek.FRIDAY) {
                addTefillahNote('שיר של יום - פ"ב - מזמור לאסף');
              } else {
                addTefillahNote('שיר של יום - פ"א - למנצח על הגתית');
              }
            }
          }
          break;
        case 22:
          addDayNote("Shmini Atzeres", "שמיני עצרת");
          addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
          if (israel) {
            addDayNote("Simchas Torah", "שמחת תורה");
            addTefillahNote("Hakafos", "הקפות");
          }
          if (isDaytime) {
            addTefillahNote("Full Hallel", "הלל השלם");
            addTefillahNote("Yizkor", "יזכור");
            addTefillahNote("Tefilas Geshem", "תפילת גשם");
            addTefillahNote("משיב הרוח ומוריד הגשם");
            if (showGaonShirShelYom && dow !== DaysOfWeek.SHABBOS) {
              addTefillahNote('שיר של יום - י"ב - למנצח על השמינית');
            }
          }
          break;
      }
      if (day === 23) {
        if (!israel) {
          addDayNote("Simchas Torah", "שמחת תורה");
          addTefillahNote("Ya`aleh V`yavo", "יעלה ויבא");
          addTefillahNote("Hakafos", "הקפות");
          addTefillahNote("Full Hallel", "הלל השלם");
        } else {
          addDayNote("Issru Chag", "איסרו חג");
          if (isNightTime) {
            addDayNote("א גוטען ווינטער", "חורף טוב");
          } else if (dow !== DaysOfWeek.SHABBOS && isMorning) {
            noLaminatzeach();
          }
        }
      } else if (dow === DaysOfWeek.SHABBOS && [15, 17, 18, 19, 20].includes(day)) {
        addTefillahNote("Megilas Koheles", "מגילת קהלת");
      }
      if (day < 22) {
        addTefillahNote("L`Dovid Hashem Ori", "לדוד ה");
      } else if (day > 22) {
        addTefillahNote("Mashiv Haruach U`Morid Hageshem", "משיב הרוח ומוריד הגשם");
      }
      break;
    case m.CHESHVAN:
      if (
        isDaytime &&
        ((dow === DaysOfWeek.MONDAY && day > 3 && day < 13) ||
          (dow === DaysOfWeek.THURSDAY && day > 6 && day < 14) ||
          (dow === DaysOfWeek.MONDAY && day > 10 && day < 18))
      ) {
        addTefillahNote("Ba`Hab", 'סליחות בה"ב');
        addTefillahNote("Avinu Malkeinu", "אבינו מלכנו");
      }
      if (day <= 22) {
        addTefillahNote("Mashiv Haruach U`Morid Hageshem", "משיב הרוח ומוריד הגשם");
      }
      if (
        ((location.Israel && day >= 7) || (!location.Israel && showVsainTalUmatarInChul)) &&
        dow !== DaysOfWeek.SHABBOS
      ) {
        addTefillahNote("V`sain Tal U`matar", "ותן טל ומטר");
      }
      break;
    case m.KISLEV:
      if (
        ((location.Israel && day <= 7) || (!location.Israel && showVsainTalUmatarInChul)) &&
        dow !== DaysOfWeek.SHABBOS
      ) {
        addTefillahNote("V`sain Tal U`matar", "ותן טל ומטר");
      } else if (day === 24 && dow !== DaysOfWeek.SHABBOS && isAfternoon) {
        dayInfo.noTachnun = true;
      } else if (day >= 25) {
        dayInfo.noTachnun = true;
        addDayNote("Chanukah", "חנוכה");
        addTefillahNote("Al Hanissim", "על הניסים");
        if (isDaytime) {
          addTefillahNote("Full Hallel", "הלל השלם");
          if (isMorning && dow !== DaysOfWeek.SHABBOS) noLaminatzeach();
          if (showGaonShirShelYom && day !== 30 && dow !== DaysOfWeek.SHABBOS) {
            addTefillahNote("שיר של יום - ל' - מזמור שיר חנוכת הבית");
          }
        }
      }
      break;
    case m.TEVES:
      if (!location.Israel && showVsainTalUmatarInChul && dow !== DaysOfWeek.SHABBOS) {
        addTefillahNote("V`sain Tal U`matar", "ותן טל ומטר");
      }
      if (day <= (jDate.isShortKislev(jdate.Year) ? 3 : 2)) {
        dayInfo.noTachnun = true;
        addDayNote("Chanukah", "חנוכה");
        addTefillahNote("Al Hanissim", "על הניסים");
        if (isDaytime) {
          addTefillahNote("Full Hallel", "הלל השלם");
          if (isMorning && dow !== DaysOfWeek.SHABBOS) {
            noLaminatzeach();
            if (day !== 1 && showGaonShirShelYom) {
              addTefillahNote("שיר של יום - ל' - מזמור שיר חנוכת הבית");
            }
          }
        }
      } else if (day === 10 && isDaytime) {
        addDayNote("Fast of Asara B`Teves", "עשרה בטבת");
        if (isMorning) {
          addTefillahNote("Selichos", "סליחות");
        }
        addTefillahNote("Avinu Malkeinu", "אבינו מלכנו");
        addTefillahNote("Aneinu", "עננו");
      }
      break;
    case m.SHVAT:
      if (day === 14 && isAfternoon) dayInfo.noTachnun = true;
      if (day === 15) {
        dayInfo.noTachnun = true;
        addDayNote("Tu B`Shvat", 'ט"ו בשבט');
      }
      break;
    case m.ADAR:
    case m.ADAR_SHEINI:
      if (month === m.ADAR && isLeapYear) {
        //Adar Rishon in a leap year
        if (day === 13 && isAfternoon) dayInfo.noTachnun = true;
        if ([14, 15].includes(day)) {
          addDayNote(
            day === 14
              ? showEnglish
                ? "Purim Katan"
                : "פורים קטן"
              : showEnglish
              ? "Shushan Purim Katan"
              : "שושן פורים קטן"
          );
          if (isDaytime) {
            dayInfo.noTachnun = true;
            if (isMorning && dow !== DaysOfWeek.SHABBOS) {
              noLaminatzeach();
            }
          }
        }
      } else {
        //The "real" Adar: the only one in a non-leap-year or Adar Sheini
        if (
          isDaytime &&
          ((day === 11 && dow === DaysOfWeek.THURSDAY) ||
            (day === 13 && dow !== DaysOfWeek.SHABBOS))
        ) {
          if (isMorning) {
            addDayNote("Fast of Ta`anis Esther", "תענית אסתר");
            addTefillahNote("Selichos", "סליחות");
          }
          addTefillahNote("Avinu Malkeinu", "אבינו מלכנו");
          addTefillahNote("Aneinu", "עננו");
        } else {
          //Only ירושלים says על הניסים on ט"ו
          const isYerushalayim = location.Name === "Jerusalem" || location.NameHebrew === "ירושלים";
          if (day === 14) {
            dayInfo.noTachnun = true;
            if (isMorning && dow !== DaysOfWeek.SHABBOS) {
              noLaminatzeach();
            }
            //On a Purim Meshulash in Yerushalayim, מגילת אסתר is on י"ד
            if (!isYerushalayim || dow === DaysOfWeek.FRIDAY) {
              addDayNote("Megilas Esther", "מגילת אסתר");
              if (!isYerushalayim) {
                addDayNote("Purim", "פורים");
                addTefillahNote("Al Hanissim", "על הניסים");
                if (showGaonShirShelYom) {
                  addTefillahNote('שיר של יום - כ"ב - למנצח על אילת השחר');
                }
              } else {
                //On a Purim Meshulash in Yerushalayim, מתנות לאביונים is on י"ד
                addDayNote("Matanos LeEvyonim", "מתנות לאביונים");
              }
            } else {
              addDayNote("Purim D`Prazim", "פורים דפרזים");
            }
          } else if (day === 15) {
            dayInfo.noTachnun = true;
            if (isMorning && dow !== DaysOfWeek.SHABBOS) {
              noLaminatzeach();
            }
            if (isYerushalayim) {
              addDayNote("Purim", "פורים");
              addTefillahNote("Al Hanissim", "על הניסים");
              if (dow !== DaysOfWeek.SHABBOS) {
                addDayNote("Megilas Esther", "מגילת אסתר");
              }
              if (showGaonShirShelYom && isDaytime && dow !== DaysOfWeek.SHABBOS) {
                addTefillahNote('שיר של יום - כ"ב - למנצח על אילת השחר');
              }
            } else if (
              [
                "טבריה",
                "יפו",
                "עכו",
                "צפת",
                "באר שבע",
                "חיפה",
                "באר שבע",
                "בית שאן",
                "לוד",
              ].includes(location.Name)
            ) {
              addDayNote("Purim D`Mukafin", "פורים דמוקפין");
              if (dow !== DaysOfWeek.SHABBOS) {
                addDayNote("(Megilas Esther)", "(מגילת אסתר)");
              }
            } else {
              addDayNote("Shushan Purim", "שושן פורים");
            }
          } else if (day === 16 && isYerushalayim && dow === DaysOfWeek.SUNDAY) {
            addDayNote("Purim Seuda and Mishloach Manos", "סעודת פורים ומשלוח מנות");
          }
        }
      }
      break;
  }
}

function noLaminatzeach() {
  addTefillahNote("No Laminatzeach", 'א"א למנצח');
}

function addDayNote(englishOrDefaultText: string, hebrewText?: string) {
  const note = showEnglish || !hebrewText ? englishOrDefaultText : hebrewText;
  if (!dayNotes.includes(note)) {
    dayNotes.push(note);
  }
}

function addTefillahNote(englishOrDefaultText: string, hebrewText?: string) {
  const note = showEnglish || !hebrewText ? englishOrDefaultText : hebrewText;
  if (!tefillahNotes.includes(note)) {
    tefillahNotes.push(note);
  }
}

function hasOwnKriyasHatorah(jdate: jDate, location: Location) {
  const { Month, Day, DayOfWeek } = jdate;
  //Rosh chodesh
  if (Day === 1 || Day === 30) {
    return true;
  }
  switch (Month) {
    case 1:
      return Day > 14 && Day < 22;
    case 4:
      return Day === 17 || (DayOfWeek === 0 && Day === 18);
    case 5:
      return Day === 9 || (DayOfWeek === 0 && Day === 10);
    case 7:
      return [3, 16, 17, 18, 19, 20, 21].includes(Day) || (DayOfWeek === 0 && Day === 4);
    case 9:
      return Day >= 25;
    case 10:
      return Day === 10 || Day < 3 || (Day === 3 && jDate.isShortKislev(jdate.Year));
    case 12:
    case 13:
      return (
        Month === (jDate.isJdLeapY(jdate.Year) ? m.ADAR_SHEINI : m.ADAR) &&
        (Day === 13 || Day === (location.Name === "ירושלים" ? 15 : 14))
      );
    default:
      return false;
  }
}
