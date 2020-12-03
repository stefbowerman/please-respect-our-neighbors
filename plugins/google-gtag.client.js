import _get from 'lodash/get'

export default ({ store, app: { router, context } }, inject) => {
  const measurementID = _get(store, 'state.siteSettings.gaMeasurementID', '')

  if(measurementID === '') {
    console.log('no measurement ID')
    inject('gtag', () => {})
    return
  }

  // Abort if in Dev mode, but inject dummy functions so $gtag events don't throw errors
  if (context.isDev) {
    console.log("No Google Anlaytics tracking becuase your are in Dev mode")
    inject('gtag', () => {})
    return
  }

  // Abort if we already added script to head
  let gtagScript = document.getElementById('gtag')

  if (gtagScript) {
    return
  }

  // Add script tag to head
  let script = document.createElement('script')
  script.async = true
  script.id = 'gtag'
  script.src = '//www.googletagmanager.com/gtag/js'
  document.head.appendChild(script)

  // Include Google gtag code and inject it (so this.$gtag works in pages/components)
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  inject('gtag', gtag)
  gtag('js', new Date())

  gtag('config', measurementID, {
    send_page_view: false // Necessary to avoid duplicated page track on first page load
  })

  // After each router transition, log page event to Google
  router.afterEach(to => {
    gtag('event', 'page_view', {
      page_path: to.fullPath,
      send_to: measurementID
    })
  })
}
