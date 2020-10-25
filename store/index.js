import _get from 'lodash/get'

// Define State defaults
export const state = () => ({
  siteSettings: {
    title: '',
    description: '',
    imageUrl: '',
    footerText: '',
    exhibitedProjectUID: '',
    faviconImage: {},
    touchIcon: {}
  },
  theme: '',
  pageTitle: {
    title: '',
    subtitle: '',
    height: 0,
  },
  overlayOpen: false,
  mobileMenuOpen: false,
  isTouch: false,
  indexViewed: false,
  projects: []
})

// Define mutations
export const mutations = {
  SET_SITE_SETTINGS(state, data) {
    state.siteSettings = data
  },  
  SET_THEME(state, data) {
    state.theme = data
  },
  SET_PAGE_TITLE_TITLE(state, data) {
    state.pageTitle.title = data
  },
  SET_PAGE_TITLE_SUBTITLE(state, data) {
    state.pageTitle.subtitle = data
  },
  SET_PAGE_TITLE_HEIGHT(state, data) {
    state.pageTitle.height = parseInt(data)
  },
  SET_OVERLAY_OPEN(state, data) {
    state.overlayOpen = data
  },
  SET_MOBILE_MENU_OPEN(state, data) {
    state.mobileMenuOpen = data
  },
  SET_IS_TOUCH(state, data) {
    state.isTouch = !!data
  },
  SET_INDEX_VIEWED(state, data) {
    state.indexViewed = data
  },
  SET_PROJECTS(state, data) {
    state.projects = data
  }
}

// Define actions
export const actions = {
  async nuxtServerInit(store) {
    // Make all requests in parallel
    const data = await Promise.all([
      store.dispatch('QUERY_SETTINGS'),
      store.dispatch('QUERY_PROJECTS')
    ])
  },

  async QUERY_SETTINGS({ dispatch, commit }) {
    const response = await this.$prismic.api.getSingle('site_settings')
    
    const data = response.data

    const settings = {
      title: this.$prismic.asText(data.title),
      description: this.$prismic.asText(data.description),
      imageUrl: _get(data, 'image.url', ''),
      footerText: this.$prismic.asText(data.footer_text),
      exhibitedProjectUID: _get(data, 'exhibited_project.uid', ''),
      faviconImage: _get(data, 'favicon_image', {}),
      touchIcon: _get(data, 'touch_icon', {})
    }

    commit('SET_SITE_SETTINGS', settings)
  },

  async QUERY_PROJECTS({ dispatch, commit }) {
    const projectsData = await this.$prismic.api.query(
      this.$prismic.predicates.at('document.type', 'project')
    )

    const partnersData = await this.$prismic.api.query(
      this.$prismic.predicates.at('document.type', 'partner')
    )

    const partners = partnersData.results.map(partner => {
      return {
        ...partner.data,
        id: partner.id,
        uid: partner.uid        
      }
    })

    const projects = projectsData.results.map(project => {
      const projectPartnerIds = project.data.partners_involved.map(item => item.partner.id)

      // Pull the full partner info from the store and add it to the project
      const projectPartners = partners.filter(p => projectPartnerIds.includes(p.id))

      return {
        ...project.data,
        uid: project.uid,
        slices: _get(project, 'data.body', []),
        partners: projectPartners // Add project property with linked partners
      }
    })

    // Sort oldest -> newest based on project end_date (or start date if end isn't supplied)
    projects.sort((a, b) => {
      const aDate = new Date(a.end_date || a.start_date)
      const bDate = new Date(a.end_date || a.start_date)

      return aDate >= bDate ? -1 : 1
    })    

    commit('SET_PROJECTS', projects)
  }
}
