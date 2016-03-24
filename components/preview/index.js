import $ from 'jquery'

const renderPreviewTitle = (title, uri) => {
  const previewTitle = `<h3 class="collection-excerpt-title">
                            ${title}
                            <a href="${uri}" class="collection-link">Alle anzeigen</a>
                        </h3>`
  return $(previewTitle).html()
}

module.exports = (el) => {
  el = $(el)

  $.get(el.attr('href')).done((responseHtml) => {
    const selector = el.data('preview-selector')
    const content = $(selector, $.parseHTML(responseHtml))

    if (el.data('preview-count-selector')) {
      const count = content.find(el.data('preview-count-selector')).length
      el.attr('data-bubble', count)
    }

    el.data({
      content: content,
      html: true,
      placement: 'bottom',
      title: renderPreviewTitle(el.data('preview-title'), el.attr('href')),
      toggle: 'popover'
    }).on('click', (e) => {
      e.preventDefault()
    }).popover({
      container: 'body',
      trigger: 'click'
    })
  }).fail(() => {
    el.attr('data-bubble', '!')
    el.data({
      content: el.data('preview-error-msg'),
      placement: 'bottom',
      toggle: 'popover'
    }).on('click', (e) => {
      e.preventDefault()
    }).popover({
      container: 'body',
      trigger: 'hover focus'
    })
  })
}
