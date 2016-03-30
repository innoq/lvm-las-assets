# DependentInputs

The DependentInputs module is used to reset dependent input fields based on html data-attributes.

## Usage

```html
<form action="..." method="post">
  ...
  <input type="text" id="foo" name="foo" value="foo">
  ...
  <input type="text" name="bar" value="bar" data-dependent="true" data-depends-on="#foo" data-error-msg="'#foo' was changed. Resetting 'bar'">
  ...
</form>
```

### Options

The component expects a input text field with the attribute `data-dependent="true"` and an `data-depends-on` data-attribute with an valid selector to the dependent input field. This component listens on the `change`-Event
of the dependent input field.

Additionally:

* `data--error-msg`: The Error message that is shown in an basic javascript alert after the dependent field was changed. Without this attribute the field will be cleared without an alert-message.
