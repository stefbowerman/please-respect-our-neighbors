<template>
  <div
    :class="[
      'project',
      { 'is-highlighted': isHighlighted }
    ]"
    @mouseleave="onProjectMouseleave"
  >
    <div class="project-preview-wrapper">
      <div
        class="project-preview-overflow"
        @click="onProjectPreviewOverflowClick"
        ref="preview-overflow"
      >
        <div
          v-if="project.slices.length"
          class="project-previewer"
          :style="previewerStyle"
        >
          <project-preview
            v-for="(slice, i) in project.slices"
            :slice="slice"
            :key="`slice-${i}`"
            :active="activeSliceIndex === i"
            :highlighted="isHighlighted"
            :class="[
              {'active': activeSliceIndex === i },
              {'inactive': activeSliceIndex > -1 && activeSliceIndex !== i }
            ]"
            @click="onProjectPreviewClick(i)"
            @mouseenter="onProjectPreviewMouseenter(i)"
          />
        </div>
      </div>

      <!-- This goes behind the previewer -->
      <div
        class="project-preview__bottom-layer"
        @click="onProjectPreviewBottomLayerClick"
      >
        <div class="project-description">
          <div
            class="project-description__text"
            v-html="fullDescription"
          />
        </div>
      </div>

      <!-- This goes on top of the previewer and only shows on highlight -->
      <div
        class="project-preview__top-layer"
        @click="onProjectPreviewTopLayerClick"
      >
        <div class="project-description">
          <div
            class="project-description__text"
            v-html="fullDescription"
          />
        </div>
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
        @close="onProjectOverlayClose"
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
      captionsHeight: 0,
      previewerWidth: 0,
      isHighlighted: false,
      horizontalScrollSet: false
    }
  },
  mounted() {
    this.onResize()
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

      const topLine = `${title}${desc && ` — ${desc}`}`
      const bottomLine = `${dates.join(', ')}${partners && ` — ${partners}`}`

      return `${topLine}${bottomLine && `<br />${bottomLine}`}`
    },
    previewerStyle() {
      return { width: `${this.previewerWidth}px`}
    },
    captionsStyle() {
      if (process.server) return {}

      return { height: `${this.captionsHeight}px`}
    }
  },
  watch: {
    '$store.state.windowWidth'() {
      this.onResize()
    }
  },
  methods: {
    formatDate(_d) {
      const d = new Date(_d)
      return `${months[d.getMonth()]} ${d.getFullYear()}`
    },
    setPreviewerWidth() {
      // Update the previewer width
      this.previewerWidth = this.$store.state.windowWidth * this.project.slices.length / 2.5

      if (this.previewerWidth === 0 || this.horizontalScrollSet) return

      // scroll to the middle of the project slices
      this.$nextTick(() => {
        const previewOverflow = this.$refs['preview-overflow']
        previewOverflow.scrollLeft = (previewOverflow.scrollWidth - previewOverflow.clientWidth) / 2
        
        this.horizontalScrollSet = true
      })
    },
    setCaptionHeight() {
      let h = 0

      if (this.$refs.captions) {
        const heights = this.$refs.captions.map(el => el.clientHeight)  
        h = Math.max(...heights)
      }
      
      this.captionsHeight = h
    },
    onResize() {
      this.setCaptionHeight()
      this.setPreviewerWidth()
    },
    onProjectPreviewMouseenter(i) {
      this.activeSliceIndex = i
    },
     onProjectPreviewClick(i) {
      this.selectedSliceIndex = i
      this.activeSliceIndex = i // Make up for mouseleave happening on modal open
    },
    onProjectPreviewBottomLayerClick() {
      this.isHighlighted = true
      this.activeSliceIndex = -1
    },
    onProjectPreviewTopLayerClick() {
      this.isHighlighted = false
    },
    onProjectPreviewOverflowClick(e) {
      // console.log(e)
      if (e && e.target === this.$refs['preview-overflow']) {
        this.onProjectPreviewBottomLayerClick()
      }
    },
    onProjectOverlayClose() {
      this.selectedSliceIndex = -1
    },
    onProjectMouseleave() {
      // Only set active slice to -1 if there's no selected slice
      // Kind of an edge-case, mouseleave gets triggered when we open a modal but that happens when we select a slice
      if (this.selectedSliceIndex === -1) {
        this.activeSliceIndex = -1  
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  height: calc(100vh - var(--page-title-height));

  @include bp-up(lg) {
    height: calc(100vh - var(--page-title-height));
    padding-top: 30px;
    max-height: 900px; // For huge monitors
  }
}

.project-preview-wrapper {
  position: relative; // For top and bottom layers to position themselves against
  height: 100%;
  width: 100%;
}

.project-preview-overflow {
  position: relative;
  z-index: 2; // To sandwich in the middle of the top and bottom layers
  height: 100%;
  width: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @include bp-up(md) {
    pointer-events: none; // Above this screen size we don't do scrolling anymore so we don't need pointer events
  }
}

.project-previewer {
  display: flex;
  height: 100%;
  pointer-events: none; // Apply them back at the 'frame' child level

  @include bp-up(md) {
    width: 100% !important;
  }

  .project-preview {
    flex: 1;
    padding: 0 5.5vw;
    // width: 200px;
    // width: 35vw;
    // min-width: 35vw;
    transition: all 0.6s cubic-bezier(0.26, 0.35, 0.12, 1.01);

    // @include bp-up(lg) {
    //   width: auto;
    // }

    &:first-child {
      padding-left: 5.5vw !important;
    }

    &:last-child {
      padding-right: 5.5vw !important;
    }

    &.active {
      flex: 3.8;
      padding: 0 8vw;
    }

    &.inactive {
      padding: 0 2.5vw;
    }

    @include bp-up(md) {
      padding: 0 2.5vw;

      &:first-child {
        padding-left: 2.5vw !important;
      }

      &:last-child {
        padding-right: 2.5vw !important;
      }

      &.active {
        padding: 0 5vw;
      }      
    }    

    .frame {
      pointer-events: auto;
    }
  }
}

.project-preview__bottom-layer,
.project-preview__top-layer {
  @include fill;
  cursor: pointer;
}

.project-preview__bottom-layer {
  z-index: 1; // Below project preview
}

.project-preview__top-layer {
  z-index: 3; // Above project preview
  pointer-events: none;
  opacity: 0;
  transition: opacity $preview-highlight-transition-duration-out$preview-highlight-easing-out;

  .is-highlighted & {
    opacity: 1;
    pointer-events: auto;
    transition: {
      timing-function: $preview-highlight-easing-in;
      duration: $preview-highlight-transition-duration-in;
    }
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
  font-weight: $font-weight-medium;
  @include text-shrink;

  &__text {
    // max-width: 800px;
    // margin: 0 auto;
    padding: 0 50px;
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