import { jDate, findLocation, Utils } from "./dist/index.cjs";

const today = jDate.now().addYears(-1);

const betar = findLocation("Jerusalem");

//Acquire the sunrise and sunset times for this date in Dallas
const { sunrise, sunset } = today.getSunriseSunset(betar, false);

//Print it out nicely formatted to the console
console.log(
  `In ${betar.Name} on ${today.toString()}, Sunrise is at ${Utils.getTimeString(sunrise)}, and Sunset is at ${Utils.getTimeString(sunset)}`,
);
/**
  
let totalOld = 0;
let totalNew = 0;
let start = new Date().valueOf();
for (var j = 0; j < 1000; j++) {
  for (var i = 4000; i < 5000; i++) {
   totalOld += jDate.tDays(i);
  }
}
let end = new Date().valueOf();
let diff = end - start;
console.log(`old: ${diff}`);

start = new Date().valueOf();
for (var j = 0; j < 1000; j++) {
  for (var i = 5000; i < 6000; i++) {
   totalNew += jDate.tDays(i);   
  }
}
end = new Date().valueOf();
diff = end - start;
console.log(`new: ${diff}`);



/*if (jDate.isLongCheshvan(i) !== jDate.isLongCheshvan_(i)) {
  console.log(`Year: ${i} CODE: ${jDate.yearType(i).code} isLongCheshvan: ${jDate.isLongCheshvan(i)} isLongCheshvan_: ${jDate.isLongCheshvan_(i)}`)
}
if (jDate.isShortKislev(i) !== jDate.isShortKislev_(i)) {
  console.log(`Year: ${i} CODE: ${jDate.yearType(i).code} isShortKislev: ${jDate.isShortKislev(i)} isShortKislev_: ${jDate.isShortKislev_(i)}`)
}*/
//console.log(jDate.daysJYear_(4000))*/
