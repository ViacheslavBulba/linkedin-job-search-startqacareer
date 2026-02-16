import { expect } from "@playwright/test";
import { Job_Descriptions_QA_Stop_Words } from "../configs/Job_Descriptions_QA_StopWords";
import { FIND_REMOTE_ONLY, JOB_LOCATION_TYPES, JOB_TYPES, password, username } from "../configs/QAJobSearchConfig";
import { excludeByJDStopWords } from "../utils/BasePage";
import { printToFileAndConsole } from "../utils/FileUtils";
import { isAlreadyIncluded, textIncludesWords, whichStopWordFound } from "../utils/StringUtils";
import { clickOnElementIfPresent, getAllElementsWithOrWithoutIFrame, getLocatorFromFew, getNumberOfElements, getTextFromElement, isElementDisplayed, isElementPresent, isElementPresentWithIFrameRetry, scrollUp } from "../utils/WebElementUtils";

export function restrictContractPositions() {
  if (!JOB_TYPES.includes("Contract")) {
    Job_Descriptions_QA_Stop_Words.push(
      "RemoteContract", // in the upper corner
      "to support our client in",
      "IT Services and IT Consulting",
      "QA Automation Engineer - Contract",
      "W2 Role",
      "Position: W2/1099",
      "Duration: 4 months",
      "with possible extension",
      "Length of Contract: 1 year",
      "Prior experience working in a consulting role is highly desirable",
      "Position Type :    Contract",
      "W2 and Corp to corp",
      "Employer Industry: IT Consulting",
      "Independent Contractor",
      "Type of contract",
      "This is remote contract opening",
      "Months (Contract)",
      "contract opportunity",
      "Long-term Contract",
      "with one of our clients",
      "This is a contract position",
      "11+ Month",
      "12+ Month",
      "6+ Month",
      "6 Month",
      "12 month",
      "Months Contract",
      "contract team",
      "the contractor will be expected",
      "Type: Contract",
      "The Contract Quality Assurance",
      "W2 Contract",
      "Duration:6 months",
      "as a consultant",
      "consulting for digital transformation",
      "Duration 12 months",
      "Duration 6 months",
      "Duration - 6 Months",
      "Duration 12+ months",
      "Duration 6+ months",
      "Long Term Contract",
      "Contract to Hire",
      "12+ contract",
      "Duration: 6 Months",
      "Contract-to-Hire",
      "IT Services and IT Consulting",
      "6-12 Months",
      "Implementation Partner: Infosys",
      "Duration: 6+ Months",
      "Duration: 3 Months",
      "Duration: 6+ M",
      "global IT consulting company",
      "Hourly on W2",
      "Per hour on w2",
      "Tests and certifies vendor software",
      "urgent C2C opening",
      "contingent staffing",
      "hour on W2",
      "Duration: 6",
      "Duration: 12",
      "-month contract",
      "Type: 1 year contract",
      "Contract length:",
      "Remote-W2",
      "Contract-Hire",
      "Duration: 1+ yr.",
      "W2 only",
      "contractor (C2C or w2 hourly)",
    );
  }
}

const locatorJobNameInput = `//*[@aria-label="Search by title, skill, or company" or @placeholder="Title, skill or Company"][1]`;
const locatorJobLocationInput = '//*[@aria-label="City, state, or zip code"][1]';
export const linkedinFiltersIFrame = '//iframe[@data-testid="interop-iframe"]';

export async function linkedInEnterPosition(text) {
  const page = process.playwrightPage;
  try {
    printToFileAndConsole("");
    printToFileAndConsole(`ENTER POSITION [${text}] AND PRESS ENTER`);
    printToFileAndConsole("");
    await scrollUp(3000);
    await fillWithRetryInIframe(locatorJobNameInput, text);
    await page.waitForTimeout(3000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
  } catch (retry) {
    if (page.url().includes('/premium/survey/')) {
      await page.goto('https://www.linkedin.com/jobs/');
      await page.waitForTimeout(10000);
    }
    printToFileAndConsole("");
    printToFileAndConsole(`ENTER POSITION [${text}] AND PRESS ENTER`);
    printToFileAndConsole("");
    await scrollUp(3000);
    await fillWithRetryInIframe(locatorJobNameInput, text);
    await page.waitForTimeout(3000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
  }
}

export async function linkedInEnterLocation(text) {
  printToFileAndConsole(`enter location: ${text}`);
  const page = process.playwrightPage;
  await fillWithRetryInIframe(locatorJobLocationInput, text);
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);
}

export async function linkedInSearchPositionInRemote(jobName) {
  const page = process.playwrightPage;
  printToFileAndConsole(`=== Position: ${jobName} ===`);
  await linkedInEnterPosition(jobName);
  await linkedInEnterLocation("Remote");
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);
}

