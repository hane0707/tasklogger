<template>
  <header class="top-header">
    <div class="text-box">
      <h1>タスク履歴</h1>
      <nuxt-link class="btn btn-outline btn-large btn-info" to="/task">
        タスクを登録する
      </nuxt-link>
    </div>
  </header>
</template>
<script>
export default {
  layout: 'defaultTop',
  head () {
    return {
      title: 'Home page'
    }
  }
}
</script>
<style>
.top-header {
  min-height: 100vh;
  background-image: url("/static/banner.jpg");
  background-position: center;
  background-size: cover;
  position: relative;
}
.text-box {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: #fff;
}
.text-box h1 {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 5rem;
}
.text-box p {
  font-size: 2rem;
  font-weight: lighter;
}
</style>
