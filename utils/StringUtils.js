import { printToFileAndConsole } from "./FileUtils";

export function getDateAndTime() {
  // return (new Date()).toLocaleString().replace(/(:|\/)/g, '-').replace(/,/g, '').replace(/\s/g, '_');
  // '2024-01-30T00:17:12.782Z'
  // (new Date()).toLocaleDateString() // '1/29/2024'
  // (new Date()).toTimeString() //'16:29:47 GMT-0800 (Pacific Standard Time)'
  const date = (new Date()).toLocaleDateString().replace(/\//g, '_');
  const time = (new Date()).toTimeString().split(' ')[0].replace(/:/g, '_');
  return date + '_' + time;
}

export function textIncludesWords(text, arrayOfWords) {
  for (let stopWord of arrayOfWords) {
    if (text.toLowerCase().includes(stopWord.toLowerCase())) {
      // printToFileAndConsole( `text contains - ${stopWord}`);
      return true;
    }
  }
  return false;
}

export function whichStopWordFound(text, arrayOfWords) {
  for (let stopWord of arrayOfWords) {
    if (text.toLowerCase().includes(stopWord.toLowerCase())) {
      return stopWord;
    }
  }
  return 'no stop words found';
}

export function isAlreadyIncluded(item, collection) {
  const parts = item.split(" --- ");
  const companyAndPosition = parts[0] + " --- " + parts[1];
  for (let job of collection) {
    if (job.includes(companyAndPosition)) {
      printToFileAndConsole(`${job} contains stop phrase ${companyAndPosition}`);
      return true;
    }
  }
  return false;
}