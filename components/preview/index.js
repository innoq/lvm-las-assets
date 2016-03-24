import $ from 'jquery'

const renderPreviewTitle = (title, uri) => {
  const previewTitle = `<h3 class="collection-excerpt-title">
                            ${title}
                            <a href="${uri}" class="collection-link">Alle anzeigen</a>
                        </h3>`
  return $(previewTitle).html()
}

const headers = {
  Embedded: 'true'
}

module.exports = (el) => {
  el = $(el)

  $.ajax(el.attr('href'), { headers: headers }).done((responseHtml) => {
    const selector = el.data('preview-selector')
    const content = $(selector, $.parseHTML(responseHtml))

    if (el.data('preview-count')) {
      const count = content.find(el.data('preview-count')).length
      el.attr('data-bubble', count)
    }

    if (el.data('preview-window') === '') {
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
    }
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
