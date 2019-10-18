<template>
  <div id="signup">
    <div class="auth-wrap">
      <div class="auth-logo">
        <router-link to="/">
          <img src="../assets/images/logo.png">
        </router-link>
      </div>

      <form class="auth-box" @submit.prevent="signup">
        <h2>Create a new account</h2>

        <ValidationObserver v-slot="{ valid }">
          <div class="form-control">
            <ValidationProvider
              rules="required|email"
              v-slot="{ errors }"
              name="Email"
            >
              <label for="email">Email</label>
              <input type="email" placeholder="username@email.com" name="email" v-model="formdata.email" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="form-control">
            <ValidationProvider
              rules="required|email|confirmed:Email"
              v-slot="{ errors }"
              name="Confirm-Email"
            >
              <label for="email2">Confirm Email</label>
              <input type="email" placeholder="username@email.com" name="email2" v-model="formdata.email2" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Username"
            >
              <label for="username">Username</label>
              <input type="text" placeholder="username" name="username" v-model="formdata.username" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Full Name"
            >
              <label for="fullName">Full Name</label>
              <input type="text" placeholder="John Doe" name="fullName" v-model="formdata.fullName" required>
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

          <div class="auth-submit-btn">
            <input type="submit" value="Signup" v-bind:class="{ 'bg-success': signUpStatus === true }" :disabled="!valid">
          </div>
        </ValidationObserver>
      </form>

      <div class="auth-footer">
        <router-link to="/login">Already have an account?</router-link>
        <router-link to="/login">Login to your account</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  require("../styles/auth.scss")

  export default {
    name: 'sign-up',
    props: {},
    methods: {
      signup () {
        var apiUrl = process.env.VUE_APP_API_URL + '/auth/register';
        this.$http.post(apiUrl, this.formdata).then(response => {
          // Setting the global auth variables if the registration is successful
          if (response.status === 201) {
            this.signUpStatus = true;
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
          email: '',
          email2: '',
          fullName: '',
          password: ''
        },
        signUpStatus: false
      }
    },
    created () {
      this.$store.commit('common/resetStore');
    }
  }
</script>
