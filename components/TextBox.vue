<template>
  <div class="text-box">
    <div class="text-box-scroller">
      <div
        v-if="formattedDate"
        v-html="formattedDate"
        class="text-box-date"
      />
      <div
        v-if="content"
        v-html="content"
        class="text-box-content"
      />      
    </div>
    <div class="text-box-scroll-bar" />
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
      if (!this.date) return null
        
      const d = new Date(this.date)
      const day   = d.getDate().toString()
      const month = (d.getMonth() + 1).toString()
      const year  = d.getFullYear().toString()

      return `${day.length === 1 ? `0${day}` : day}<br />${month.length === 1 ? `0${month}` : month}<br />${year}`
    }
  }
}
</script>

<style lang="scss">
.text-box {
  position: relative;
  padding-right: 22px;

  @include bp-up(lg) {
    padding-right: 29px;    
  }
}

.text-box-scroller {
  height: 600px;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 41px;
  padding-left: 22px;
  border: 1px solid $black;

  @include bp-up(lg) {
    padding: 43px;
    padding-left: 100px;
    padding-bottom: 100px;    
  }
}

.text-box-date {
  @include text-massive;
  margin-bottom: 30px;
  color: $white;
  font-weight: $font-weight-light;
}

.text-box-content {
  @include text-bigger;
  text-transform: none;

  @include bp-down(lg) {
    font-size: 35px;
    line-height: 1;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: $font-weight-normal;
    margin-bottom: 1em;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin-left: 1em;
    }
  }

  ul + p {
    margin-top: 1em;
  }
}

.text-box-scroll-bar {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 11px;
  background-color: black;

  @include bp-up(lg) {
    width: 7px;
  }
}
</style>