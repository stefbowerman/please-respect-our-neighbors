<template>
  <div class="text-box">
    <div class="scroller">
      <div
        v-if="formattedDate"
        v-html="formattedDate"
        class="date"
      />
      <div
        v-if="content"
        v-html="content"
        class="content"
      />      
    </div>
    <div class="scroll-bar" />
  </div>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: false
    }
  },
  computed: {
    formattedDate() {
      const d = new Date(this.date)
      const day = d.getDate().toString()
      const month = (d.getMonth() + 1).toString()
      const year = d.getFullYear().toString()
      

      return `${day.length === 1 ? `0${day}` : day}<br />${month.length === 1 ? `0${month}` : month}<br />${year}`
    }
  }
}
</script>

<style lang="scss" scoped>
.text-box {
  position: relative;
  padding-right: 29px;
}

.scroller {
  height: 600px;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 43px;
  padding-left: 100px;
  padding-bottom: 100px;
  border: 1px solid $black;
}

.date {
  @include text-massive;
  margin-bottom: 30px;
  color: $white;
  font-weight: $font-weight-light;
}

.content {
  @include text-bigger;
  text-transform: none;
}

.scroll-bar {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 7px;
  background-color: black;
}
</style>