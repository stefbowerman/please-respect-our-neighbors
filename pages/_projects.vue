<template>
  <div class="projects-container">
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
import { stripTags } from '~/utils/tools'

import project from '~/components/project/Project'

export default {
  components: {
    project
  },
  data() {
    return {
      title: '',
      subtitle: '',
      meta: {},
      projects: [],
      selectedProject: null
    }
  },
  beforeCreate() {
    this.$store.commit('SET_THEME', 'dark')
  },  
  mounted() {
    this.$store.commit('SET_PAGE_TITLE_TITLE', this.title)
    this.$store.commit('SET_PAGE_TITLE_SUBTITLE', this.subtitle)

    this.throttledOnScroll = _throttle(this.onScroll, 100)
    this.throttledOnResize = _throttle(this.onResize, 250)

    // If selected project, wait until after scroll is complete to attach the scroll handler ?
    // or just add a flag to ignore scroll ?
    // window.addEventListener('scroll', this.throttledOnScroll)
    // window.addEventListener('resize', this.throttledOnResize)    

    // @TODO - Testing to see if this works...
    if (this.selectedProject) {
      const projectIndex = this.projects.findIndex(project => project.uid === this.selectedProject)

      setTimeout(() => {
        window.scrollTo({
          // top: this.$refs.projects[projectIndex].$el.offsetTop,
          top: this.$refs.projects[projectIndex].$el.getBoundingClientRect().top,
          behavior: 'smooth'
        });
      }, 2000)
    }  
  },
  beforeDestroy() {
    // window.removeEventListener('scroll', this.throttledOnScroll)
    // window.removeEventListener('resize', this.throttledOnResize)
  },
  methods: {
    onScroll() {
      // this.checkVisibleProject()
    },
    onResize() {
      // this.checkVisibleProject()
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
  async asyncData({ $prismic, store, route }) {
    const response = await $prismic.api.getSingle('projects_page')
    const data = response.data

    const projectUIDs = data.projects.map(({ project }) => project.uid) // i.e. ["sergio-tacchini", "undefeated", "what-a-romantic", "at-large-magazine"]

    const title = $prismic.asText(_get(data, 'title', []))
    const subtitle = $prismic.asText(_get(data, 'subtitle', []))
    const meta = {
      title: $prismic.asText(_get(data, 'meta_title', [])),
      description: stripTags($prismic.asHtml(_get(data, 'meta_description', []))),
      imageUrl: _get(data, 'meta_image.url')
    }


    // Only show the projects as specified in the projects_page settings
    const projects = projectUIDs.map(uid => {
      return store.state.projects.find(p => p.uid === uid)
    })

    const selectedProject = Boolean(route.params.uid) ? route.params.uid : null

    // @TODO - If route.params.uid and no project exists with that UID, redirect to /projects?
    // Don't want bad SEO

    return {
      title,
      subtitle,
      meta,
      projects,
      selectedProject
    }
  },  
  head() {
    const title = this.meta.title || this.title
    const meta = [
      {
        hid: 'title',
        property: 'og:title',
        content: title
      },    
      {
        hid: 'description',
        name: 'description',
        property: 'og:description',
        content: stripTags(this.meta.description || this.description)
      }
    ]

    if (this.meta.imageUrl) {
      meta.push({
        hid: 'og:image',
        property: 'og:image',
        content: this.meta.imageUrl
      })
    }

    return {
      title,
      meta
    }
  }
}
</script>

<style lang="scss" scoped>
.projects-container {
  margin-top: 115px;
  margin-bottom: 60px;

  @include bp-up(lg) {
    margin-top: 65px;
    margin-bottom: 150px;   
  }
}

.project + .project {
  margin-top: 100px;
}
</style>