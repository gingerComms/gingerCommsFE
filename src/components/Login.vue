<template>
  <div id="login">
    <div class="auth-wrap">
      <div class="auth-logo">
        <router-link to="/">
          <img src="../assets/images/logo.png">
        </router-link>
      </div>

      <form class="auth-box" @submit.prevent="login">
        <h2>Login to your account</h2>

        <ValidationObserver v-slot="{ valid }">
          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Username"
            >
              <label for="username">Username</label>
              <input type="text" placeholder="Username" name="username" v-model="formdata.username" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Password"
            >
              <label for="password">Password</label>
              <input type="password" placeholder="********" name="password" v-model="formdata.password" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="remember-container">
            <div class="checkbox-container">
              <input type="checkbox" name="remember-me" v-model="formdata.rememberAuth">
              <label @click="formdata.rememberAuth = !formdata.rememberAuth" for="remember-me">Remember me</label>
            </div>

            <a href="#" class="forgot-pwd">Forgot Password</a>
          </div>

          <div class="auth-submit-btn">
            <input type="submit" value="Login" v-bind:class="{ 'bg-success': loginSubmitted }" :disabled="!valid">
          </div>
        </ValidationObserver>
      </form>

      <div class="auth-footer">
        <router-link to="/sign-up">Don't have an account?</router-link>
        <router-link to="/sign-up">Create an account</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  require("../styles/auth.scss")

  export default {
    name: 'login',
    props: {},
    computed: {
      validForm () {
        return false
      }
    },
    methods: {
      login () {
        if (!this.formdata.username || !this.formdata.password) {
          return;
        }

        var apiUrl = process.env.VUE_APP_API_URL + '/auth/login';
        this.$http.post(apiUrl, this.formdata).then(response => {
          // Setting the Auth global vars if the login is successful
          if (response.status == 200) {
            this.loginSubmitted = true;
            this.$store.commit('common/updateUser', response.body.token, response.body.user)
            this.$router.push("/dashboard");
          }
        })
      }
    },
    data () {
      return {
        formdata: {
          username: '',
          password: '',
          rememberAuth: false
        },
        loginSubmitted: false
      }
    },
    created () {
      this.$store.commit('common/resetStore')
    }
  }
</script>
