<template>
  <div class="vue-template">
    <form>
      <h3>Sign In</h3>

      <div class="form-group">
        <label>Git Account</label>
        <input
          type="text"
          v-model="username"
          class="form-control form-control-lg"
        />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input
          type="password"
          v-model="password"
          class="form-control form-control-lg"
        />
      </div>
      <div class="form-group">
        <button
          :disabled="getInputValue()"
          type="button"
          class="btn btn-dark btn-lg btn-block"
          v-on:click="authenticateAccount()"
        >
          Authenticate
        </button>
      </div>

      <div v-if="info" class="alert alert-danger" role="alert">
        {{ info }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loading: false,
      username: "",
      password: "",
      info: false,
      user: {
        authenticated: false,
        username: false,
        total_private_repos: 0,
        bio: "",
        blog: "",
        company: "",
        location: "",
        email: "",
      },
    };
  },
  methods: {
    authenticateAccount() {
      axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization =
            "Bearer " + localStorage.getItem("access_token");
          return config;
        },
        (error) => Promise.reject(error)
      );
      //  console.log(this.username);
      var self = this;
      axios
        .post("http://localhost:9000/login", {
          username: this.username,
          password: this.password,
        })
        .then(function (response) {
          console.log(response);
          if (response.data.message) {
            self.info = response.data.message;
          } else {
            self.info = false;
            self.user = response.data;

            axios
              .post("http://localhost:9000/auth", { username: self.username })
              .then(function (response) {
                localStorage.setItem("access_token", response.data);

                localStorage.setItem("user", JSON.stringify(self.user));

                self.user.authenticated = true;

                self.$router.push("/profile");
              });
          }
        })
        .catch(function (error) {
          console.log(error);
          self.info = error;
        });
    },
    getInputValue() {
      if (this.username == "" || this.password == "") {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    if (localStorage.getItem("access_token")) {
      this.$router.push("/profile");
    }
  },
};
</script>
