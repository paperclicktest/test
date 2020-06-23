<template>
  <div class="vue-template">
    <form>
      <h3>Sign In</h3>

      <div class="form-group">
        <label>Git Account</label>
        <input type="email" class="form-control form-control-lg" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" class="form-control form-control-lg" />
      </div>

      <button
        :disabled="loading"
        type="button"
        class="btn btn-dark btn-lg btn-block"
        v-on:click="authenticateAccount()"
      >
        Authenticate
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return { loading: false };
  },
  methods: {
    authenticateAccount() {
      console.log("hmm");
    },
  },
};
</script>