export async function linkedInGetTotalResults() {
  const elementText = await getTextFromElement('.jobs-search-results-list__subtitle'); // e.g. '55,223 results'
  const result = +(elementText.split(' ')[0].replace(/,/g, ''));
  printToFileAndConsole(`Number of results on the top: ${result}`);
  return result;
}

export async function clickAllHideButtons() {
  printToFileAndConsole('CLICK ON HIDE JOBS');
  const page = process.playwrightPage;
  const cssHideButtons = "button.job-card-container__action";
  const allHideButtons = await page.locator(cssHideButtons).all();
  for (let hide of allHideButtons) {
    try {
      await hide.hover();
      await hide.click();
    } catch (ingore) {
      printToFileAndConsole('ERROR WHEN CLICK ON HIDE JOB');
    }
    await page.waitForTimeout(500);
  }
}

export async function linkedInLoginWithUserPassword(username, password) {
  printToFileAndConsole('login');
  const page = process.playwrightPage;
  if (username === 'YOUR_LINKEDIN_USERNAME') {
    printToFileAndConsole('');
    printToFileAndConsole('PLEASE SPECIFY YOUR USERNAME AND PASSWORD IN - /linkedin-job-search-startqacareer/configs/QAJobSearchConfig.js');
    printToFileAndConsole('');
    expect(username, 'PLEASE SPECIFY YOUR USERNAME AND PASSWORD IN - /linkedin-job-search-startqacareer/configs/QAJobSearchConfig.js').not.toBe('YOUR_LINKEDIN_USERNAME');
  }
  await page.goto('https://www.linkedin.com/', { timeout: 15000 });
  await page.waitForTimeout(5000);
  printToFileAndConsole('paywall check 1');
  const locatorPaywall1 = '//button[@class="authwall-join-form__form-toggle--bottom form-toggle"]';
  if ((await page.locator(locatorPaywall1).all()).length > 0) {
    await page.locator(locatorPaywall1).click();
    await page.waitForTimeout(1000);
  }
  printToFileAndConsole('paywall check 2');
  if ((await page.locator('//*[@autocomplete="username"]').all()).length == 0) { // sometimes blank page appears
    await page.reload();
    await page.waitForTimeout(5000);
    printToFileAndConsole('paywall check 2 getNumberOfElements');
    if (await getNumberOfElements(locatorPaywall1) > 0) {
      await page.locator(locatorPaywall1).click({ timeout: 10000 });
      await page.waitForTimeout(1000);
    } else {
      printToFileAndConsole('paywall check 2 nothing to click');
    }
  }
  printToFileAndConsole('paywall check 3');
  const locatorPaywall3 = 'a.sign-in-form__sign-in-cta';
  if ((await page.locator(locatorPaywall3).all()).length > 0) {
    printToFileAndConsole('Welcome to your professional community');
    await page.locator(locatorPaywall3).click();
    await page.waitForTimeout(1000);
  }
  printToFileAndConsole('paywall check 4');
  const locatorPaywall4 = '//*[@data-test-id="home-hero-sign-in-cta"]';
  if ((await page.locator(locatorPaywall4).all()).length > 0) {
    printToFileAndConsole('Sign in with email');
    await page.locator(locatorPaywall4).click();
    await page.waitForTimeout(5000);
  }
  await page.waitForTimeout(5000);
  await page.locator('//*[@autocomplete="username" or @id="username"]').fill(username);
  await page.locator('//*[@autocomplete="current-password"]').fill(password);
  const locatorSignInButton1 = '//button[@type="submit"][contains(text(),"Sign in")]';
  const locatorSignInButton2 = '//button[contains(text(),"Sign in")]';
  if (await getNumberOfElements(locatorSignInButton1) > 0) {
    await page.locator(locatorSignInButton1).click();
  } else {
    await page.locator(locatorSignInButton2).first().click();
  }
  await page.waitForTimeout(10000);
  await clickOnElementIfPresent('//*[text()="Maybe later"]');
  await page.waitForTimeout(2000);
  await clickOnElementIfPresent('[role="dialog"] button[aria-label="Dismiss"]');
  await page.locator('//*[@title="Jobs"]').click();
  await page.waitForTimeout(2000);
}

