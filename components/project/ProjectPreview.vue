<template>
  <div class="project-preview">
    <template v-if="slice.slice_type === 'detail_gallery'">
      <prismic-image :field="slice.items[0].image"/>
    </template>
    <template v-else-if="slice.slice_type === 'detail_text'">
      <div style="border: 1px solid white; color: white; background-image: linear-gradient(0deg, #666, #111); padding: 30px; height: 100%" v-html="$prismic.asHtml(slice.primary.detail_rich_text)" />
    </template>        
    <template v-else-if="slice.slice_type === 'detail_videos'">
      <div>
        <div v-for="item in slice.items">
          <span>{{ item.vimeo_url.url }}</span>
        </div>
      </div>
    </template>

    <div class="caption" v-text="$prismic.asText(slice.primary.detail_title)" />   
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
    console.log(this.slice)
  }
}
</script>

<style>
.caption {
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 10px;
  display: none;
}
</style>