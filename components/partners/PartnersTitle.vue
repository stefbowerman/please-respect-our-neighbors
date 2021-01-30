<template>
  <span
    :class="[
      'title',
      { 'is-active': active }
    ]"
  >
    <PartnersPreviewer
      v-if="url || content"
      :text="text"
      :url="url"
      :content="content"
    />
    <span
      v-else
      class="text"
      v-text="text"
    />
  </span>
</template>

<script>
import PartnersPreviewer from '~/components/partners/PartnersPreviewer'

export default {
  components: {
    PartnersPreviewer
  },  
  props: {
    text: {
      type: String,
    },
    url: {
      type: String,
    },
    content: {
      type: String
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.title {

}

.text {
  cursor: default;
  transition: color 250ms ease-out;
  
  .is-active & {
    color: $white;
    transition: color 150ms ease-out;
  }  
}
</style>