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
              <md-checkbox v-if="!isExternal" v-model="remember">Remember me</md-checkbox>
              <md-checkbox v-if="isExternal" v-model="rememberAll">Remember me in all WidgetBrain apps</md-checkbox>
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
import { mapGetters } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      isExternal: false,
      user: {
        email: null,
        password: null
      },
      remember: true,
      rememberAll: false,
      forgottenEmail: null
    }
  },
  computed: {
    ...mapGetters([
      'WBToken',
      'userId'
    ])
  },
  methods: {
    login() {
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
    openDialog(ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref, isConfirmed) {
      if (isConfirmed) {
        this.$store.dispatch('forgotPassword', this.forgottenEmail);
      }
      this.$refs[ref].close();
    },
    checkToken() {
      const token = this.WBToken || localStorage.getItem('WBToken');
      const userId = this.userId || localStorage.getItem('userId');

      console.log(`token`, token,  'userId', userId);

      if (token && userId) {
        if (this.$route.query.logout) {
          this.$store.commit('LOGOUT');
        } else {
          this.$store.dispatch('getUser')
            .then(res => {
              var message = {
                message: "loggedIn",
                token: token,
                userId: userId,
                remember: true
              }
              console.log('fire!')
              window.parent.postMessage(message, "*");
            })
        }
      }
    },
  },
  mounted() {
    if (this.$route.path === '/externallogin') {
      this.isExternal = true;
      this.checkToken();
    }
  }
}
</script>

<style>
#forgotPassword:hover {
  color:#ec217e;
  text-decoration: underline;
  cursor: pointer;
}
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
