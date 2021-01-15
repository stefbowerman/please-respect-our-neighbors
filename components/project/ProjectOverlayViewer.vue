<template>
  <div
    class="viewer"
    :style="{ '--caption-height': `${captionHeight}px` }"
  >
    <template v-if="slice.slice_type === 'detail_gallery'">
      <Slideshow
        :slice="slice"
        :fully-visible="fullyVisible"
        @progress="t => progressText = t"
        class="viewer-content"
        ref="slideshow"
      />
    </template>

    <template v-else-if="slice.slice_type === 'detail_text'">
      <div class="viewer-content project-overlay-text-box">
        <TextBox
          :content="$prismic.asHtml(slice.primary.detail_rich_text)"
          :text-size="slice.primary.detail_text_size"
        />
      </div>
    </template>

    <div
      v-if="progressText || captionHtml"
      :class="[
        'viewer-caption',
        { 'is-visible' : fullyVisible }
      ]"
      ref="viewerCaption"
    >
      <Caption
        :progress="progressText"
        :captionHtml="captionHtml"
      />
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'
import _throttle from 'lodash/throttle'

import TextBox from '~/components/TextBox'
import Caption from '~/components/Caption'
import Slideshow from '~/components/slideshow/Slideshow'

export default {
  components: {
    TextBox,
    Slideshow,
    Caption
  },
  props: {
    slice: {
      type: Object,
      required: false
    },   
    fullyVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      progressText: '',
      captionHeight: 0
    }
  },
  mounted() {
    this.throttledResize = _throttle(this.onResize, 150)
    
    window.addEventListener('resize', this.throttledResize)
    
    this.onResize()
    this.$refs.slideshow && this.$refs.slideshow.update()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.throttledResize)
  },
  computed: {
    captionHtml() {
      return this.$prismic.asHtml(_get(this.slice, 'primary.detail_title', []))
    }
  },
  methods: {
    onResize() {
      this.captionHeight = this.$refs.viewerCaption ? this.$refs.viewerCaption.clientHeight : 0
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
  padding-top: unquote('max(35px, var(--caption-height))');
  padding-bottom: unquote('max(35px, var(--caption-height))');  

  @include bp-up(md) {
    padding-top: 165px;
    padding-bottom: 165px;
    padding-top: unquote('max(155px, var(--caption-height))');
    padding-bottom: unquote('max(165px, var(--caption-height))');
  }
}

.viewer-caption {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 45px 0;
  text-transform: none;
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
  padding-left: 50px;
  padding-right: 50px;
  max-width: 1200px;
  color: $white;

  /deep/ .simplebar-wrapper {
    background-color: $off-black;
    background-image: $dark-gradient;
  }
}
</style>  
</style>