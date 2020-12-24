<template>
  <div class="ex-gallery">
    <Slideshow
      :slice="slice"
      ref="slideshow"
      @progress="(t) => progressText = t"
    />

    <div class="ex-gallery-caption">
      <Caption
        :progress="progressText"
      />
    </div>
  </div>
</template>

<script>
import Slideshow from '~/components/slideshow/Slideshow'
import Caption from '~/components/Caption'

export default {
  components: {
    Slideshow,
    Caption
  },
  props: {
    slice: {
      type: Object,
      default: () => {},
      validator(s) {
        return s.slice_type === 'image_gallery'
      } 
    }
  },
  data() {
    return {
      progressText: ''
    }
  },
  methods: {
    // Triggered by parent component
    onResize() {
      this.$refs.slideshow.onResize()
    }
  }
}
</script>

<style lang="scss">
.ex-gallery {
  height: 100%;

  .arrow-slot {
    padding-top: 30px;
    padding-bottom: 30px;
  }
}

.ex-gallery-caption {
  padding-top: 30px;
  color: $red;

  @include bp-up(lg) {
    display: none;
  }
}
</style>