export async function linkedInLogin() {
  await linkedInLoginWithUserPassword(username, password);
}

export async function clickOnShowResultsButtonInsideUpperFilter() {
  printToFileAndConsole('click on show results');
  const page = process.playwrightPage;
  const locatorShowResultsButtons = '//button[@data-control-name="filter_show_results" or contains(@aria-label,"Apply current filter to show")]'; // text is changing, like show n results
  await clickWithRetryInIframe(locatorShowResultsButtons);
  await page.waitForTimeout(5000);
}

async function clickWithRetryInIframe(locator) {
  const page = process.playwrightPage;
  if (await isElementPresent(locator)) {
    const elements = await page.locator(locator).all();
    for (let el of elements) {
      const visibility = await el.isVisible();
      if (visibility) {
        await el.click({ force: true });
        break;
      }
    }
  } else {
    printToFileAndConsole(`Cannot find locator without iframe, let's try with iframe - [${locator}]`);
    const elements = await page.frameLocator(linkedinFiltersIFrame).locator(locator).all();
    if (elements.length === 0) {
      // throw new Error(`Cannot find [${locator}]`);
      printToFileAndConsole(``);
      printToFileAndConsole(`CANNOT FIND LOCATOR WITHOUT OR WITH IFRAME - [${locator}]`);
      printToFileAndConsole(``);
    }
    for (let el of elements) {
      const visibility = await el.isVisible();
      if (visibility) {
        await el.click({ force: true });
        break;
      }
    }
  }
}

async function fillWithRetryInIframe(locator, text) {
  const page = process.playwrightPage;
  if (await isElementDisplayed(locator)) {
    await page.locator(locator).first().fill(text);
  } else {
    await page.frameLocator(linkedinFiltersIFrame).locator(locator).first().fill(text);
  }
}

export async function linkedInSetUpFilters(linkedinDatePostedFilter) {
  const page = process.playwrightPage;
  printToFileAndConsole('set up filters');
  await clickWithRetryInIframe('//*[text()="All filters"]');
  await page.waitForTimeout(5000);
  // set up job types
  for (let i = 0; i < JOB_TYPES.length; i++) {
    printToFileAndConsole(`set up job type checkbox = [${JOB_TYPES[i]}]`);
    await clickWithRetryInIframe(`//h3[text()="Job type"]/..//label//*[text()="${JOB_TYPES[i]}"]`);
    await page.waitForTimeout(1500);
  }
  // set up remote or not
  if (FIND_REMOTE_ONLY) {
    printToFileAndConsole(`set up job type checkbox = [Remote]`);
    await clickWithRetryInIframe(`//h3[text()="Remote"]/..//label//*[text()="Remote"]`);
    await page.waitForTimeout(1500);
  } else {
    for (let i = 0; i < JOB_LOCATION_TYPES.length; i++) {
      printToFileAndConsole(`set up job type checkbox = [${JOB_LOCATION_TYPES[i]}]`);
      await clickWithRetryInIframe(`//h3[text()="Remote"]/..//label//*[text()="${JOB_LOCATION_TYPES[i]}"]`);
      await page.waitForTimeout(1500);
    }
  }
  // show results button in right large modal
  await clickWithRetryInIframe('//button[@data-test-reusables-filters-modal-show-results-button]');
  await page.waitForTimeout(5000);
  printToFileAndConsole(`set up date posted filter = ${linkedinDatePostedFilter}`);
  if (linkedinDatePostedFilter !== 'Any time') {
    await clickWithRetryInIframe('//*[text()="Date posted"]');
    await page.waitForTimeout(3000);
    printToFileAndConsole(`set up date posted = ${linkedinDatePostedFilter}`);
    await clickWithRetryInIframe('//*[text()="' + linkedinDatePostedFilter + '"]');
    await page.waitForTimeout(3000);
    await clickOnShowResultsButtonInsideUpperFilter();
  }
}

