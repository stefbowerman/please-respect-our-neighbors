<template>
  <div class="swiper-slide">
    <div class="slide-inner">
      <div class="slide-content-frame">
          <template v-if="type === 'detail_gallery' || type === 'image_gallery'">
            <div class="slide-content-interactive-area">
              <prismic-image
                :field="item.image"
                class="slide-image"
                :data-height="item.image.dimensions.height"
                :data-width="item.image.dimensions.width"
              />
            </div>
          </template>
          <template v-else-if="type === 'detail_videos' && item.video_file_url.url">
            <div class="slide-content-interactive-area">
              <video class="plyr" playsinline controls>
                <source :src="item.video_file_url.url" type="video/mp4" />
              </video>
            </div>

            <!--
            <iframe
              :src="iFrameSrc"
              frameborder="0"
              allow="autoplay; fullscreen"
              allowfullscreen
            />
             -->                   
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {}      
    }
  },
  computed: {
    // iFrameSrc() {
    //   if (this.type !== 'detail_videos' || !this.item.vimeo_url) return ''

    //   const base = this.item.vimeo_url.url.replace('https://vimeo.com/', 'https://player.vimeo.com/video/')

    //   return `${base}?byline=false&color=FD5858&fun=false&portrait=false&title=false`
    // }
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

  // .plyr,
  // .plyr__video-wrapper {
  //   height: 100%;
  // }

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