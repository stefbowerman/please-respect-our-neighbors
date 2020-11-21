<template>
  <div
    :class="classes"
  >
    <component
      :is="sliceComponentName"
      :slice="slice"
      :current="current"
    /> 

    <project-caption
      :slice="slice"
      :visible="current"
    />
  </div>
</template>

<script>
import _kebabCase from 'lodash/kebabCase'
import _capitalize from 'lodash/capitalize'

import ProjectCaption from '~/components/exhibitedProject/Caption'
import ExhibitedProjectSliceZoomImage from '~/components/exhibitedProject/ExhibitedProjectSliceZoomImage'
import ExhibitedProjectSliceImagePair from '~/components/exhibitedProject/ExhibitedProjectSliceImagePair'
import ExhibitedProjectSliceAccentImage from '~/components/exhibitedProject/ExhibitedProjectSliceAccentImage'
import ExhibitedProjectSliceImageGallery from '~/components/exhibitedProject/ExhibitedProjectSliceImageGallery'
import ExhibitedProjectSliceImageTextBox from '~/components/exhibitedProject/ExhibitedProjectSliceImageTextBox'
import ExhibitedProjectSliceTextBox from '~/components/exhibitedProject/ExhibitedProjectSliceTextBox'

export default {
  components: {
    ProjectCaption,
    ExhibitedProjectSliceZoomImage,
    ExhibitedProjectSliceImagePair,
    ExhibitedProjectSliceAccentImage,
    ExhibitedProjectSliceImageGallery,
    ExhibitedProjectSliceImageTextBox,
    ExhibitedProjectSliceTextBox
  },
  props: {
    slice: {
      type: Object,
      required: true,
      default: () => {}
    },
    current: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return [
        'exhibited-project-slice',
        _kebabCase(this.slice.slice_type)
      ]
    },
    sliceComponentName() {
      return `ExhibitedProjectSlice${this.slice.slice_type.split('_').map(t => _capitalize(t)).join('')}` // 'zoom_image' => 'ExhibitedProjectSliceZoomImage'
    }
  }
}
</script>

<style lang="scss">
.exhibited-project-slice {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;

  @include bp-up(lg) {
    &.zoom-image {
      padding-bottom: 100px;
    }
  }
}
</style>