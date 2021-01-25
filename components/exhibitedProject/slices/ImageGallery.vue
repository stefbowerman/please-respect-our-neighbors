<template>
  <div class="gallery">
    <Slideshow
      @progress="onProgress"
      ref="slideshow"
    >
      <SlideshowSlide
        v-for="(item, i) in slice.items"
        :key="`${i}-item`"
        :item="item"
        type="image"
      />
    </Slideshow>

    <div
      v-if="slice.items.length > 1"    
      class="gallery-caption"
    >
      <Caption
        :progress="progressText"
      />
    </div>
  </div>
</template>

<script>
import Slideshow from '~/components/slideshow/Slideshow'
import SlideshowSlide from '~/components/slideshow/SlideshowSlide'
import Caption from '~/components/Caption'

export default {
  components: {
    Slideshow,
    SlideshowSlide,
    Caption
  },
  props: {
    slice: {
      type: Object,
      default: () => ({}),
      validator: ({ slice_type }) => slice_type === 'image_gallery'
    }
  },
  data() {
    return {
      progressText: ''
    }
  },
  methods: {
    onResize() {
      this.$refs.slideshow.onResize()
    },
    onProgress({ progressText }) {
      this.progressText = progressText
    }
  }
}
</script>

<style lang="scss" scoped>
.gallery {
  height: 100%;

  ::v-deep .arrow-slot {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  @include bp-down(md) {
    .slideshow {
      height: 75vh;
    }
  }
}

.gallery-caption {
  padding-top: 30px;
  color: $red;

  @include bp-up(lg) {
    display: none;
  }
}
</style>