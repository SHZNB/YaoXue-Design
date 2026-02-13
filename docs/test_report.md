# Test Report

**Date:** 2026/2/13 10:36:20
**Total Tests:** 12
**Passed:** 11
**Failed:** 1
**Duration:** 0.0993701171875s

## Test Suites

### ✅ app.test.ts

- ✔ **should have security headers via helmet** (41.702500000003056ms)
- ✔ **should respond under rate limit** (57.370200000001205ms)

### ❌ ChemistryLab.test.tsx

- ✖ **renders initial state correctly** (74.38539999999921ms)
  ```
  TestingLibraryElementError: Unable to find an element with the text: /0\.0/. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div[39m
      [33mclass[39m=[32m"w-full h-full bg-slate-800 flex flex-col items-center justify-center p-8 relative overflow-hidden"[39m
      [33mtrae-inspector-end-column[39m=[32m"10"[39m
      [33mtrae-inspector-end-line[39m=[32m"165"[39m
      [33mtrae-inspector-file-path[39m=[32m"src\\\\experiments\\\\ChemistryLab.tsx"[39m
      [33mtrae-inspector-start-column[39m=[32m"4"[39m
      [33mtrae-inspector-start-line[39m=[32m"97"[39m
      [33mtrae-inspector-static-props[39m=[32m"%7B%22cwd%22%3A%22E%3A%5C%5CAAA%20My%20New%20Project%5C%5CTrying%20to%20make%20a%20YaoXue%20Design%22%7D"[39m
    [36m>[39m
      [36m<div[39m
        [33mclass[39m=[32m"absolute top-8 left-8 bg-slate-700/80 p-4 rounded-xl text-white backdrop-blur"[39m
        [33mtrae-inspector-end-column[39m=[32m"12"[39m
        [33mtrae-inspector-end-line[39m=[32m"108"[39m
        [33mtrae-inspector-file-path[39m=[32m"src\\\\experiments\\\\ChemistryLab.tsx"[39m
        [33mtrae-inspector-start-column[39m=[32m"6"[39m
        [33mtrae-inspector-start-line[39m=[32m"100"[39m
        [33mtrae-inspector-static-props[39m=[32m"%7B%22cwd%22%3A%22E%3A%5C%5CAAA%20My%20New%20Project%5C%5CTrying%20to%20make%20a%20YaoXue%20Design%22%7D"[39m
      [36m>[39m
        [36m<h3[39m
          [33mclass[39m=[32m"font-bold mb-2 flex items-center gap-2"[39m
          [33mtrae-inspector-end-column[39m=[32m"88"[39m
          [33mtrae-inspector-end-line[39m=[32m"101"[39m
          [33mtrae-inspector-file-path[39m=[32m"src\\\\experiments\\\\ChemistryLab.tsx"[39m
          [33mtrae-inspector-start-column[39m=[32m"8"[39m
          [33mtrae-inspector-start-line[39m=[32m"101"[39m
          [33mtrae-inspector-static-props[39m=[32m"%7B%22cwd%22%3A%22E%3A%5C%5CAAA%20My%20New%20Project%5C%5CTrying%20to%20make%20a%20YaoXue%20Design%22%7D"[39m
        [36m>[39m
          [36m<div[39m
            [33mdata-testid[39m=[32m"icon-flask"[39m
            [33mtrae-inspector-end-column[39m=[32m"54"[39m
            [33mtrae-inspector-end-line[39m=[32m"13"[39m
            [33mtrae-inspector-file-path[39m=[32m"src\\\\experiments\\\\__tests__\\\\ChemistryLab.test.tsx"[39m
            [33mtrae-inspector-start-column[39m=[32m"22"[39m
            [33mtrae-inspector-start-line[39m=[32m"13"[39m
            [33mtrae-inspector-static-props[39m=[32m"%7B%22cwd%22%3A%22E%3A%5C%5CAAA%20My%20New%20Project%5C%5CTrying%20to%20make%20a%20YaoXue%20Design%22%7D"[39m
          [36m/>[39m
          [0m 试剂架[0m
        [36m</h3>[39m
        [36m<div[39m
          [33mclass[39m=[32m"grid grid-cols-2 gap-3"[39m
          [33mtrae-inspector-end-column[39m=[32m"14"[39m
          [33mtrae-inspector-end-line[39m=[32m"107"[39m
          [33mtrae-inspector-file-path[39m=[32m"src\\\\experiments\\\\ChemistryLab.tsx"[39m
          [33mtrae-inspector-start-column[39m=[32m"8"[39m
          [33mtrae-inspector-start-line[39m=[32m"102"[39m
          [33mtrae-inspector-static-props[39m=[32m"%7B%22cwd%22%3A%22E%3A%5C%5CAAA%20My%20New%20Project%5C%5CTrying%20to%20make%20a%20YaoXue%20Design%22%7D"[39m
        [36m>[39m
          [36m<button[39m
            [33mclass[39m=[32m"flex flex-col items-center justify-center p-3 bg-slate-600 hover:bg-slate-500 rounded-lg transition-all active:scale-95"[39m
            [33mtrae-inspector-end-column[39m=[32m"11"[39m
            [33mtrae-inspector-end-line[39m=[32m"176"[39m
            [33mtrae-inspector-file-path[39m=[32m"src\\\\experiments\\\\ChemistryLab.tsx"[39m
            [33mtrae-inspector-start-column[39m=[32m"2"[39m
            [33mtrae-inspector-start-line[39m=[32m"170"[39m
            [33mtrae-inspector-static-props[39m=[32m"%7B%22cwd%22%3A%22E%3A%5C%5CAAA%20My%20New%20Project%5C%5CTrying%20to%20make%20a%20YaoXue%20Design%22%7D"[39m
          [36m>[39m
            [36m<div[39m
              [33mdata-testid[39m=[32m"icon-droplets"[39m
              [33mtrae-inspector-end-column[39m=[32m"53"[39m
              [33mtrae-inspector-end-line[39m=[32m"14"[39m
              [33mtrae-inspector-file-path[39m=[32m"src\\\\experiments\\\\__tests__\\\\ChemistryLab.test.tsx"[39m
              [33mtrae-inspector-start-column[39m=[32m"18"[39m
              [33mtrae-inspector-start-line[39m=[32m"14"[39m
              [33mtrae-inspector-static-props[39m=[32m"%7B%22cwd%22%3A%22E%3A%5C%5CAAA%20My%20New%20Project%5C%5CTrying%20to%20make%20a%20YaoXue%20Design%22%7D"[39m
            [36m/>[39m
            [36m<span[39m
              [33mclass[39m=[32m"text-xs mt-1"[39m
              [33mtrae-inspector-end-column[39m=[32m"49"[39m
              [33mtrae-inspector-end-line[39m=[32m"175"[39m
              [33mtrae-inspector-file-path[39m=[32m"src\\\\experiments\\\\ChemistryLab.tsx"[39m
              [33mtrae-inspector-start-column[39m=[32m"4"[39m
              [33mtrae-inspector-start-line[39m=[32m"175"[39m
              [33mtrae-inspector-static-props[39m=[32m"%7B%22cwd%22%3A%22E%3A%5C%5CAAA%20My%20New%20Project%5C%5CTrying%20to%20make%20a%20YaoXue%20Design%22%7D"[39m
            [36m>[39m
              [0m蒸馏水[0m
            [36m</span>[39m
          [36m</button>[39m
          [36m<button[39m
            [33mclass[39m=[32m"flex flex-col items-center justify-center p-3 bg-slate-600 hover:bg-slate-500 rounded-lg transition-all active:scale-95"[39m
            [33mtrae-inspector-end-column[39m=[32m"11"[39m
            [33mtrae-inspector-end-line[39m=[32m"176"[39m
            [33mtrae-inspector-file-path[39m=[32m"src\\\\experiments\\\\ChemistryLab.tsx"[39m
            [33mtrae-inspector-start-column[39m=[32m"2"[39m
            [33mtrae-inspector-start-line[39m=[32m"170"[39m
            [33mtrae-inspector-static-props[39m=[32m"%7B%22cwd%22%3A%22E%3A%5C%5CAAA%20My%20New%20Project%5C%5CTrying%20to%20make%20a%20YaoXue%20Design%22%7D"[39m
          [36m>[39m
            [36m<div[39m
              [33mdata-testid[39m=[32m"icon-droplets"[39m
              [33mtrae-inspector-end-column[39m=[32m"53"[39m
              [33mtrae-inspector-end-line[39m=[32m"14"[39m
              [33mtrae-inspector-file-path[39m=[32m"src\\\\experiments\\\\__tests__\\\\ChemistryLab.test.tsx"[39m
              [33mtrae-inspector-start-column[39m=[32m"18"[39m
              [33mtrae-inspector-start-line[39m=[32m"14"[39m
              [33mtrae-inspector-static-props[39m=[32m"%7B%22cwd%22%3A%22E%3A%5C%5CAAA%20My%20New%20Project%5C%5CTrying%20to%20make%20a%20YaoXue%20Design%22%7D"[39m
            [36m/>[39m
            [36m<span[39m
              [33mclass[39m=[32m"text-xs mt-1"[39m
              [33mtrae-inspector-end-column[39m=[32m"49"[39m
              [33mtrae-inspector-end-line[39m=[32m"175"[39m
              [33mtrae-inspector-f...
    at Object.getElementError (E:\AAA My New Project\Trying to make a YaoXue Design\node_modules\@testing-library\dom\dist\config.js:37:19)
    at E:\AAA My New Project\Trying to make a YaoXue Design\node_modules\@testing-library\dom\dist\query-helpers.js:76:38
    at E:\AAA My New Project\Trying to make a YaoXue Design\node_modules\@testing-library\dom\dist\query-helpers.js:52:17
    at getByText (E:\AAA My New Project\Trying to make a YaoXue Design\node_modules\@testing-library\dom\dist\query-helpers.js:95:19)
    at E:/AAA My New Project/Trying to make a YaoXue Design/src/experiments/__tests__/ChemistryLab.test.tsx:33:19
    at file:///E:/AAA%20My%20New%20Project/Trying%20to%20make%20a%20YaoXue%20Design/node_modules/@vitest/runner/dist/index.js:145:11
    at file:///E:/AAA%20My%20New%20Project/Trying%20to%20make%20a%20YaoXue%20Design/node_modules/@vitest/runner/dist/index.js:915:26
    at file:///E:/AAA%20My%20New%20Project/Trying%20to%20make%20a%20YaoXue%20Design/node_modules/@vitest/runner/dist/index.js:1243:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///E:/AAA%20My%20New%20Project/Trying%20to%20make%20a%20YaoXue%20Design/node_modules/@vitest/runner/dist/index.js:1209:10)
  ```
- ✔ **logs init action on mount** (14.248700000000099ms)
- ✔ **adds water correctly** (29.57459999999992ms)
- ✔ **simulates acid addition and PH change** (23.230500000001484ms)
- ✔ **resets the beaker** (30.753499999998894ms)

### ✅ Auth.test.tsx

- ✔ **renders login form by default** (68.11670000000231ms)
- ✔ **switches to signup form** (25.78399999999965ms)
- ✔ **validates password match on signup** (40.22479999999996ms)
- ✔ **allows submission when passwords match and strong** (40.93530000000101ms)
- ✔ **handles rate limit error gracefully** (40.55630000000019ms)