export async function linkedInSetUpOnSiteFilters(linkedinDatePostedFilter) {
  const page = process.playwrightPage;
  printToFileAndConsole('set up filters');
  await page.locator('//*[text()="All filters"]').click({ timeout: 10000 });
  await page.waitForTimeout(5000);
  printToFileAndConsole('set up checkbox = full time');
  await page.locator('//label//*[text()="Full-time"]').first().click({ timeout: 10000 });
  await page.waitForTimeout(3000);
  printToFileAndConsole('set up checkbox = contract');
  await page.locator('//label//*[text()="Contract"]').first().click({ timeout: 10000 });
  await page.waitForTimeout(3000);
  // printToFileAndConsole('set up checkbox = remote');
  // await page.locator('//label//*[text()="Remote"]').first().click();
  // await page.waitForTimeout(3000);
  printToFileAndConsole('set up checkbox = On-site');
  await page.locator('//label//*[text()="On-site"]').first().click({ timeout: 10000 });
  await page.waitForTimeout(3000);
  printToFileAndConsole('set up checkbox = Hybrid');
  await page.locator('//label//*[text()="Hybrid"]').first().click({ timeout: 10000 });
  await page.waitForTimeout(3000);
  await page.locator('//button[@data-test-reusables-filters-modal-show-results-button]').click({ timeout: 10000 }); // show results button in right large modal
  await page.waitForTimeout(5000);
  printToFileAndConsole(`set up date posted filter = ${linkedinDatePostedFilter}`);
  if (linkedinDatePostedFilter !== 'Any time') {
    await page.locator('//*[text()="Date posted"]').click({ timeout: 10000 });
    await page.waitForTimeout(3000);
    printToFileAndConsole(`set up date posted = ${linkedinDatePostedFilter}`);
    await page.locator('//*[text()="' + linkedinDatePostedFilter + '"]').click({ timeout: 10000 });
    await page.waitForTimeout(3000);
    await clickOnShowResultsButtonInsideUpperFilter();
  }
}

export async function openPageWithRetry(link) {
  const page = process.playwrightPage;
  let pageOpenSuccess = false;
  try {
    await page.goto(link);
    pageOpenSuccess = true;
  } catch (error) {
    printToFileAndConsole('error opening page, trying again 1');
  }
  if (!pageOpenSuccess) {
    await page.waitForTimeout(10000);
    try {
      await page.goto(link);
      pageOpenSuccess = true;
    } catch (error) {
      printToFileAndConsole('error opening page, trying again 2');
    }
  }
  if (!pageOpenSuccess) {
    await page.waitForTimeout(10000);
    try {
      await page.reload();
      pageOpenSuccess = true;
    } catch (error) {
      printToFileAndConsole('error opening page 3, stop trying, skip');
    }
  }
  return pageOpenSuccess;
}

export async function linkedInGetJobDescription(jobLink) {
  const page = process.playwrightPage;
  const locatorJobDescriptionOnJobPage = '//*[contains(@class,"jobs-description__content") or contains(@data-sdui-component,"aboutTheJob")]';
  const locatorSalaryOnJobPage1 = '//li[contains(@class,"job-details-jobs-unified-top-card__job-insight")]';
  const locatorSalaryOnJobPage2 = '//*[contains(@class,"job-details-preferences-and-skills__pill")]//span[1]';
  const locatorSalaryOnJobPage3 = '//span[contains(text(),"/yr")]';
  const locatorWholeTopCardWithCompanyDetailsAndSalary = '.jobs-unified-top-card';
  const pageOpenSuccess = await openPageWithRetry(jobLink);
  if (!pageOpenSuccess) {
    return '';
  }
  await page.waitForTimeout(5000);
  let jd = 'EMPTY JD';
  if (await getNumberOfElements(locatorJobDescriptionOnJobPage) > 0) {
    jd = await getTextFromElement(locatorJobDescriptionOnJobPage);
  }
  let salary = await getTextFromElement(locatorSalaryOnJobPage2);
  if (salary === '') {
    salary = await getTextFromElement(locatorSalaryOnJobPage3);
  }
  salary = salary.replaceAll(/\n/g, '').replaceAll('  ', '');
  jd = jd + ' ' + salary;
  printToFileAndConsole('');
  printToFileAndConsole('salary:');
  printToFileAndConsole(salary);
  printToFileAndConsole('');
  if (await getNumberOfElements(locatorWholeTopCardWithCompanyDetailsAndSalary) > 0) {
    let salary = await getTextFromElement(locatorWholeTopCardWithCompanyDetailsAndSalary);
    salary = salary.replaceAll(/\n/g, '').replaceAll('  ', '');
    jd = jd + ' ' + salary;
  }
  jd = jd.replaceAll(/\n/g, '').replaceAll('  ', '');
  printToFileAndConsole('--------- jd ----------');
  printToFileAndConsole(jd);
  printToFileAndConsole('-----------------------');
  if (jd.length < 30) {
    printToFileAndConsole('     WARNING: EMPTY JOB DESCRIPTION');
  }
  return jd;
}

const tempSetToExcludeDuplicates = new Set();

