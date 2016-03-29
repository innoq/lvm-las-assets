# Preview

The preview module is used to render a preview for a link to a page. The preview can be either or both of these:

* An indicator showing the number of items on the remote page
* A preview window

If the remote page is not reachable, it will show a warning indicator.

## Usage

```html
<a href="/example"
   class="preview"
   data-preview="enabled"
   data-preview-title="Example Preview"
   data-preview-selector="table.example"
   data-preview-error-msg="Example Service not reachable"
   data-preview-count="tbody>tr"
   data-preview-window>
  <span class="icon-mail-2-filled icon-lg"></span>
</a>
```

### Options

The component expects a link with the attribute `data-preview="enabled"` and an `href`, which is then used to fetch the page. To use the according styling use the `preview` class. You can use either or both of these options:

* `data-preview-window`: If this option is passed, the preview window will be shown. Otherwise the link will remain as a link.
* `data-preview-count`: This expects a CSS selector. The number of elements matching this CSS selector will be counted and the number will be displayed as an indicator.

Additionally:

* `data-preview-title`: The title of the preview window
* `data-preview-selector`: The CSS selector for the part of remote page you want to display
* `data-preview-error-msg`: The Error message that is shown if the service is not reachable

### HTTP Headers

The request is sent with the HTTP header `Embedded` set to `"true"`. The remote page can use this to adjust the output accordingly.
