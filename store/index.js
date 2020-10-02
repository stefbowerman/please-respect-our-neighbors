import _get from 'lodash/get'

// Define State defaults
export const state = () => ({
  siteSettings: {
    title: '',
    description: '',
    imageURL: '',
    footerText: ''
  },
  partners: []
})

// Define mutations
export const mutations = {
  SET_SITE_SETTINGS(state, data) {
    state.siteSettings = data
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
      footerText: this.$prismic.asText(data.footer_text)
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
