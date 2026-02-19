import { linkedinFiltersIFrame } from '../pages/LinkedIn';
import { printToFileAndConsole } from './FileUtils';

const { expect } = require('@playwright/test');

export async function getNumberOfElements(locator) {
  const page = process.playwrightPage;
  try {
    return await page.locator(locator).count();
  } catch (error) {
    await page.waitForTimeout(10000);
    return await page.locator(locator).count();
  }
  // return await page.locator(locator).all().length;
}

export async function isElementPresent(locator) {
  const page = process.playwrightPage;
  return await getNumberOfElements(locator) > 0;
}

export async function isElementDisplayed(locator) {
  const page = process.playwrightPage;
  let visibility = false;
  if (await getNumberOfElements(locator) > 0) {
    visibility = await (await page.locator(locator).first()).isVisible();
  }
  return visibility;
}

export async function getTextFromElement(locator) {
  const page = process.playwrightPage;
  let result = '';
  if (await isElementPresent(locator)) {
    const textContent = await page.locator(locator).first().textContent();
    result = textContent.trim().replace(/\n/g, ' ');
  }
  console.log(`text in ${locator} = ${result}`);
  return result;
}

export async function getTextFromElements(locator) {
  const page = process.playwrightPage;
  const elements = await page.locator(locator).all();
  const values = [];
  for (let el of elements) {
    values.push((await el.textContent()).trim());
  }
  console.log(values);
  return values;
}

export async function getAttributeFromElements(locator, attribute) {
  const page = process.playwrightPage;
  const elements = await page.locator(locator).all();
  const values = [];
  for (let el of elements) {
    values.push(await el.getAttribute(attribute));
  }
  console.log(values);
  return values;
}

export async function isTextPresent(text) {
  const page = process.playwrightPage; // should be in each function due to isolated thread for each test
  const locatorTextContains = `//*[contains(text(),"${text}")]`;
  if (await getNumberOfElements(locatorTextContains) > 0) {
    console.log(`info - text "${text}" is present`);
    return true;
  } else {
    console.log(`info - text "${text}" is not present`);
    return false;
  }
}

export async function isTextVisible(text) {
  const page = process.playwrightPage;
  const locator = getLocatorContainsText(text);
  let visibility = false;
  if (await getNumberOfElements(locator) > 0) {
    visibility = await (await page.locator(locator)).isVisible();
  }
  return visibility;
}

export async function getPageSource() {
  const page = process.playwrightPage;
  const htmlContent = await page.content();
  return htmlContent;
}

export function getLocatorContainsText(text) {
  let locator = `//*[contains(text(),"${text}")]`;
  if (text.includes('"')) {
    locator = `//*[contains(text(),'${text}')]`;
  }
  return locator;
}

export async function clickOnText(text) {
  const page = process.playwrightPage;
  console.log(`click on text [${text}]`);
  const locatorTextEquals = `//*[text()="${text}"]`;
  const locatorTextContains = getLocatorContainsText(text);
  if (await getNumberOfElements(locatorTextEquals) > 0) {
    try {
      await clickOnElement(locatorTextEquals);
    } catch (error) {
      console.log(`error clicking on search button, trying again`);
      await page.waitForTimeout(60000);
      await clickOnElement(locatorTextEquals);
    }
  } else if (await getNumberOfElements(locatorTextContains) > 0) {
    await page.locator(locatorTextContains).first().click();
  } else {
    expect(false, `Cannot find text [${text}]`).toBe(true);
  }
}

export async function clickOnElement(locator) {
  const page = process.playwrightPage;
  await page.locator(locator).first().click({ force: true, position: { x: 1, y: 1 } });
}

export async function clickOnElementIfPresent(locator) {
  const page = process.playwrightPage;
  if (await isElementPresent(locator)) {
    console.log(`element [${locator}] is present, click on it`);
    await clickOnElement(locator);
  } else {
    console.log(`element [${locator}] is not present`);
  }
}

export async function clickOnFirstVisibleElement(locator) {
  console.log(`click on first visible lement "${locator}"`);
  const page = process.playwrightPage;
  const elements = await page.$$(locator);
  let i = 1;
  for (let el of elements) {
    const isVisible = await el.isVisible();
    // const isEnabled = await el.isEnabled();
    if (isVisible) {
      await el.click();
      return;
    } else {
      console.log(`${i} instance not visible`);
      i++;
    }
  }
  // expect(false, `Cannot find and click on visible [${locator}]`).toBe(true); // do not fail, continue
}

export async function scrollDown(pixels) {
  const page = process.playwrightPage;
  console.log(`scroll down ${pixels} pixels`);
  await page.mouse.wheel(0, pixels);
  await page.waitForTimeout(1000);
}

export async function scrollUp(pixels) {
  const page = process.playwrightPage;
  console.log(`scroll up ${pixels} pixels`);
  await page.mouse.wheel(0, -pixels);
  await page.waitForTimeout(1000);
}

export async function isElementPresentWithIFrameRetry(locator) {
  const page = process.playwrightPage;
  if (await page.locator(locator).count() > 0) {
    return true;
  }
  if (await page.locator(linkedinFiltersIFrame).count() > 0) {
    if (await page.frameLocator(linkedinFiltersIFrame).locator(locator).count() > 0) {
      return true;
    }
  }
  printToFileAndConsole(``);
  printToFileAndConsole(`LOCATOR ${locator} IS NOT FOUND WITHOUT OR WITH IFRAME`);
  printToFileAndConsole(``);
  return false;
}

// async function isElementPresentWithRetryInIframe(locator) {
//   const page = process.playwrightPage;
//   if (await isElementPresent(locator)) {
//     return true;
//   } else {
//     const elements = await page.frameLocator(linkedinFiltersIFrame).locator(locator).all();
//     if (elements.length === 0) {
//       return false;
//     }
//     return true;
//   }
// }

export async function getLocatorFromFew(locators) {
  // console.log(`getLocatorFromFew:`);
  // console.log(locators);
  const page = process.playwrightPage;
  if (await isElementPresent('.jobs-search-no-results-banner')) {
    console.log(`No matching jobs found.`);
    return;
  }
  for (let i = 0; i < locators.length; i++) {
    if (await page.locator(locators[i]).count() > 0) {
      return locators[i];
    }
  }
  if (await page.locator(linkedinFiltersIFrame).count() > 0) {
    for (let i = 0; i < locators.length; i++) {
      if (await page.frameLocator(linkedinFiltersIFrame).locator(locators[i]).count() > 0) {
        return locators[i];
      }
    }
  }
  expect(0, `no elements found = ${locators}`).toBeGreaterThan(0);
}

export async function getAllElementsWithOrWithoutIFrame(iframeLocator, locator) {
  const page = process.playwrightPage;
  if (await page.locator(locator).count() > 0) {
    return await page.locator(locator).all();
  } else {
    return await page.frameLocator(iframeLocator).locator(locator).all();
  }
}

export async function waitSeconds(seconds) {
  const page = process.playwrightPage;
  await page.waitForTimeout(seconds * 1000);
}