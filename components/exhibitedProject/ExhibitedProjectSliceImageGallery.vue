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
import Slideshow from '~/components/Slideshow'
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
    },
    current: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      progressText: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.ex-gallery {
  height: 100vh;

  /deep/ .slideshow {
    padding-top: 50px;
    max-height: 90vh;
  }
}

.ex-gallery-caption {
  padding-top: 30px;
  color: $red;
}
</style>