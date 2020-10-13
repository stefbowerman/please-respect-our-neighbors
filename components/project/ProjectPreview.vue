<template>
  <div class="project-preview">
    <div
      class="frame"
      v-on:click="$emit('click')"
      v-on:mouseenter="$emit('mouseenter')"
      v-on:mouseleave="$emit('mouseleave')"
    >
      <template v-if="slice.slice_type === 'detail_gallery'">
        <div class="detail-gallery">
          <prismic-image
            v-if="slice.items.length"
            :field="slice.items[0].image"
          />
        </div>
      </template>

      <template v-else-if="slice.slice_type === 'detail_text'">
        <div class="detail-text">
          <div
            class="text"
            v-html="$prismic.asHtml(slice.primary.detail_rich_text)"
          />
        </div>
      </template>

      <template v-else-if="slice.slice_type === 'detail_videos'">
        <div class="detail-gallery">
          <prismic-image
            v-if="slice.primary.detail_featured_image.url"
            :field="slice.primary.detail_featured_image"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slice: {
      type: Object,
      required: true
    }
  },
  mounted() {
    // console.log(this.slice)
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.project-preview {
  // cursor: pointer;
  padding: 0 50px;
  padding: 0 3vw;
}

.frame {
  cursor: pointer;
  height: 100%;
  width: 100%;
  border: 1px solid white;
  overflow: hidden;
}

// slice.slice_type === 'detail_gallery'

.detail-gallery {
  height: 100%;
  position: relative;

  img {
    @include fill;
    object-fit: cover;
  }
}

// slice.slice_type === 'detail_text'

.detail-text {
  border: 1px solid white;
  color: white;
  background: #2B2B2B;
  white-space: nowrap;
}

.text {
  font-size: 50px;
  line-height: 53px;
  width: 500px;
  padding: 65px 13px; 
}

// slice.slice_type === 'detail_videos'

.detail-videos {}
</style>