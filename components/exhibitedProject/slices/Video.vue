<template>
  <div
    class="container"
    v-intersection-observer="{
      threshold: 0
    }"
    @has-intersected="onHasIntersected"
  >
    <div class="row">
      <div class="primary-column">
        <video-plyr
          v-if="videoUrl"
          :url="videoUrl"
          :autoplay="false"
          theme="red"
          ref="video-plyr"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'

import VideoPlyr from '~/components/VideoPlyr'

export default {
  components: {
    VideoPlyr
  },
  props: {
    slice: {
      type: Object,
      default: () => ({}),
      validator: ({ slice_type }) => slice_type === 'video'
    }
  },
  computed: {
    videoUrl() {
      return _get(this.slice, 'primary.video_file_url.url')
    }
  },
  methods: {
    onHasIntersected() {
      const videoPlyr = this.$refs['video-plyr'] 
      
      videoPlyr && videoPlyr.play()
    }
  }
}
</script>


<style lang="scss" scoped>
@include bp-up(lg) {
  .container,
  .row,
  .primary-column,
  .video-plyr {
    height: 100%;
  }
}

.primary-column {
  text-align: center;
}

.video-plyr {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  width: auto;
  max-width: 770px;

  ::v-deep .plyr {
    height: auto;

    video {
      width: auto;
      height: auto;
      max-width: 100%;
    }
  }
}
</style>