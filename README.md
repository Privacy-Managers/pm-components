# Web Components

[![Build Status](https://travis-ci.com/Manvel/webcomponents.svg?branch=master)](https://travis-ci.com/Manvel/webcomponents)

Collection of Web Components for my various projects:
- [Setting list](https://manvel.github.io/webcomponents/components/tests/smoke/setting-list/setting-list.html) - Toggle switch to be used by [Privacy Manager](https://github.com/Manvel/Privacy-Manager).
- [Table list](https://manvel.github.io/webcomponents/components/tests/smoke/table-list/table-list.html) - Table list to be used by [Privacy Manager](https://github.com/Manvel/Privacy-Manager).
- [pm-modal](https://manvel.github.io/webcomponents/components/tests/smoke/pm-modal/pm-modal.html) - Modal dialog to be used by [Privacy Manager](https://github.com/Manvel/Privacy-Manager).
- [pm-tab-panel](https://manvel.github.io/webcomponents/components/tests/smoke/pm-tab-panel/pm-tab-panel.html) - Tab panel to be used by [Privacy Manager](https://github.com/Manvel/Privacy-Manager).
- [pm-button](https://manvel.github.io/webcomponents/components/tests/smoke/pm-button/pm-button.html) - Button to be used by [Privacy Manager](https://github.com/Manvel/Privacy-Manager).


## Development

```
npm start // Starts server
npm run test:puppeteer // Launch puppeteer tests
```

## Structure

- [components/src](components/src) - Source codes
- [components/tests/smoke](components/tests/smoke) - Smoke tests
  - GOTO: [http://127.0.0.1:3000/tests/smoke/](http://127.0.0.1:3000/tests/smoke/)
- [components/tests/smoke](components/tests/puppeteer) - Automated tests
