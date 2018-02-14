<template>
  <div>
    <div class="auth-area">
      <div class="auth-window">
        <div class="auth-logo">
          <img src="../../static/logo.png" alt="Widget Brain logo">
        </div>
        <form @submit.prevent="login" class="auth-form">
          <md-input-container>
            <label>Email</label>
            <md-input v-model="user.email"></md-input>
          </md-input-container>
          <md-input-container md-has-password>
            <label>Password</label>
            <md-input type="password" v-model="user.password"></md-input>
          </md-input-container>
          <div class="auth-helpers">
            <div class="auth-helpers-part">
              <md-checkbox v-model="remember">Remember me</md-checkbox>
            </div>
            <div class="auth-helpers-part">
              <div>Forgot your password</div>
            </div>
          </div>
          <div class="auth-actions">
            <md-button type="submit" @submit="login" class="md-raised md-primary">Log in</md-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import managedata from '../helpers/managedata';

export default {
  name: 'Login',
  data() {
    return {
      user: {
        email: null,
        password: null
      },
      remember: false
    }
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        user: this.user,
        remember: this.remember
      });
    },
  },
}
</script>

<style scoped>
.auth-window {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-weight: 600;
  font-size: .9rem;
}

.auth-window input {
  font-family: 'WidgetBrain';
}

.auth-logo {
  user-select: none;
  width: 100%;
  height: 100%;
}

.auth-helpers {
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  font-family: 'WidgetBrain';
}

.auth-actions {
  display: flex;
  justify-content: center;
}
</style>
