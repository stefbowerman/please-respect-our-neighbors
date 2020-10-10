import _get from 'lodash/get'

// Define State defaults
export const state = () => ({
  siteSettings: {
    title: '',
    description: '',
    imageURL: '',
    footerText: '',
    exhibitedProjectUID: ''
  },
  theme: '',
  header: {
    title: '',
    subtitle: ''
  },
  overlayOpen: false,
  mobileMenuOpen: false,
  indexViewed: false,
  partners: []
})

// Define mutations
export const mutations = {
  SET_SITE_SETTINGS(state, data) {
    state.siteSettings = data
  },  
  SET_THEME(state, data) {
    state.theme = data
  },
  SET_HEADER_TITLE(state, data) {
    state.header.title = data
  },
  SET_HEADER_SUBTITLE(state, data) {
    state.header.subtitle = data
  },
  SET_OVERLAY_OPEN(state, data) {
    state.overlayOpen = data
  },
  SET_MOBILE_MENU_OPEN(state, data) {
    state.mobileMenuOpen = data
  },
  SET_INDEX_VIEWED(state, data) {
    state.indexViewed = data
  },    
  SET_PARTNERS(state, data) {
    state.partners = data
  }
}

// Define actions
export const actions = {
  async nuxtServerInit(store) {
    // Make all requests in parallel
    const data = await Promise.all([
      store.dispatch('QUERY_SETTINGS'),
      store.dispatch('QUERY_PARTNERS')
    ])
  },

  async QUERY_SETTINGS({ dispatch, commit }) {
    const response = await this.$prismic.api.getSingle('site_settings')
    
    const data = response.data

    const settings = {
      title: this.$prismic.asText(data.title),
      description: this.$prismic.asText(data.description),
      imageURL: _get(data, 'image.url', ''),
      footerText: this.$prismic.asText(data.footer_text),
      exhibitedProjectUID: _get(data, 'exhibited_project.uid', '')
    }

    commit('SET_SITE_SETTINGS', settings)
  },

  async QUERY_PARTNERS({ dispatch, commit }) {
    const data = await this.$prismic.api.query(
      this.$prismic.predicates.at('document.type', 'partner')
    )

    const partners = data.results.map(partner => {
      const p = {
        ...partner.data,
        id: partner.id,
        uid: partner.uid        
      }

      return p
    })

    commit("SET_PARTNERS", partners)
  },    
}
