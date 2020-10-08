<template>
  <overlay
    @close="$emit('close', $event)"
    :show="show"
  >
    <template slot="body">
      <template v-if="slice.slice_type === 'detail_gallery'">
        <!-- include ProjectOverlayImageSlideshow ? -->
        <!-- if slice.items.length == 1 -> single image viewer -->

        <div class="viewer">
          <div
            v-for="(item, j) in slice.items"
            :key="`image-${j}`"
            class="slide"
          >
            <prismic-image
              :field="item.image"
            />            
          </div>

          <div class="arrows">
            <div class="arrow" />
            <div class="arrow" />
          </div>
        </div>
      </template>

      <template v-else-if="slice.slice_type === 'detail_text'">
        <div style="border: 1px solid white; color: white; background-image: linear-gradient(0deg, #666, #111); padding: 30px; height: 100%" v-html="$prismic.asHtml(slice.primary.detail_rich_text)" />
      </template>

      <template v-else-if="slice.slice_type === 'detail_videos'">
        <!-- include ProjectOverlayVideoSlideshow ? -->
        <div>
          <div v-for="item in slice.items">
            <span>{{ item.vimeo_url.url }}</span>
          </div>
        </div>
      </template>
    </template>
  </overlay>
</template>

<script>
import Overlay from '~/components/Overlay'

export default {
  components: {
    Overlay
  },
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    slice: {
      type: Object,
      required: false
    }
  },
  mounted() {
    console.log(this.slice)
  }
}
</script>

<style lang="scss" scoped>
.viewer {
  height: 100vh;
  padding: 100px 240px;
  width: 100%;
}

.slide {
  height: 100%;
  width: 100%;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}

.arrows {
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
}

.arrow {
  pointer-events: auto;
  cursor: pointer;
  position: relative;
  height: 543px;
  height: 50vh;
  width: 300px;
  border: 1px solid var(--text-color);

  // &:before,
  // &:after {
  //   content: '';
  //   position: absolute;
  //   height: 100px;
  //   width: 100px;
  //   border: 1px solid var(--text-color);
  //   border-width: 0 0 0 1px;
  // }

  // &:before {
  //   transform: rotate(200deg);
  // }

  // &:after {
  //   transform: rotate(-20deg);
  // }
}
</style>