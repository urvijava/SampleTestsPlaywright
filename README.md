# SampleTestsPlaywright
My first attempt at Playwright! here are some sample playwright tests doing login and form submit actions


**Running Tests**

Clone the repository and run below commands from within the repository 

1. For first time, run below to install playwright libraries

```
npm install
```

2. Default command for running test in headless mode with chrome

```
npm test
```

3. Run tests in other modes 

```
# Running with firefox
npx playwright test --project=firefox

# Running in headed mode , to see the UI interactions happen during the run
npx playwright test --project=chromium --headed

# Running a single test (e.g. login valid details)
npx playwright test --project=firefox -g '002 - logs user in when valid details are provided'

```

Refer below for more instructions on playwright test run options

https://playwright.dev/docs/running-tests 


**Test Results**

An html report is generated for each test run, and stored under playwright-report/index.html

report can be viewed in browser using below command

```
npx playwright show-report
```