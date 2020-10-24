<template>
  <div class="project">
    <div :style="{ position: 'relative', width: '100%'}">
      <div
        v-if="project.slices.length"
        class="project-previewer"
      >
        <project-preview
          v-for="(slice, i) in project.slices"
          :slice="slice"
          :key="`slice-${i}`"
          @click="projectPreviewClick(i)"
          @mouseenter="activeSliceIndex = i"
        />
      </div>

      <!-- This goes behind the previewer -->
      <div class="project-description">
        <div
          class="project-description__text"
          v-html="fullDescription"
        />
      </div>
    </div>  

    <div
      class="captions"
      :style="captionsStyle"
    >
      <div
        v-for="(slice, k) in project.slices"
        :class="[
          'caption-holder',
          { 'is-visible': k === activeSliceIndex }
        ]"
        ref="captions"
      >
        <Caption
          :progress="slice.items.length && `1/${slice.items.length}`"
          :caption-html="$prismic.asHtml(slice.primary.detail_title)"
        />
      </div>
    </div>    

    <portal to="overlays">
      <project-overlay
        v-for="(slice, j) in project.slices"
        @close="projectOverlayClose"
        :key="`project-overlay-${project.uid}-${j}`"
        :show="j === selectedSliceIndex"
        :slice="slice"
      />
    </portal>
  </div>  
</template>

<script>
import _kebabCase from 'lodash/kebabCase'

import ProjectPreview from '~/components/project/ProjectPreview'
import ProjectOverlay from '~/components/project/ProjectOverlay'
import Caption from '~/components/Caption'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default {
  components: {
    ProjectPreview,
    ProjectOverlay,
    Caption
  },
  props: {
    project: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      activeSliceIndex: -1,
      selectedSliceIndex: -1,
      captionsHeight: 0
    }
  },
  mounted() {
    console.log(this.project)
    window.addEventListener('resize', this.onResize)

    this.onResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize) 
  },
  computed: {
    fullDescription() {
      const title = this.$prismic.asText(this.project.title)
      const desc = this.$prismic.asText(this.project.description)
      const partners = this.project.partners.map(p => this.$prismic.asText(p.name)).join(', ')
      const dates = [];

      if (this.project.start_date) {
        dates.push(`Initiated ${this.formatDate(this.project.start_date)}`)
      }

      if (this.project.end_date) {
        dates.push(`Completed ${this.formatDate(this.project.end_date)}`)
      }

      // @TODO - make sure this is working for project without description, without partners, etc...
      return `${title} ${desc && `— ${desc}`} <br /> ${dates.join(', ')} ${partners && `— ${partners}`}`
    },
    captionsStyle() {
      return { height: `${this.captionsHeight}px`}
    }
  },
  methods: {
    // sliceComponentName(slice) {
    //   const name = `project-slice-${_kebabCase(slice.slice_type)}`
    //   console.log(name)
    //   return name
    // },
    formatDate(_d) {
      const d = new Date(_d)
      return `${months[d.getMonth()]} ${d.getFullYear()}`
    },
    projectPreviewClick(i) {
      this.selectedSliceIndex = i
    },
    projectOverlayClose() {
      this.selectedSliceIndex = -1
    },
    onResize() {
      const heights = this.$refs.captions.map(el => el.clientHeight)
      this.captionsHeight = Math.max(...heights);
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;

  @include bp-up(lg) {
    min-height: none;
    // height: 100vh;
    // min-height: 500px;
    // max-height: 1500px;    
  }
}

.project-description {
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  text-align: center;
  pointer-events: none;
  font-weight: $font-weight-medium;
  @include text-shrink;

  &__text {
    // max-width: 800px;
    // margin: 0 auto;
    padding: 0 50px;
  }
}

.project-previewer {
  display: flex;
  width: 100%;
  height: 800px;
  height: 75vh;

  @include bp-up(lg) {
    // height: 100%;
  }

  .project-preview {
    flex: 1;
  }
}

// This is all trash, get using it to get the idea
.captions {
  flex: none; // Might not need this when we re-do how the container
  margin-top: 10px;
  width: 100%;
  position: relative;
}

.caption-holder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  opacity: 0;
  pointer-events: none;

  &.is-visible {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>