export async function linkedInGetAllUnfilteredJobsOnOnePage() {
  printToFileAndConsole(``);
  printToFileAndConsole(`----- linkedInGetAllUnfilteredJobsOnOnePage -----`);
  printToFileAndConsole(``);
  const page = process.playwrightPage;
  const unfilteredJobsOnOnePage = new Set();
  const jobNames = [];
  const jobCompanies = [];
  const jobLinks = [];
  const jobLocations = [];
  const locatorsJobNames = [
    '//li[not(contains(@class,"discovery-templates-entity-item"))]//*[@data-view-name="job-card"]//*[contains(@class,"artdeco-entity-lockup__title")]/a//strong', // '//ul[@class="scaffold-layout__list-container"]//a[contains(@class,"job-card-container__link")]//strong'; // text // ".artdeco-entity-lockup__title a.job-card-container__link";
    'a.job-card-container__link strong',
  ];
  const locatorsJobCompanies = [
    '//li[not(contains(@class,"discovery-templates-entity-item"))]//*[@data-view-name="job-card"]//*[contains(@class,"artdeco-entity-lockup__subtitle")]', // '//ul[@class="scaffold-layout__list-container"]//*[contains(@class,"job-card-container__primary-description")]';
    // '.artdeco-entity-lockup__subtitle > span',
    '//*[contains(@class,"jobs-search-pagination")]//preceding::*[contains(@class,"artdeco-entity-lockup__subtitle")]/span[1]'
  ];
  const locatorJobLinks = '//li[not(contains(@class,"discovery-templates-entity-item"))]//a[contains(@class,"job-card-container__link")]'; //'//ul[@class="scaffold-layout__list-container"]//a[contains(@class,"job-card-container__link")]'; // href
  const locatorsJobLocations = [
    '//li[not(contains(@class,"discovery-templates-entity-item"))]//*[@data-view-name="job-card"]//*[contains(@class,"artdeco-entity-lockup__caption")]', // '//ul[@class="scaffold-layout__list-container"]//*[@data-view-name="job-card"]/div[1]/div[1]/div[2]/div[3]/ul[1]/li[1]';
    // '.artdeco-entity-lockup__caption > ul > li',
    '//*[contains(@class,"jobs-search-pagination")]//preceding::*[contains(@class,"artdeco-entity-lockup__caption")]//ul/li'
  ];
  const locatorJobNames = await getLocatorFromFew(locatorsJobNames);
  const locatorJobCompanies = await getLocatorFromFew(locatorsJobCompanies);
  const locatorJobLocations = await getLocatorFromFew(locatorsJobLocations);
  if (await getNumberOfElements('//*[text()="No matching jobs found."]') > 0) {
    printToFileAndConsole('');
    printToFileAndConsole('No matching jobs found.');
    printToFileAndConsole('');
    return unfilteredJobsOnOnePage;
  }
  try {
    if (await page.locator(locatorJobNames).count() > 0) {
      await page.locator(locatorJobNames).first().hover();
    } else {
      await page.frameLocator(linkedinFiltersIFrame).locator(locatorJobNames).first().hover();
    }
  } catch (ingore) {
    printToFileAndConsole('ERROR HOVERING OVER A JOB NAME');
  }
  for (let i = 0; i < 7; i++) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(3000);
  printToFileAndConsole('COLLECTING JOB NAMES');
  const jobNamesElements = await getAllElementsWithOrWithoutIFrame(linkedinFiltersIFrame, locatorJobNames);
  for (let el of jobNamesElements) {
    const name = (await el.textContent()).trim();
    if (name === '') {
      expect(true).toBe(false);
    }
    jobNames.push(name);
  }
  printToFileAndConsole('COLLECTING JOB LINKS');
  const jobLinksElements = await getAllElementsWithOrWithoutIFrame(linkedinFiltersIFrame, locatorJobLinks);
  for (let el of jobLinksElements) {
    const href = await el.getAttribute('href');
    let shortUrl = href.substring(0, href.indexOf("?eBP="));
    if (shortUrl === '') {
      if (href.includes('?currentJobId=') && href.includes('&eBP=')) {
        const jobId = href.substring(href.indexOf("?currentJobId=") + 14, href.indexOf("&eBP="));
        shortUrl = `/jobs/view/${jobId}/`;
      } else {
        shortUrl = href;
      }
    }
    jobLinks.push(`https://www.linkedin.com${shortUrl}`);
  }
  printToFileAndConsole('COLLECTING COMPANY NAMES');
  const companyNamesElements = await getAllElementsWithOrWithoutIFrame(linkedinFiltersIFrame, locatorJobCompanies);
  for (let el of companyNamesElements) {
    const company = (await el.textContent()).trim();
    jobCompanies.push(company);
  }
  printToFileAndConsole('COLLECTING JOB LOCATIONS');
  const jobLocationsElements = await getAllElementsWithOrWithoutIFrame(linkedinFiltersIFrame, locatorJobLocations);
  for (let el of jobLocationsElements) {
    const location = (await el.textContent()).trim();
    // printToFileAndConsole(location);
    jobLocations.push(location);
  }
  if (jobNames.length < 1) {
    printToFileAndConsole('No matching jobs found.');
  }
  printToFileAndConsole('jobNames size = ' + jobNames.length);
  printToFileAndConsole(jobNames);
  printToFileAndConsole('jobCompanies size = ' + jobCompanies.length);
  printToFileAndConsole(jobCompanies);
  printToFileAndConsole('jobLinks size = ' + jobLinks.length);
  printToFileAndConsole(jobLinks);
  printToFileAndConsole('jobLocations size = ' + jobLocations.length);
  printToFileAndConsole(jobLocations);
  expect(jobNames.length).toBe(jobCompanies.length);
  if (jobNames.length !== jobCompanies.length || jobNames.length !== jobLinks.length) {
    printToFileAndConsole('');
    printToFileAndConsole('ERROR - DIFFERENT SIZES FOR JOB NAMES, COMPANIES, LINKS and LOCATIONS');
    printToFileAndConsole('SKIP THIS PAGE');
    printToFileAndConsole('');
    printToFileAndConsole('jobNames size = ' + jobNames.length);
    printToFileAndConsole(jobNames);
    printToFileAndConsole('jobCompanies size = ' + jobCompanies.length);
    printToFileAndConsole(jobCompanies);
    printToFileAndConsole('jobLinks size = ' + jobLinks.length);
    printToFileAndConsole(jobLinks);
    printToFileAndConsole('jobLocations size = ' + jobLocations.length);
    printToFileAndConsole(jobLocations);
    return unfilteredJobsOnOnePage;
  }
  for (let i = 0; i < jobNames.length; i++) {
    let jobEntryIncludingLink = `${jobCompanies[i]} --- ${jobNames[i]} --- ${jobLinks[i]}`;
    if (jobLocations.length === jobNames.length) {
      jobEntryIncludingLink = `${jobCompanies[i]} --- ${jobNames[i]} --- ${jobLinks[i]} --- ${jobLocations[i]}`;
    }
    printToFileAndConsole(`[${jobCompanies[i]}] --- [${jobNames[i]}] --- [${jobLinks[i]}] --- [${jobLocations[i]}]`);
    const jobEntryCompanyAndPositionOnly = `${jobCompanies[i]} --- ${jobNames[i]}`;
    //printToFileAndConsole(jobEntryIncludingLink)
    if (!tempSetToExcludeDuplicates.has(jobEntryCompanyAndPositionOnly)) {
      tempSetToExcludeDuplicates.add(jobEntryCompanyAndPositionOnly);
      unfilteredJobsOnOnePage.add(jobEntryIncludingLink);
    }
  }
  return unfilteredJobsOnOnePage;
}

