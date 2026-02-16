import * as fs from 'fs';
import path from 'path';
import * as readline from 'readline';

const logsFolder = 'logs';

export const logsFolderPath = logsFolder + path.sep;

export function appendLogFile(fileName, line) {
  try {
    if (!fs.existsSync(logsFolder)) {
      fs.mkdirSync(logsFolder);
    }
  } catch (err) {
    console.error(err);
  }
  fs.appendFileSync(logsFolder + path.sep + fileName, `${line}\n`, 'utf8');
}

export function deleteLogFile(fileName) {
  const filePath = logsFolder + path.sep + fileName;
  if (fs.existsSync(filePath)) {
    fs.rm(filePath, (err) => {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(`File ${filePath} has been deleted successfully.`);
    });
  }
}

export function doesFileExist(fullPathToFile) {
  return fs.existsSync(fullPathToFile)
}

export function readLogFile(fileName) {
  const fileStream = fs.createReadStream(logsFolder + path.sep + fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  return rl;
}

export function readFileByDirectPath(fileName) {
  const fileStream = fs.createReadStream(fileName);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  return rl;
}

export function logToConsoleAndOutputFile(message, fileName) { // WORKS FINE FOR ARRAYS
  console.log(message);
  appendLogFile(fileName, message);
}

export function logMapToConsoleAndOutputFile(map, fileName) {
  console.log(map);
  for (const [key, value] of map) {
    appendLogFile(fileName, `${key} - ${value}`);
  }
}

export function logSetToConsoleAndOutputFile(set, fileName) { // WORKS FINE FOR ARRAYS
  console.log(set);
  for (const value of set) {
    appendLogFile(fileName, `${value}`);
  }
}

export function printToFileAndConsole(line) {
  const fileName = process.fileName;
  console.log(line);
  if (!fs.existsSync(logsFolder)) {
    fs.mkdirSync(logsFolder);
  }
  fs.appendFileSync(logsFolder + path.sep + fileName, `${line}\n`, 'utf8');
}

export function printMapToFileAndConsole(map) {
  const fileName = process.fileName;
  console.log(map);
  for (const [key, value] of map) {
    if (key.includes('-----')) {
      appendLogFile(fileName, '');
      appendLogFile(fileName, `${key}`); // do not print count for headers
      appendLogFile(fileName, '');
    } else {
      appendLogFile(fileName, `${key} - ${value}`);
    }
  }
}