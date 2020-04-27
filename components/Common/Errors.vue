<template>
  <div class="errors_box">
    <div v-for="error in loadErrors" :key="error" class="errors_box__item">{{error.errorMessage}}</div>
  </div>
</template>

<script>
export default {
  props: {
    loadErrors: {
      type: Function
    }
  }
}
</script>

<style lang="scss" scoped>
.errors_box{
  position: absolute;
  left: 0;
  top: 20px;
  right: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 2;
  &__item{
    padding: 10px 20px;
    margin-bottom: 10px;
    color: #fff;
    background: #e74c3c;
    animation: hideElement 1s ease-in-out 5s 1 both;
  }
}
@keyframes hideElement {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