const filteredOutJobs = [];

export async function linkedInCollectJobsAfterFiltersApplied(jobsFromAllPagesWithFilteredNames, pageLimitToSearch, jobNamePartsToIgnore, jobNamePartsToInclude) {
  const page = process.playwrightPage;
  printToFileAndConsole(``);
  printToFileAndConsole(`----- linkedInCollectJobsAfterFiltersApplied -----`);
  printToFileAndConsole(``);
  let pageCount = 1;
  let continueSearch = true;
  while (continueSearch) {
    const unfilteredJobsOnOnePage = await linkedInGetAllUnfilteredJobsOnOnePage();
    for (let job of unfilteredJobsOnOnePage) {
      const jobCompanyAndNameWithoutLink = job.split(" --- ")[0] + " --- " + job.split(" --- ")[1]; // short words like 'esb' was included in link itself
      const jobNameOnlyWithoutCompany = job.split(" --- ")[1];
      let shouldHaveJobNameParts = textIncludesWords(jobCompanyAndNameWithoutLink, jobNamePartsToInclude);
      if (jobNamePartsToInclude.length === 0) {
        printToFileAndConsole(`jobNamePartsToInclude is empty, ignore`);
        shouldHaveJobNameParts = true;
      }
      if (shouldHaveJobNameParts && !textIncludesWords(job, jobNamePartsToIgnore) && !isAlreadyIncluded(job, jobsFromAllPagesWithFilteredNames)) {
        if (FIND_REMOTE_ONLY) {
          const jobLocation = job.split(" --- ")[3];
          if (jobLocation.includes('Remote')) {
            jobsFromAllPagesWithFilteredNames.add(job);
          } else {
            printToFileAndConsole(job);
            printToFileAndConsole(`not remote, excluding it, searching for remote jobs only`);
            filteredOutJobs.push(job);
          }
        } else {
          jobsFromAllPagesWithFilteredNames.add(job);
        }
      } else {
        if (!filteredOutJobs.includes(job)) {
          filteredOutJobs.push(job);
        }
        printToFileAndConsole(``);
        printToFileAndConsole(`---------------------------`);
        printToFileAndConsole(`${job}`);
        printToFileAndConsole(`EXCLUDED BY NAME BECAUSE:`);
        if (!textIncludesWords(jobNameOnlyWithoutCompany, jobNamePartsToInclude)) {
          printToFileAndConsole(`- does not have parts that must be in name`);
        }
        if (textIncludesWords(jobCompanyAndNameWithoutLink, jobNamePartsToIgnore)) {
          const foundStopWord = whichStopWordFound(job, jobNamePartsToIgnore);
          printToFileAndConsole(`- has name parts to ignore: ${foundStopWord}`);
        }
        if (isAlreadyIncluded(job, jobsFromAllPagesWithFilteredNames)) {
          printToFileAndConsole(`- already included`);
        }
        printToFileAndConsole(`---------------------------`);
        printToFileAndConsole(``);
      }
    }
    printToFileAndConsole("");
    printToFileAndConsole("WIP FILTERED POSITIONS AFTER EACH PAGE IN CASE IF SOMETHING GOES WRONG: " + jobsFromAllPagesWithFilteredNames.size);
    let m = 1;
    for (let job of jobsFromAllPagesWithFilteredNames) {
      printToFileAndConsole(job);
      m++;
    }
    // await clickAllHideButtons(); // CLICK ON HIDE DO NOT WORK ON LINKEDIN ITSELF IN THIS BROWSER - IT STILL SHOWS THOSE JOBS BUT WITH ALREADY CLICKED FLAG, NO USE
    pageCount++;
    if (await isElementPresentWithIFrameRetry(`//*[@aria-label='Page ${pageCount}']`)) {
      if (pageCount > pageLimitToSearch) {
        //printToFileAndConsole("MORE THAN " + pageLimitToSearch + " PAGES, STOP SEARCH");
        continueSearch = false; // maybe not needed as return used
      } else {
        printToFileAndConsole("opening page - " + pageCount);
        printToFileAndConsole('');
        printToFileAndConsole(`Time stamp to see if got stuck: ${(new Date()).toLocaleString()}`);
        printToFileAndConsole('');
        try {
          await clickWithRetryInIframe(`//*[@aria-label='Page ${pageCount}']`);
        } catch (error) {
          printToFileAndConsole('cannot find page element, refreshing the page and trying again');
          await page.waitForTimeout(5000);
          const currentUrl = page.url();
          printToFileAndConsole(`wip url - ${currentUrl}`);
          const pageOpenSuccess = await openPageWithRetry(currentUrl);
          if (!pageOpenSuccess) {
            printToFileAndConsole('');
            printToFileAndConsole('page crashed');
            printToFileAndConsole('');
            printToFileAndConsole(currentUrl);
            printToFileAndConsole('');
          }
          for (let i = 0; i < 7; i++) {
            await page.mouse.wheel(0, 700);
            await page.waitForTimeout(1000);
          }
          const pageButton = `//*[@aria-label='Page ${pageCount}']`;
          if (await isElementPresentWithIFrameRetry(pageButton)) {
            await clickWithRetryInIframe(pageButton);
          } else {
            printToFileAndConsole(`cannot find page button with retry, skip`);
          }
        }
        await page.waitForTimeout(5000);
      }
    } else {
      printToFileAndConsole("");
      printToFileAndConsole("Last page was: Page " + (pageCount - 1));
      continueSearch = false;
    }
  } // END OF WHILE LOOP
  printToFileAndConsole("");
  printToFileAndConsole("");
}

