# Automation for job search on LinkedIn

The project is built on JavaScript + Playwright.

Project suppose to work on both Windows and Mac, but I am using Mac and don't have a Windows machine to test it on, so please let me know if you face any issues on Windows and I will do my best to fix issues if any.

# Getting started

1. Download and install NodeJS https://nodejs.org/en/download

Check installation by running in terminal:

```
node -v
```

2. Download and install text editor Visual Studio Code

https://code.visualstudio.com/download

Launch installed Visual Studio Code text editor.

3. Configure the path with VS Code

Launch VS Code

Open the Command Palette (Cmd+Shift+P), type 'shell command', and run the Shell Command: Install 'code' command in PATH command.

Restart VS Code and terminal windows (if opened) for the new $PATH value to take effect.

4. Install "Playwright Test for VSCode" extension

In Visual Studio Code install "Playwright Test for VSCode" extension, it will allow you to run the code from the file in editor directly instead of using the terminal.

5. Download ZIP of the project from github and unarchive it.

In instructions below you will see PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM which refers to the project location in your file system, so please make sure to put your path value instead.

For example, if I have the project downloaded and unzipped to folder ~/Downloads/linkedin-job-search-startqacareer-main on my mac, then, in my case, PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM = ~/Downloads/linkedin-job-search-startqacareer-main

I would not recommend using spaces in folder names in your path to avoid hussle of surrounding path with the quotes "", but if you have at least one space in any of your folder names along the way - put the path in "", e.g. - "~/Downloads/linkedin-job-search-startqacareer-main".

6. Open terminal and run commands

```
cd PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM
npm install
```

After that run in terminal:

```
npx playwright install
```

It will install all dependencies.

# Set up config

Open the project folder in Visual Studio Code

Set up your LinkedIn credentials in PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM/configs/QAJobSearchConfig.js

```
export const username = "YOUR_LINKEDIN_USERNAME";
export const password = "YOUR_LINKEDIN_PASSWORD";
```

Set up your search parameters in PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM/configs/QAJobSearchConfig.js

Put desired position names into array:

```
export const JobNamesToSearch = [
  "Manual QA Engineer",
  "QA Engineer",
  "Quality Assurance Engineer",
  "Software Testing Engineer",
  "Test Engineer",
  "QA Tester",
  "QA Analyst",
  "Web QA Engineer",
];
```

# Run the search

Then run in terminal (or from Visual Studio Code under Testing Tab on the left)

```
npx playwright test
```

# Results

Each search run log will be written to a seprate file in logs folder, e.g. PATH_TO_PROJECT_FOLDER_IN_YOUR_FILE_SYSTEM/logs/2_14_2026_23_59_59_linkedin_.txt

Log will be output to console/terminal as well as to a log file.

After each run - update config file with positions you already reviewed to filter them out next time when you run the search. To do that - add them into configs/Job_Names_QA_StopWordsAndExcludedJobs.js file

If you have any Job Description phrases you want to exlude jobs with those from search results - add them into configs/Job_Descriptions_QA_StopWords.js file

# Troubleshooting

If you run a test and see empty browser window with "about:blank" and nothing is happening - stop running test, close the browser window and start the test again. It happens from time to time - no need to worry, restart a test.