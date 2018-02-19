<template>
  <div>
    <div class="auth-area">
      <div class="auth-window">
        <div class="auth-logo">
          <img src="../../static/logo.png" alt="Widget Brain logo">
        </div>
        <form @submit.prevent="resetPassword" class="auth-form">
          <md-input-container md-has-password>
            <label>Password</label>
            <md-input @input.native="watchPassword" type="password" v-model="password"></md-input>
          </md-input-container>
          <div v-if="requirements && requirements.length > 0">{{requirements[0]}}</div>
          <md-input-container md-has-password>
            <label>Repeat password</label>
            <md-input type="password" v-model="passwordRepeat"></md-input>
          </md-input-container>
          <div v-if="!requirements && (password === passwordRepeat)" class="auth-actions">
            <md-button type="submit" @submit="resetPassword" class="md-raised md-primary">Reset pw</md-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import managedata from '../helpers/managedata';

export default {
  name: 'PasswordChange',
  data() {
    return {
      password: null,
      passwordRepeat: null,
      requirements: [],
      timer: null,
    }
  },
  methods: {
    checkPassword() {
      managedata.validatePassword(this.password)
        .then(res => {
          if (res.body.result.requirements && res.body.result.requirements.length > 0) {
            this.requirements = res.body.result.requirements;
          } else {
            this.requirements = null;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    watchPassword() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => this.checkPassword(), 1000);
    },
    resetPassword() {
      if (this.requirements || this.password !== this.passwordRepeat) return;
      this.$store.dispatch('changePassword', {pw: this.password, token: this.$route.query.access_token});
    }
  },
}
</script>

<style scoped>
</style>
