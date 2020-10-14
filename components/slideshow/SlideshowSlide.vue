<template>
  <div class="swiper-slide">
    <div class="slide-inner">
      <div
        class="slide-content-frame"
        @click="$emit('click')"
        @mouseenter="$emit('mouseenter')"
        @mouseleave="$emit('mouseleave')"
      >
        <template v-if="type === 'detail_gallery'">
          <prismic-image
            :field="item.image"
          />
        </template>
        <template v-else-if="type === 'detail_videos'">
          <!-- Need to do some data validation here, possibly pull the ID and contruct the URL ourselves -->
          <iframe
            :src="`${item.vimeo_url.url}?byline=false&color=FD5858&fun=false&portrait=false&title=false`"
            ref="iframe"
            frameborder="0"
            allow="autoplay; fullscreen"
            allowfullscreen
          />                     
        </template>
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
  // watch props.active ?
}
</script>

<style lang="scss" scoped>
.slide-inner {
  height: 100%;
  width: 100%;
  padding-top: 35px;
  padding-bottom: 35px;
  // background-color: transparentize(red, 0.5);
}

.slide-content-frame {
  width: 100%;
  height: 100%;

  img,
  iframe {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}  
</style>