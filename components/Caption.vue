<template>
  <div class="caption">
    <div
      class="caption-progress"
      v-if="progress"
      v-text="progress"
    />
    <div
      class="container"
      v-if="captionHtml"
      v-html="captionHtml"
    />
  </div>  
</template>

<script>
export default {
  props: {
    progress: {
      type: String,
      default: ''
    },
    captionHtml: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.caption {
  text-align: center;
  font-weight: $font-weight-medium;

  @include bp-down(md) {
    font-size: 15px;
    line-height: (16px/15px);
  }

  .container {
    max-width: 75%;

    @include bp-up(lg) {
      max-width: 900px; // ?
    }
  }

  /deep/ a {
    border-bottom: 2px solid; // Duplicated across Project.vue
  }
}

.caption-progress {
  @include bp-up(md) {
    display: none;
  }

  body.no-touch {
    display: none;
  }
}
</style>