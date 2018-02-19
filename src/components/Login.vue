<template>
  <div>
    <md-dialog md-open-from="#forgotPassword" md-close-to="#forgotPassword" ref="forgotPassword">
      <md-dialog-title>Password reset</md-dialog-title>

      <md-dialog-content>
        <div>Please enter your email adress.</div>
        <form @submit.prevent="closeDialog('forgotPassword', true)">
          <md-input-container>
            <label>Email</label>
            <md-input v-model="forgottenEmail"></md-input>
          </md-input-container>
        </form>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="closeDialog('forgotPassword', false)">Cancel</md-button>
        <md-button class="md-primary" @click="closeDialog('forgotPassword', true)">Ok</md-button>
      </md-dialog-actions>
    </md-dialog>
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
              <div id="forgotPassword" @click="openDialog('forgotPassword')">Forgot your password</div>
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
      remember: true,
      forgottenEmail: null
    }
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        user: this.user,
        remember: this.remember
      });
    },
    openDialog(ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref, isConfirmed) {
      if (isConfirmed) {
        this.$store.dispatch('forgotPassword', this.forgottenEmail);
      }
      this.$refs[ref].close();
    },
  },
}
</script>

<style>
.auth-area {
  min-height: 100vh;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
}
.auth-window {
  max-width: 400px;
  margin: 20px;
  margin-top: calc((20vh + 20vw) / 2);
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
  margin-bottom: 20px;
}

.auth-logo img {
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
