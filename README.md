# LVM LAS Assets

Assets for LVM LAS projects including JavaScript and CSS.

## Modules

### Preview

The preview module is used to render a preview for a link to a page with a table. The preview is a pop up. Additionally it will count the number of entries in the table to show a small indicator. If the page is not reachable, it will show a warning indicator.

#### Usage

```html
<a href="/example"
   class="notification-menu"
   data-preview="enabled"
   data-preview-title="Example Preview"
   data-preview-selector="table.example"
   data-preview-error-msg="Example Service not reachable">
  <span class="icon-mail-2-filled icon-lg"></span>
</a>
```

The component expects a link with the attribute `data-preview="enabled"` and an `href`, which is then used to fetch the preview. To use the according styling use the `notification-menu` class. Additionally:

* `data-preview-title`: The title of the preview window
* `data-preview-selector`: The CSS selector for the table on the remote page
* `data-preview-error-msg`: The Error message that is shown if the service is not reachable

## Contributing

* ensure [Node](http://nodejs.org) and the dependencies (via `npm install`) are installed
* `npm install` downloads dependencies
* `npm run compile` performs a one-time compilation, generating `dist/bundle.js`
* `npm start` automatically recompiles while monitoring code changes
* `npm test` checks code for stylistic consistency
