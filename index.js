const $ = require('jquery')
// shim required for non-CommonJS libraries
global.jQuery = global.$ = $
// most widgets initialized via markup
require('bootstrap')
const shortcutsInfo = require('./src/scripts/shortcuts')
const OneBox = require('./src/scripts/onebox')
const StickyNav = require('stickynav')
const collectionPreview = require('./src/scripts/collection_preview')
// XXX: bad name
const gridSelector = require('./src/scripts/grid_selector')
const ediTable = require('./src/scripts/editable')
const Accordion = require('./src/scripts/accordion')
const listing = require('./src/scripts/listing')
const enablePreview = require('./components/preview')
const enableDependentInputs = require('./components/dependentInputs')

$(() => {
  shortcutsInfo()

  $('[data-dependent=true]').each((i, node) => { enableDependentInputs(node) })
  $('[data-preview=enabled]').each((i, node) => { enablePreview(node) })
  $('.onebox').each((i, node) => { new OneBox(node) })
  $('a.collection-preview').each((i, node) => { new collectionPreview(node) })
  // XXX: bad class name
  $('.expandable-grid').each((i, node) => { gridSelector(node) })
  $('table.extensible').each((i, node) => { new ediTable(node) })
  $('[data-accordion=active]').each((i, node) => { new Accordion(node) })

  new StickyNav($('[data-position=sticky]'), {
    fixedClass: 'is-fixed'
  })

  $('table, ul, ol').filter('.sortable, .filterable').each((i, node) => {
    const wrapper = listing(node)
    // app-specific adjustments
    // XXX: inelegant, but should be rendered (and functional) server-side anyway
    const filter = wrapper.find('input.search').attr('placeholder', 'Filtern')
    let header = wrapper.prev('.listing-header')
    if (header.length === 0) { // responsive table
      header = wrapper.closest('.table-responsive').prev('.listing-header')
    }
    if (filter.length && header.length) {
      filter.appendTo(header)
    }
  })

  // initialize Bootstrap widgets

  $('[data-toggle=tooltip]').tooltip()

  $('[data-toggle=popover]').popover({
    trigger: 'hover focus',
    container: 'body'
  })

  // ensure drop-down menus do not extend beyond the viewport
  $('.dropdown').on('shown.bs.dropdown', (ev, ctx) => {
    const menu = $('.dropdown-menu', this)
    const max = $(window).width()
    const right = menu.offset().left + menu.outerWidth()
    if (right > max) {
      menu.css('transform', `translateX(${max - right}px)`)
    }
  })

  // Clone some markup in order to avoid styling for breakpoints in JS
  // Also see src/styles/customer-card.less
  $('.customer-card-portfolio').clone().prependTo('.customer-card-details')
  $('.customer-card-flags').clone().prependTo('.customer-card-details')
  $('.customer-card-drawer').clone().appendTo('.customer-card-details')
})