export async function linkedInOpenEachPosition(set, descriptionStopWordsArray, JDPartsToInclude) {
  const page = process.playwrightPage;
  printToFileAndConsole("");
  printToFileAndConsole("OPEN EACH POSITION");
  printToFileAndConsole("");
  let m = 1;
  for (let job of set) {
    printToFileAndConsole('');
    printToFileAndConsole('opening job ' + m + ' ' + job);
    m++;
    const jd = await linkedInGetJobDescription(job.split(" --- ")[2]);
    if (await isElementPresent('//*[text()="No longer accepting applications"]')) {
      printToFileAndConsole('');
      printToFileAndConsole('>>>>> NO LONGER ACCEPTING APPLICATIONS <<<<<');
      printToFileAndConsole('');
      if (!process.jobsExcludedByJD.includes(job)) {
        process.jobsExcludedByJD.push(job);
      }
      set.delete(job);
      continue;
    }
    if (jd.length < 350) {
      printToFileAndConsole('');
      printToFileAndConsole('>>>>> TOO SHORT JD (<350 ch) <<<<<');
      printToFileAndConsole('');
      if (!process.jobsExcludedByJD.includes(job)) {
        process.jobsExcludedByJD.push(job);
      }
      set.delete(job);
      continue;
    }
    await excludeByJDStopWords(jd, descriptionStopWordsArray, job, set);
    if (FIND_REMOTE_ONLY) {
      if (jd.includes('On-site') && !jd.includes('Remote')) {
        printToFileAndConsole('   >>>>> job description includes [On-site] but not [Remote] - excluding it');
        if (!process.jobsExcludedByJD.includes(job)) {
          process.jobsExcludedByJD.push(job);
        }
        set.delete(job);
        continue;
      }
    }
    if (JDPartsToInclude.length !== 0 && !textIncludesWords(jd, JDPartsToInclude)) {
      printToFileAndConsole('   >>>>> DOES NOT HAVE JDPartsToInclude (e.g. Playwright) IN JD <<<<<');
      if (!process.jobsExcludedByJD.includes(job)) {
        process.jobsExcludedByJD.push(job);
      }
      set.delete(job);
      continue;
    }
  }
}

