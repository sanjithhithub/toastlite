# toastlite

A tiny, zero-dependency toast notification library for the browser. No build step, no frameworks — just HTML, CSS, and JavaScript.

## Features

- 4 types: `success`, `error`, `warning`, `info`
- 6 positions (top/bottom × left/right/center)
- Auto-dismiss with animated progress bar
- Close button and click-to-dismiss
- Custom title, message, and duration
- Works via `<script>` tag, CommonJS, or AMD — no build tools
- ~2 KB minified, zero dependencies

## Install

```bash
npm install toastlite
```

## Quick Start

### Script tag

```html
<link rel="stylesheet" href="toastlite/src/toast.css" />
<script src="toastlite/src/toast.js"></script>
<script>
  Toast.success('Saved!');
</script>
```

### CommonJS

```js
const Toast = require('toastlite');
require('toastlite/src/toast.css');
```

### ESM / Bundlers

```js
import Toast from 'toastlite';
import 'toastlite/src/toast.css';
```

## Usage

```js
Toast('Hello, world!');

Toast.success('Changes saved successfully.');
Toast.error('Something went wrong.');
Toast.warning('Please check your input.');
Toast.info('You have 3 new messages.');
```

### Options

Pass options as a second argument (or as the only argument to the convenience methods):

```js
Toast.info('Hey there', {
  type: 'info',            // success | error | warning | info
  title: 'Custom Title',   // defaults to the type name
  duration: 5000,          // ms; 0 = stays until dismissed
  position: 'bottom-right' // top-right, top-left, top-center, bottom-right, bottom-left, bottom-center
  progressBar: true,       // show animated progress bar
  closable: true,          // show close button
  clickToDismiss: true,    // click the toast to dismiss it
});
```

### Manual dismissal

```js
const t = Toast.warning('Persistent warning', { duration: 0 });
// later...
Toast.dismiss(t);
```

## API

| Method | Description |
| --- | --- |
| `Toast(message, options?)` | Show a toast (defaults to `info`) |
| `Toast.success(message, options?)` | Show a success toast |
| `Toast.error(message, options?)` | Show an error toast |
| `Toast.warning(message, options?)` | Show a warning toast |
| `Toast.info(message, options?)` | Show an info toast |
| `Toast.dismiss(toastEl)` | Dismiss a toast element |
| `Toast.defaults` | Global default options object |

## Development

```bash
npm run serve   # serve the folder locally
npm run open    # serve and open in browser
npm test        # syntax check the library
```

## Demo

Open `src/index.html` in a browser, or run `npm run open`.

## License

MIT
