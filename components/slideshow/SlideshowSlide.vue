<template>
  <div
    :class="[
      'swiper-slide',
      (type && `swiper-slide--${type}`)
    ]
  ">
    <div class="slide-inner">
      <div class="slide-content-frame">
        <template v-if="type === 'video'">
          <div class="slide-content-interactive-area">
            <video 
              class="plyr slide-media"
              playsinline
              :controls="item.video_controls !== false /* can be null which should default to true */"
              loop="true"
            >
              <source
                :src="item.video_file_url.url"
                type="video/mp4" 
              />
            </video>
          </div>
        </template>
        <template v-else-if="type === 'image'">
          <div class="slide-content-interactive-area">
            <prismic-image
              v-if="item.image && item.image.dimensions"
              :field="item.image"
              class="slide-media"
              :data-height="item.image.dimensions.height"
              :data-width="item.image.dimensions.width"
            />
          </div>
        </template>          
        <template v-else-if="type === 'text'">
          <TextBox
            :content="textContent"
            :text-size="textSize"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import _get from 'lodash/get'

import TextBox from '~/components/TextBox'

export default {
  components: {
    TextBox
  },
  props: {
    type: {
      type: String,
      required: true,
      validator: t => ['text', 'image', 'video'].includes(t)
    },    
    item: {
      type: Object,
      default: () => {}      
    },
    textContent: {
      type: String
    },
    textSize: {
      type: String
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
  video {
    height: 100%;
    width: 100%;
  }

  div.plyr {
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
}  
</style>