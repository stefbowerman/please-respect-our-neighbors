<template>
  <overlay
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @after-leave="onAfterLeave"
    @left-key="prev"
    @right-key="next"
    @close="$emit('close', $event)"
    :show="show"
  >
    <template slot="body">
      <ProjectOverlayViewer
        v-if="visible"
        :slice="slice"
        :fully-visible="fullyVisible"
        ref="viewer"
      />
    </template>
  </overlay>
</template>

<script>
import Overlay from '~/components/Overlay'
import ProjectOverlayViewer from '~/components/project/ProjectOverlayViewer'

export default {
  components: {
    Overlay,
    ProjectOverlayViewer
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
  data() {
    return {
      visible: false,
      fullyVisible: false
    }
  },
  methods: {
    onEnter() {
      this.visible = true
    },
    onAfterEnter() {
      this.fullyVisible = true
    },
    onAfterLeave() {
      this.visible = false
      this.fullyVisible = false
    },
    prev() {
      this.$refs.viewer && this.$refs.viewer.prev()
    },
    next() {
      this.$refs.viewer && this.$refs.viewer.next()
    }
  }
}
</script>