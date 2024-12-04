import {jDate, findLocation, Utils} from "./dist/index.cjs";

const today = jDate.now();

const betar = findLocation("Beitar Illit");

//Acquire the sunrise and sunset times for this date in Dallas
const { sunrise, sunset } = today.getSunriseSunset(betar);

//Print it out nicely formatted to the console
console.log(
  `In ${betar.Name} on ${today.toString()}, Sunrise is at ${Utils.getTimeString(sunrise)}, and Sunset is at ${Utils.getTimeString(sunset)}`,
);