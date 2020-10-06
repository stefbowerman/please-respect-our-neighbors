<template>
  <div>
    <project-listing
      v-for="(project, i) in projects"
      :project="project"
      :key="`project-${i}`"
    />
  </div>
</template>

<script>
import _get from 'lodash/get'
import _uniq from 'lodash/uniq'

import projectListing from '~/components/project/ProjectListing'

export default {
  components: {
    projectListing
  },
  data() {
    return {
      projects: [],
      yearsActive: []
    }
  },
  mounted() {
    console.log(this.projects)
    this.$store.commit('SET_THEME', 'black')
    this.$store.commit('SET_HEADER_TITLE', 'Accumulated Projects')
    this.$store.commit('SET_HEADER_SUBTITLE', this.subtitle)    
  },
  beforeDestroy() {
    this.$store.commit('SET_THEME', '')
  },
  computed: {
    subtitle() {
      return `Collected Works ${[this.firstYearActive, this.lastYearActive].join(' - ')}`
    },
    // @TODO - Could probably do this better
    firstYearActive() {
      return this.yearsActive[0]
    },
    lastYearActive() {
      return this.yearsActive[this.yearsActive.length - 1]
    }
  },
  async asyncData({ $prismic, error, store }) {
    let yearsActive = [] //
    const projectData = await $prismic.api.query(
      $prismic.predicates.at('document.type', 'project', { orderings: '[my.project.date asc]'})
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

    // Sort oldest -> newest
    // Extract yearsActive while we're doing it
    projects.sort((a, b) => {
      const aDate = new Date(a.date)
      const bDate = new Date(b.date)

      yearsActive.push(aDate.getFullYear())
      yearsActive.push(bDate.getFullYear())

      return aDate >= bDate ? -1 : 1
    })

    yearsActive = _uniq(yearsActive.sort(), true)

    return {
      projects,
      yearsActive 
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
// .project-listing {
//   margin: 50px 0;
// }
</style>