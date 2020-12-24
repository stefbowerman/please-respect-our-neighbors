<template>
  <div class="container">
    <div class="row">
      <div class="primary-column gutter-less">
        <video-plyr
          :url="videoUrl"
          :loop="true"
          :autoplay="true"
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
      default: () => {},
      validator(s) {
        return s.slice_type === 'video'
      }      
    }
  },
  computed: {
    videoUrl() {
      return _get(this.slice, 'primary.video_file_url.url')
    }
  }
}
</script>


<style lang="scss" scoped>
.container,
.row,
.primary-column,
.video-plyr {
  height: 100%;
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

  /deep/ .plyr {
    height: auto;

    video {
      width: auto;
      height: auto;
      max-width: 100%;
    }
  }
}
</style>