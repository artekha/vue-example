<template>
  <div>
    <div class="auth-area">
      <div class="auth-window auth-window-activate">
        <div class="auth-logo auth-logo-activate">
          <img src="../../static/logo.png" alt="Widget Brain logo">
        </div>
        <form @submit.prevent="activateUser" class="auth-form">
          <div class="auth-welcome-text">Hi, {{this.firstname ? this.firstname + ', ' : null}}Welcome to WidgetBrain. We've set up an account for you to access {{application}}. You just have to pick a username and a strong password.</div>
          <md-input-container>
            <label>Username</label>
            <md-input @input.native="watchUserInput('checkUserName')" type="text" v-model="username"></md-input>
          </md-input-container>
          <div v-if="usernameRequirements && usernameRequirements.length > 0">{{usernameRequirements[0]}}</div>
          <md-input-container md-has-password>
            <label>Password</label>
            <md-input @input.native="watchUserInput('checkPassword')" type="password" v-model="password"></md-input>
          </md-input-container>
          <div v-if="passwordRequirements && passwordRequirements.length > 0">{{passwordRequirements[0]}}</div>
          <md-input-container md-has-password>
            <label>Repeat password</label>
            <md-input @input.native="watchUserInput('checkPasswordRepeat')" type="password" v-model="passwordRepeat"></md-input>
          </md-input-container>
          <div v-if="passwordRepeatRequirements">{{passwordRepeatRequirements}}</div>
          <div class="auth-actions">
            <md-button :disabled="!allowActivating()" type="submit" @submit="activateUser" class="md-raised md-primary">Activate</md-button>
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
    return {
      email: null,
      key: null,
      application: null,
      firstname: null,
      organization: null,
      username: null,
      password: null,
      passwordRepeat: null,
      passwordRequirements: null,
      usernameRequirements: null,
      passwordRepeatRequirements: null,
      timer: null
    }
  },
  methods: {
    checkActivateKeyEmail() {
      managedata.checkActivateKeyEmail(this.email, this.key)
        .then(res => {
          if (!res.body) {
            this.$store.commit('CLEAR_MESSAGE');
            this.$store.commit({
              type: 'SET_MESSAGE',
              message: 'Email or activation key not correct'
            });
            setTimeout(() => {
              this.$store.commit({
                type: 'CHANGE_ROUTE',
                item: {
                  url: '/login'
                }
              });
            }, 3000);
          }
        })
        .catch(err => {
          this.$store.commit('CLEAR_MESSAGE');
          this.$store.commit({
            type: 'SET_MESSAGE',
            message: 'The key has expired. Please contact WidgetBrain (support@widgetbrain.com / +31103130313) for assistance.'
          });
          setTimeout(() => {
            this.$store.commit({
              type: 'CHANGE_ROUTE',
              item: {
                url: '/login'
              }
            });
          }, 3000);
        })
    },
    getDescriptionValues() {
      managedata.getDescriptionValues(this.email, this.key)
        .then(res => {
          this.application = res.body.application;
          this.firstname = res.body.firstname;
          this.organization = res.body.organization;
        })
        .catch(err => {
          this.$store.commit('CLEAR_MESSAGE');
          this.$store.commit({
            type: 'SET_MESSAGE',
            message: 'The key has expired. Please contact WidgetBrain (support@widgetbrain.com / +31103130313) for assistance.'
          });
        })
    },
    activateUser() {
      if (this.allowActivating()) {
        const newUser = {
          username: this.username,
          password: this.password,
          key: this.key,
          email: this.email
        }
        managedata.activateUser(newUser)
          .then(res => {
            this.$store.commit('CLEAR_MESSAGE');
            this.$store.commit({
              type: 'SET_MESSAGE',
              message: 'Activation successful! Try logging in.'
            });
            this.$store.commit({
              type: 'CHANGE_ROUTE',
              item: {
                url: '/login'
              }
            });
          })
          .catch(err => {
            this.$store.commit('CLEAR_MESSAGE');
            this.$store.commit({
              type: 'SET_MESSAGE',
              message: err.body.error.message
            });
          })
      }
    },
    watchUserInput(methodName) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => this[methodName](), 1000);
    },
    checkUserName() {
      managedata.validateUsername(this.email, this.username)
        .then(res => {
          if (res.body.result.requirements && res.body.result.requirements.length > 0) {
            this.usernameRequirements = res.body.result.requirements;
          } else {
            this.usernameRequirements = false;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    checkPassword() {
      this.checkPasswordRepeat();
      managedata.validatePassword(this.password)
        .then(res => {
          if (res.body.result.requirements && res.body.result.requirements.length > 0) {
            this.passwordRequirements = res.body.result.requirements;
          } else {
            this.passwordRequirements = false;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    checkPasswordRepeat() {
      if (this.password === this.passwordRepeat) {
        this.passwordRepeatRequirements = false;
      } else {
        this.passwordRepeatRequirements = 'Passwords should match';
      }
    },
    allowActivating() {
      return this.passwordRequirements === false && this.usernameRequirements === false && this.passwordRepeatRequirements === false;
    }
  },
  mounted() {
    this.email = this.$route.query.email;
    this.key = this.$route.query.key;
    this.checkActivateKeyEmail();
    this.getDescriptionValues();
  }
}
</script>

<style>
.auth-window.auth-window-activate {
  min-width: 500px;
}

.auth-logo.auth-logo-activate {
  max-width: 400px;
  margin-right: auto;
  margin-left: auto;
}

.auth-welcome-text {
  margin: 40px 0;
  font-weight: 300;
}
</style>
