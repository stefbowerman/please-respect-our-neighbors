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
            :fully-visible="fullyVisible"
            @progress="onSlideshowProgress"
            ref="slideshow"
          />
        </template>

        <template v-else-if="slice.slice_type === 'detail_text'">
          <div class="project-overlay-text-box">
            <TextBox
              :content="$prismic.asHtml(slice.primary.detail_rich_text)"
            />
          </div>
        </template>

      
        <transition name="fade">
          <div class="caption" v-show="fullyVisible">
            <div
              class="caption-progress"
              v-if="progressText"
              v-text="progressText"
            />
            <div
              class="container"
              v-html="$prismic.asHtml(slice.primary.detail_title)"
            />
          </div>
        </transition>
      </div>
    </template>
  </overlay>
</template>

<script>
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
      fullyVisible: false
    }
  },
  methods: {
    onEnter() {
      this.$refs.slideshow && this.$refs.slideshow.update()
    },
    onAfterEnter() {
      this.fullyVisible = true
    },
    onAfterLeave() {
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

.caption {
  position: absolute;
  z-index: 1;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-weight: $font-weight-medium;

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
}
</style>