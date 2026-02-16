import { printToFileAndConsole } from "./FileUtils";
import { textIncludesWords, whichStopWordFound } from "./StringUtils";


export async function excludeByJDStopWords(jd, descriptionStopWordsArray, job, jobsSet) {
  const page = process.playwrightPage;
  if (textIncludesWords(jd, descriptionStopWordsArray)) {
    const foundStopWord = whichStopWordFound(jd, descriptionStopWordsArray);
    printToFileAndConsole(`   >>>>> found stop word in jd: ${foundStopWord}`);
    if (!process.jobsExcludedByJD.includes(job)) {
      process.jobsExcludedByJD.push(job);
    }
    jobsSet.delete(job);
  }
}