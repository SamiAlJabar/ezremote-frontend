<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
body {
  background-color: #f8f8f8 !important;
}
.custom-container {
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 100px;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.custom-header {
  background-color: #eedbff !important;
}
.div-with-scroll {
  overflow: scroll;
  height: 220px;
}
// ::-webkit-scrollbar {
//   width: 0px; /* Remove scrollbar space */
//   background: transparent; /* Optional: just make scrollbar invisible */
// }
</style>
