<template>
  <div style="margin-top: 300px;">
    <project
      v-for="(project, i) in projects"
      :project="project"
      :key="`project-${i}`"
      ref="projects"
    />
  </div>
</template>

<script>
import _get from 'lodash/get'
import _uniq from 'lodash/uniq'
import _throttle from 'lodash/throttle'
import _clamp from 'lodash/clamp'

import project from '~/components/project/Project'

export default {
  components: {
    project
  },
  data() {
    return {
      projects: [],
      selectedProject: null
    }
  },
  beforeCreate() {
    this.$store.commit('SET_THEME', 'dark')
  },  
  mounted() {
    this.$store.commit('SET_HEADER_TITLE', 'Accumulated Projects')
    this.$store.commit('SET_HEADER_SUBTITLE', this.subtitle)

    this.throttledOnScroll = _throttle(this.onScroll, 100)
    this.throttledOnResize = _throttle(this.onResize, 250)

    // If selected project, wait until after scroll is complete to attach the scroll handler ?
    // or just add a flag to ignore scroll ?
    window.addEventListener('scroll', this.throttledOnScroll)
    window.addEventListener('resize', this.throttledOnResize)    

    // @TODO - Testing to see if this works...
    if (this.selectedProject) {
      const projectIndex = this.projects.findIndex(project => project.uid === this.selectedProject)

      setTimeout(() => {
        window.scrollTo({
          // top: this.$refs.projects[projectIndex].$el.offsetTop,
          top: this.$refs.projects[projectIndex].$el.getBoundingClientRect().top,
          behavior: 'smooth'
        });
      }, 1000)
    }  
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.throttledOnScroll)
    window.removeEventListener('resize', this.throttledOnResize)
  },
  methods: {
    onScroll() {
      this.checkVisibleProject()
    },
    onResize() {
      this.checkVisibleProject()
    },
    checkVisibleProject() {
      // @TODO - this.$refs.project-* should maybe just be this.$refs.projects and pull based on index?

      // const winH = window.innerHeight
      // const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      // const triggerPoint = scrollTop + (winH * 0.4) // Slice is ~40% on screen

      // // Find the project which straddles the triggerPoint of the screen
      // const i = this.$refs.projects.findIndex(ref => {
      //   const rect = ref.$el.getBoundingClientRect()
      //   const h = rect.height
      //   const top = rect.y
      //   const bottom = top + h

      //   return top < triggerPoint && bottom >= triggerPoint
      // })

      // // i can be -1 if none found
      // this.currentSliceIndex = _clamp(i, 0, this.projects.length - 1)

      // console.log(this.currentSliceIndex) 
    }
  },
  computed: {
    subtitle() {
      // const dates = this.firstYearActive === this.lastYearActive ? '' : [this.firstYearActive, this.lastYearActive].join('—')
      const dates = [2018, 2020].join('—') // @TODO - Finish computing this from array of 'start' and 'end' dates... or just let them set the page subtitle?

      return `Collected Works ${dates}`
    }
  },
  async asyncData({ $prismic, error, store, route }) {
    const projects = store.state.projects
    const selectedProject = Boolean(route.params.uid) ? route.params.uid : null

    // @TODO - If route.params.uid and no project exists with that UID, redirect to /projects?
    // Don't want bad SEO

    return {
      projects,
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