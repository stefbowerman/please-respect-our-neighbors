<template>
  <div class="swiper-slide">
    <div class="slide-inner">
      <div class="slide-content-frame">
        <div class="slide-content-interactive-area">
          <template v-if="type === 'video'">
            <video class="plyr" playsinline controls>
              <source :src="item.video_file_url.url" type="video/mp4" />
            </video>
          </template>          
          <template v-else-if="type === 'image'">
            <prismic-image
              :field="item.image"
              class="slide-image"
              :data-height="item.image.dimensions.height"
              :data-width="item.image.dimensions.width"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'

export default {
  props: {
    item: {
      type: Object,
      default: () => {}      
    }
  },
  computed: {
    type() {
      let t

      // Prioritize videos in case they pass in both
      if (_get(this.item, 'video_file_url.url', null) != null) {
        t = 'video'
      }
      else if (_get(this.item, 'image.url', null) != null) {
        t = 'image'
      }

      return t
    }
  }
}
</script>

<style lang="scss">
.slide-inner {
  height: 100%;
  width: 100%;
}

.slide-content-frame {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  iframe,
  video {
    height: 100%;
    width: 100%;
  }

  iframe,
  video {
    object-fit: contain;
    opacity: 0;
    transition: opacity 1s ease-out;

    &.is-loaded {
      opacity: 1;
    }
  }

  .plyr,
  .plyr--video,
  .plyr__video-wrapper {
    height: auto;
    width: 100%;
  }

  .plyr__captions {
    display: none;
  }

  .plyr.is-loaded video {
    opacity: 1;
  }
}  
</style>