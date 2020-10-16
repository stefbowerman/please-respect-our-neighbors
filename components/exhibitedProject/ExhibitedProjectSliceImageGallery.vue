<template>
  <div class="ex-gallery">
    <Slideshow
      :slice="slice"
      ref="slideshow"
    />
  </div>
</template>

<script>
import Slideshow from '~/components/Slideshow'

export default {
  components: {
    Slideshow
  },
  props: {
    slice: {
      type: Object,
      default: () => {},
      validator(s) {
        return s.slice_type === 'image_gallery'
      } 
    }
  }
}
</script>

<style lang="scss" scoped>
.ex-gallery {
  height: 100vh;
}
</style>