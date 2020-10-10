<template>
  <div style="margin-top: 300px;">
    <project
      v-for="(project, i) in projects"
      :project="project"
      :key="`project-${i}`"
    />
  </div>
</template>

<script>
import _get from 'lodash/get'
import _uniq from 'lodash/uniq'

import project from '~/components/project/Project'

export default {
  components: {
    project
  },
  data() {
    return {
      projects: [],
      yearsActive: [],
      selectedProject: null
    }
  },
  mounted() {
    this.$store.commit('SET_THEME', 'black')
    this.$store.commit('SET_HEADER_TITLE', 'Accumulated Projects')
    this.$store.commit('SET_HEADER_SUBTITLE', this.subtitle)

    if (this.selectedProject) {
      console.log(`scroll to -> ${this.selectedProject}`)
    }  
  },
  beforeDestroy() {
    this.$store.commit('SET_THEME', '')
  },
  computed: {
    subtitle() {
      // const dates = this.firstYearActive === this.lastYearActive ? '' : [this.firstYearActive, this.lastYearActive].join('—')
      const dates = [2018, 2020].join('—') // @TODO - Finish computing this from array of 'start' and 'end' dates... or just let them set the page subtitle?

      return `Collected Works ${dates}`
    },
    // @TODO - Could probably do this better
    firstYearActive() {
      return this.yearsActive[0]
    },
    lastYearActive() {
      return this.yearsActive[this.yearsActive.length - 1]
    }
  },
  async asyncData({ $prismic, error, store, route }) {
    let yearsActive = [] //
    let selectedProject

    const projectData = await $prismic.api.query(
      $prismic.predicates.at('document.type', 'project')
    )

    const projects = projectData.results.map(project => {
      const projectPartnerIds = project.data.partners_involved.map(el => el.partner.id)

      // Pull the full partner info from the store and add it to the project
      const projectPartners = store.state.partners.filter(p => projectPartnerIds.includes(p.id))

      return {
        ...project.data,
        uid: project.uid,
        slices: _get(project, 'data.body', []),
        partners: projectPartners // Add project property with linked partners
      }
    })

    // Sort oldest -> newest based on project end_date (or start date if end isn't supplied)
    // Extract yearsActive while we're doing it
    projects.sort((a, b) => {
      const aDate = new Date(a.end_date || a.start_date)
      const bDate = new Date(a.end_date || a.start_date)

      yearsActive.push(aDate.getFullYear())
      yearsActive.push(bDate.getFullYear())

      return aDate >= bDate ? -1 : 1
    })

    yearsActive = _uniq(yearsActive.sort(), true)
    selectedProject = Boolean(route.params.uid) ? route.params.uid : null

    return {
      projects,
      yearsActive,
      selectedProject
    }
  },  
  head() {
    return {
      title: 'Projects', // @TODO - Pull this from store / API
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'All our work in one place'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  margin: 100px 0;
}
</style>