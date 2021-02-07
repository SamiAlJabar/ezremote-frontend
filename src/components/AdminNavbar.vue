<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand to="/">
        <b style="font-size: 16px;">EZRemote</b>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item right href="/chat">System Chat</b-nav-item>
          <b-nav-item right href="/management">Manage</b-nav-item>
          <b-nav-item right href="/">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
