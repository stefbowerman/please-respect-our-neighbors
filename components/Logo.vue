<template>
  <div class="logo">
    <span
      @click="$emit('click')"
      class="logo__text"
    >
      Please Respect Our Neighbors INC.
    </span>
  </div>
</template>

<style lang="scss">
.logo {
  display: inline-block;
  text-align: center;
}

.logo__text {
  display: inline-block;
  font-size: 18px;
  font-family: $font-family-secondary;
  font-weight: $font-weight-bold;
  cursor: pointer;    
}
</style>