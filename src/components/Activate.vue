<template>
  <div>
    <div class="auth-area">
      <div class="auth-window">
        <div class="auth-logo">
          <img src="../../static/logo.png" alt="Widget Brain logo">
        </div>
        <form @submit.prevent="" class="auth-form">
          <div>Hi, 
Welcome to WidgetBrain. We've set up an account for you to access your organization's application. You just have to pick a username and a strong password.</div>
          <md-input-container>
            <label>Email</label>
            <md-input></md-input>
          </md-input-container>
          <md-input-container md-has-password>
            <label>Password</label>
            <md-input type="password"></md-input>
          </md-input-container>
          <div class="auth-actions">
            <md-button type="submit" @submit="" class="md-raised md-primary">Log in</md-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import managedata from '../helpers/managedata';

export default {
  name: 'Activate',
  data() {
    return {}
  },
  methods: {
    updateUser() {
      this.$store.dispatch('login', {
        user: this.user,
        remember: this.remember,
        rememberAll: this.rememberAll,
        isExternal: this.isExternal
      }).then(res => {
        if (this.isExternal) {
          const message = {
            message: "loggedIn",
            token: this.WBToken,
            userId: this.userId,
            remember: this.rememberAll || this.remember
          }

          console.log(message);

          window.parent.postMessage(message,"*")
        }
      });
    },
  },
  mounted() {
    
  }
}
</script>

<style>
</style>
