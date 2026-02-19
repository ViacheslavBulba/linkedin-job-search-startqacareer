import { test } from '@playwright/test';

import { Job_Descriptions_QA_Stop_Words } from '../configs/Job_Descriptions_QA_StopWords.js';
import { Job_Names_QA_Stop_Words } from '../configs/Job_Names_QA_StopWordsAndExcludedJobs.js';
import { LOCATION, datePostedFilter, JDPartsToInclude, JOB_LOCATION_TYPES, JobNamePartsToInclude, JobNamesToSearch, pageLimitToSearch, FIND_REMOTE_ONLY } from '../configs/QAJobSearchConfig.js';
import { linkedInCollectJobsAfterFiltersApplied, linkedInEnterLocation, linkedInEnterPosition, linkedInLogin, linkedInOpenEachPosition, linkedInSetUpFilters, printOutFinalResults, restrictContractPositions } from '../pages/LinkedIn.js';
import { printToFileAndConsole } from '../utils/FileUtils.js';
import { getDateAndTime } from '../utils/StringUtils.js';

test.beforeEach(async ({ page, context, request }) => {
  process.playwrightPage = page;
  process.playwrightContext = context;
  process.playwrightRequest = request;
  process.jobsExcludedByJD = [];
});

test.afterEach(async ({ page, context, request }, testInfo) => {
  if (process.fileName !== undefined) {
    printToFileAndConsole(`Run Finished: ${(new Date()).toLocaleString()}`);
  }
  if (testInfo.status === 'failed') {
    console.log('URL at the moment of failure = ' + page.url());
    console.log('');
  }
  await page.close();
});

test(`linkedin - search jobs - ${datePostedFilter}`, async ({ page }) => { // 2-3h
  process.fileName = getDateAndTime() + "_linkedin_.txt";
  restrictContractPositions();
  await linkedInLogin();
  await linkedInEnterPosition(JobNamesToSearch[0]); // any job to see needed elements
  if (!FIND_REMOTE_ONLY) {
    await linkedInEnterLocation(LOCATION);
  } else {
    await linkedInEnterLocation("United States");
  }
  await linkedInEnterPosition(JobNamesToSearch[0]); // got cleared, enter again
  await linkedInSetUpFilters(datePostedFilter);
  const jobsFromAllPagesWithFilteredNames = new Set();
  await linkedInCollectJobsAfterFiltersApplied(jobsFromAllPagesWithFilteredNames, pageLimitToSearch, Job_Names_QA_Stop_Words, JobNamePartsToInclude);
  for (let i = 1; i < JobNamesToSearch.length; i++) {
    await linkedInEnterPosition(JobNamesToSearch[i]);
    await linkedInCollectJobsAfterFiltersApplied(jobsFromAllPagesWithFilteredNames, pageLimitToSearch, Job_Names_QA_Stop_Words, JobNamePartsToInclude);
  }
  await linkedInOpenEachPosition(jobsFromAllPagesWithFilteredNames, Job_Descriptions_QA_Stop_Words, JDPartsToInclude);
  printOutFinalResults(jobsFromAllPagesWithFilteredNames);
});
