<template>
  <div
    class="page page--dark"
    :style="{ '--page-title-height': `${this.pageTitleHeight}px` }"
  >
    <div class="page-inner">
      <page-title
        :title="title"
        :subtitle="subtitle"
        @height-change="h => pageTitleHeight = h"
      />

      <div class="projects-container">
        <project
          v-for="(project, i) in projects"
          :key="`project-${i}`"
          :project="project"
          :interacting="interactingProjectIndex === i"
          @interaction="interactingProjectIndex = i"
          @overlay-enter="onOverlayEnter(project)"
          @overlay-leave="onOverlayLeave"
          ref="projects"
        />
      </div>
    </div>
  </div>
</template>

<script>
import animateScrollTo from 'animated-scroll-to'
import _get from 'lodash/get'
import _uniq from 'lodash/uniq'
import _throttle from 'lodash/throttle'
import _clamp from 'lodash/clamp'
import pageMixin from '~/mixins/page'
import { stripTags } from '~/utils/tools'
import { easeInOutCubic } from '~/utils/easings'

import PageTitle from '~/components/PageTitle'   
import Project from '~/components/project/Project'

export default {
  components: {
    PageTitle,
    Project
  },
  mixins: [pageMixin],
  data() {
    return {
      title: '',
      subtitle: '',
      meta: {
        title: '',
        description: '',
        imageUrl: ''
      },
      projects: [],
      selectedProjectUID: null,
      pageTitleHeight: 0,
      interactingProjectIndex: -1 // which project is being interacted with?
    }
  },  
  mounted() {
    if (this.selectedProjectUID) {
      const projectIndex = this.projects.findIndex(({ uid }) => uid === this.selectedProjectUID)

      if (this.$refs.projects[projectIndex]) {
        setTimeout(() => {
          const top = this.$refs.projects[projectIndex].$el.offsetTop - this.pageTitleHeight

          animateScrollTo(top, {
            easing: easeInOutCubic,
            speed: 750
          })
        }, 2000)        
      }
    }  
  },
  methods: {
    onOverlayEnter(project) {
      window.history.replaceState({}, null, `/projects/${project.uid}`)
    },
    onOverlayLeave() {
      window.history.replaceState({}, null, `/projects`)
    }
  },
  async asyncData({ $prismic, store, route }) {
    const { data } = await $prismic.api.getSingle('projects_page')

    const projectUIDs = data.projects.map(({ project }) => project.uid) // i.e. ["sergio-tacchini", "undefeated", "what-a-romantic"]

    // Only show the projects as specified in the projects_page settings
    const projects = projectUIDs.map(uid => store.state.projects.find(p => p.uid === uid))

    const selectedProjectUID = Boolean(route.params.uid) ? route.params.uid : null
    const selectedProject = projects.find(({ uid }) => uid === selectedProjectUID)

    // Page title + subtitle
    const title = $prismic.asText(_get(data, 'title', []))
    const subtitle = $prismic.asText(_get(data, 'subtitle', []))

    // Meta Info - Pull from the single 'projects_page' settings
    let metaTitle = $prismic.asText(_get(data, 'meta_title', []))
    let metaDescription = $prismic.asHtml(_get(data, 'meta_description', []))
    let metaImageUrl = _get(data, 'meta_image.url')

    metaTitle = metaTitle || title
    metaDescription = subtitle

    // Or pull from individual project settings if a project is specified
    if (selectedProject) {
      metaTitle = $prismic.asText(selectedProject.title)
      metaDescription = $prismic.asHtml(selectedProject.description)
      metaImageUrl = _get(selectedProject, 'featured_image.url')
    }

    const meta = {
      title: metaTitle,
      description: metaDescription,
      imageUrl: metaImageUrl
    }

    return {
      title,
      subtitle,
      meta,
      projects,
      selectedProjectUID
    }
  },  
  head() {
    const title = this.meta.title || this.title // Allows the text in the page title component and the page *meta* title to be different
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
        content: stripTags(this.meta.description)
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
  padding: 50px 0 60px;

  @include bp-up(lg) {
    padding-top: 65px;
  }
}

.project + .project {
  margin-top: 120px;

  @include bp-up(md) {
    margin-top: 80px;
  }

  @media (min-width: map-get($breakpoints, 'md')) and (max-height: 700px) {
    margin-top: 120px;
  }

  @media (min-height: 1000px) {
    margin-top: 0;
  }
}
</style>