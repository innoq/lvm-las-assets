import $ from 'jquery'

module.exports = (el) => {
  el = $(el)

  let dependsOnSelector = escapeSelector(el.data('depends-on'))
  let dependsOn = $(dependsOnSelector)

  dependsOn.change((e) => {
    // optional alert
    let errorMsg = el.data('error-msg')
    if (errorMsg) {
      alert(errorMsg)
    }

    // clear input
    el.val('')
  })
}

const escapeSelector = (selector) => {
  // TODO: add other escaping chars
  const escapedSelector = selector.replace('.', '\\.')
  return escapedSelector
}
