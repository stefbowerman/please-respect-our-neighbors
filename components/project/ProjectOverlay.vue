<template>
  <overlay
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @after-leave="onAfterLeave"
    @left-key="prev"
    @right-key="next"
    @close="$emit('close', $event)"
    :show="show"
  >
    <template slot="body">
      <div class="viewer">
        <template
          v-if="slice.slice_type === 'detail_gallery' || slice.slice_type === 'detail_videos'"
        >
          <Slideshow
            :slice="slice"
            :visible="visible"
            :fully-visible="fullyVisible"
            @progress="onSlideshowProgress"
            ref="slideshow"
            class="viewer-content"
            :style="viewerContentStyle"
          />
        </template>

        <template v-else-if="slice.slice_type === 'detail_text'">
          <div
            class="viewer-content project-overlay-text-box"
            :style="viewerContentStyle"
          >
            <TextBox
              :content="$prismic.asHtml(slice.primary.detail_rich_text)"
            />
          </div>
        </template>

        <div
          :class="[
            'caption',
            { 'is-visible': fullyVisible }
          ]"
          ref="caption"
        >
          <div
            class="caption-progress"
            v-if="progressText"
            v-text="progressText"
          />
          <div
            class="container"
            v-if="captionHtml"
            v-html="captionHtml"
          />
        </div>
      </div>
    </template>
  </overlay>
</template>

<script>
import _get from 'lodash/get'
import _throttle from 'lodash/throttle'

import Overlay from '~/components/Overlay'
import TextBox from '~/components/TextBox'
import Slideshow from '~/components/Slideshow'

export default {
  components: {
    Overlay,
    TextBox,
    Slideshow
  },
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    slice: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      progressText: '',
      visible: false,
      fullyVisible: false,
      captionHeight: 0
    }
  },
  mounted() {
    this.throttledResize = _throttle(this.onResize, 150)
    
    window.addEventListener('resize', this.throttledResize)
    
    this.onResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.throttledResize)
  },
  computed: {
    captionHtml() {
      return this.$prismic.asHtml(_get(this.slice, 'primary.detail_title', []))
    },
    viewerContentStyle() {
      if (this.captionHeight == 0) return {}

      return {
        paddingTop: `${this.captionHeight}px`,
        paddingBottom: `${this.captionHeight}px`
      }
    }
  },
  methods: {
    onResize() {
      this.captionHeight = this.$refs.caption ? this.$refs.caption.clientHeight : 0
    },
    onEnter() {
      this.visible = true
      this.$refs.slideshow && this.$refs.slideshow.update()
      this.onResize()
    },
    onAfterEnter() {
      this.fullyVisible = true
    },
    onAfterLeave() {
      this.visible = false
      this.fullyVisible = false
      this.$refs.slideshow && this.$refs.slideshow.reset()
    },
    onSlideshowProgress(progressText) {
      this.progressText = progressText
    },
    prev() {
      this.$refs.slideshow && this.$refs.slideshow.prev()
    },
    next() {
      this.$refs.slideshow && this.$refs.slideshow.next()
    }
  }
}
</script>

<style lang="scss" scoped>
.viewer {
  height: 100vh;
  height: var(--unit-100vh);
  width: 100%;
}

.viewer-content {
  padding-top: 35px;
  padding-bottom: 35px;
}

.caption {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px 0;
  text-align: center;
  font-weight: $font-weight-medium;

  opacity: 0;
  transition: opacity 1s $easing-ease-out-quart;

  &.is-visible {
    opacity: 1;
  }

  .container {
    max-width: 900px; // ?
  }

  /deep/ a {
    border-bottom: 2px solid; // Duplicated across Project.vue
  }
}

.caption-progress {
  @include bp-up(md) {
    display: none;
  }

  body.no-touch {
    display: none;
  }
}

.project-overlay-text-box {
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 90px 50px;
  max-width: 1200px;
  color: $white;

  /deep/ .simplebar-wrapper {
    background-color: $off-black;
    background-image: $dark-gradient;
  }
}
</style>