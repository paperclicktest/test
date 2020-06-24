<template>
   <div class="vue-template">
      <div class="form-group">
         <nav class="navbar navbar-light bg-light">
            <a class="navbar-brand" href="#"><i :class="'fa fa-user'"></i> {{ user.username}}</a>
            <button type="button" class="btn btn-info btn-sm"  v-on:click="logOut()" >
            <span class="oi oi-account-logout"></span><i class="fa fa-sign-out"></i> Log out 
            </button>
            </form>
         </nav>
      </div>
      <table class="table">
         <tbody>
            <tr>
               <td>Username</td>
               <td>{{user.username}}</td>
            </tr>
            <tr>
               <td>Company</td>
               <td>{{user.company}}</td>
            </tr>
            <tr>
               <td>Location</td>
               <td>{{user.location}}</td>
            </tr>
            <tr>
               <td>Website</td>
               <td>{{user.website}}</td>
            </tr>
            <tr>
               <td>Blog</td>
               <td role="th">{{user.blog}}</td>
            </tr>
            <tr>
               <td>Bio</td>
               <td role="th">{{user.bio}}</td>
            </tr>
            <tr>
               <td>Nr. of private Repos</td>
               <td role="th">{{user.total_private_repos}}</td>
            </tr>
         </tbody>
      </table>
      <div v-if="info" class="alert alert-danger" role="alert">
         {{ info }}
      </div>
      <div v-if="!info" class="jumbotron jumbotron-fluid">
         <div  class="container">
            <h3 class="display">{{user.username}} Repos</h3>
            <div class="card" v-for="repo in repos" :key="repo.id">
               <div class="card-header">
                  {{repo.name}}
               </div>
               <div class="card-body">
                  <h5 class="card-title">{{repo.description}}</h5>
                  <p class="card-text">Is Private: {{repo.private}}</p>
                  <p class="card-text">Size: {{repo.size}}</p>
                  <a v-bind:href="''+repo.html_url+''"  target="_blank" class="btn btn-primary">Go to repository</a>
               </div>
            </div>
            </ul>
         </div>
      </div>
   </div>
</template>

<script >
	import axios from "axios";
export default {
	data() {
		let usr = localStorage.getItem("user");
		let repos = [];
		return {
			user: JSON.parse(usr),
			info: false,
			repos: []
		};
	},
	methods: {
		logOut() {
			localStorage.removeItem("user");
			localStorage.removeItem("access_token");
			this.$router.push("/");

		},
		init() {
			axios.interceptors.request.use(
				(config) => {
					config.headers.Authorization =
						"Bearer " + localStorage.getItem("access_token");
					return config;
				},
				(error) => Promise.reject(error)
			);
			var self = this;

			axios
				.post("http://localhost:9000/getRepos", {
					username: JSON.parse(localStorage.getItem("user")).username,
					password: JSON.parse(localStorage.getItem("user")).password,


				})
				.then(function (response) {

					console.log(response.data);
					if (response.data.status == 403) {
						self.info = "You are not authorized to access the API";
					} else {
						if (response.data.message) {
							self.info = response.data.message;
						} else {
							self.repos = response.data;
							self.info = false;
						}
					}
				});
		}
	},
	mounted() {
		this.init()
	}
} </script>

