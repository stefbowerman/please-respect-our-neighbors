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
        <template v-if="slice.slice_type === 'detail_gallery'">
          <Slideshow
            :slice="slice"
            :visible="visible"
            :fully-visible="fullyVisible"
            @progress="t => progressText = t"
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
            'viewer-caption',
            { 'is-visible' : fullyVisible }
          ]"
          v-if="progressText || captionHtml"
          ref="viewerCaption"
        >
          <Caption
            :progress="progressText"
            :captionHtml="captionHtml"
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
import Slideshow from '~/components/slideshow/Slideshow'
import Caption from '~/components/Caption'

export default {
  components: {
    Overlay,
    TextBox,
    Slideshow,
    Caption
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
      this.captionHeight = this.$refs.viewerCaption ? this.$refs.viewerCaption.clientHeight : 0
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

.viewer-caption {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 45px 0;  
  opacity: 0;
  transition: opacity 1s $easing-ease-out-quart;

  @include bp-up(lg) {
    padding: 25px 0;
  }

  &.is-visible {
    opacity: 1;
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