export function printOutFinalResults(jobsFromAllPagesWithFilteredNames) {
  const page = process.playwrightPage;
  printToFileAndConsole("");
  printToFileAndConsole(`Excluded jobs by Job Description: ${process.jobsExcludedByJD.length}`);
  printToFileAndConsole("");
  for (let job of process.jobsExcludedByJD) {
    printToFileAndConsole("\"" + job.split(" --- ")[0] + " --- " + job.split(" --- ")[1] + "\",");
  }
  printToFileAndConsole("");
  printToFileAndConsole("FILTERED POSITIONS FROM ALL PAGES: " + jobsFromAllPagesWithFilteredNames.size);
  printToFileAndConsole("");
  let m = 1;
  for (let job of jobsFromAllPagesWithFilteredNames) {
    printToFileAndConsole(m + " - " + job);
    m++;
  }
  printToFileAndConsole("");
  printToFileAndConsole("ADD COMPANY NAMES TO STOP WORDS TO IGNORE NEXT TIME: ");
  printToFileAndConsole("");
  for (let job of process.jobsExcludedByJD) {
    printToFileAndConsole("\"" + job.split(" --- ")[0] + " --- " + job.split(" --- ")[1] + "\",");
  }
  for (let job of jobsFromAllPagesWithFilteredNames) {
    printToFileAndConsole("\"" + job.split(" --- ")[0] + " --- " + job.split(" --- ")[1] + "\",");
  }
  printToFileAndConsole("");
  printToFileAndConsole('LAST KNOWN URL - ' + page.url());
}

export function removeTheSameCompanyJobsFromSet(jobsSet) {
  printToFileAndConsole('remove the same company positions from set');
  printToFileAndConsole(`size before = ${jobsSet.size}`);
  const jobsArrayToRemove = [];
  for (let job of jobsSet) {
    const company = job.split(" --- ")[0];
    let duplicateCounter = 0;
    printToFileAndConsole(`cleaning up by company name [${company}]`);
    jobsSet.forEach((jobLine) => {
      if (jobLine.includes(company)) {
        duplicateCounter++;
        if (duplicateCounter > 1) {
          printToFileAndConsole(`duplicate by company [${company}]: ${jobLine}`);
          jobsArrayToRemove.push(jobLine);
        }
      }
    });
  }
  for (let toDelete of jobsArrayToRemove) {
    jobsSet.delete(toDelete);
  }
  printToFileAndConsole(`size after = ${jobsSet.size}`);
}