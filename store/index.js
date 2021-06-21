import _get from 'lodash/get'
import getTheme from '~/utils/getTheme'

// Define State defaults
export const state = () => ({
  siteSettings: {
    title: '',
    description: '',
    imageUrl: '',
    footerText: '',
    exhibitedProjectUID: '',
    faviconImage: {},
    touchIcon: {},
    gaMeasurementID:  '',
    klaviyoListID: null
  },
  windowWidth: 0,
  theme: '',
  overlayOpen: false,
  mobileMenuOpen: false,
  isTouch: false,
  isDragging: false,
  indexViewed: false,
  projects: [],
  visiblePartnerPreviewUUID: null
})

// Define mutations
export const mutations = {
  SET_SITE_SETTINGS(state, data) {
    state.siteSettings = data
  },
  SET_WINDOW_WIDTH(state, data) {
      state.windowWidth = data
  },  
  SET_THEME(state, data) {
    state.theme = data
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
  SET_IS_DRAGGING(state, data) {
    state.isDragging = data
  },  
  SET_INDEX_VIEWED(state, data) {
    state.indexViewed = data
  },
  SET_PROJECTS(state, data) {
    state.projects = data
  },
  SET_VISIBLE_PARTNER_PREVIEW_UUID(state, data) {
    state.visiblePartnerPreviewUUID = data
  }
}

// Define actions
export const actions = {
  async nuxtServerInit({ dispatch, commit }, { route }) {
    commit('SET_THEME', getTheme(route))

    // Make all requests in parallel
    const data = await Promise.all([
      dispatch('QUERY_SETTINGS'),
      dispatch('QUERY_PROJECTS')
    ])
  },

  async QUERY_SETTINGS({ dispatch, commit }) {
    const { data } = await this.$prismic.api.getSingle('site_settings')
    
    const settings = {
      title: this.$prismic.asText(data.title),
      description: this.$prismic.asText(data.description),
      imageUrl: _get(data, 'image.url', ''),
      footerText: this.$prismic.asText(data.footer_text),
      exhibitedProjectUID: _get(data, 'exhibited_project.uid', ''),
      faviconImage: _get(data, 'favicon_image', {}),
      touchIcon: _get(data, 'touch_icon', {}),
      gaMeasurementID: data.ga_measurement_id,
      klaviyoListID: data.klaviyo_list_id
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

    commit('SET_PROJECTS', projects)
  }
}
