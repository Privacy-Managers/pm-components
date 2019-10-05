# Web Components

[![Build Status](https://travis-ci.com/Manvel/webcomponents.svg?branch=master)](https://travis-ci.com/Manvel/webcomponents)

Web components for Privacy Manager:
- [pm-toggle](https://pm-components.netlify.com/pm-toggle) - Toggle switch to be used by [Privacy Manager](https://github.com/Manvel/Privacy-Manager).
- [pm-table](https://pm-components.netlify.com/pm-table) - Table to be used by [Privacy Manager](https://github.com/Manvel/Privacy-Manager).
- [pm-dialog](https://pm-components.netlify.com/pm-dialog) - Modal dialog to be used by [Privacy Manager](https://github.com/Manvel/Privacy-Manager).
- [pm-tab-panel](https://pm-components.netlify.com/pm-tab-panel) - Tab panel to be used by [Privacy Manager](https://github.com/Manvel/Privacy-Manager).
- [pm-button](https://pm-components.netlify.com/pm-button) - Button to be used by [Privacy Manager](https://github.com/Manvel/Privacy-Manager).

## Development

```
npm start // Starts server
npm test // Launch puppeteer tests
```

## Structure

- [components/src](components/src) - Source codes
- [components/tests/smoke](components/tests/smoke) - Smoke tests
  - GOTO: [http://127.0.0.1:3000/tests/smoke/](http://127.0.0.1:3000/tests/smoke/)
- [components/tests/smoke](components/tests/puppeteer) - Automated tests

## Deployment

Deploying to the `gh-pages` branch for the Github demo:

```
npm run deploy
```