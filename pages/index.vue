<template>
  <v-app>
    <v-snackbar
    v-model="appSnackbar"
    :color="appSnackbarColor"
    :timeout="4000"
    >
      {{ appSnackbarMsg }}
      <v-btn
        text
        @click="appSnackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Email Login</v-toolbar-title>                
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="user_email"
                    label="Email"
                    name="email"
                    prepend-icon="mdi-account"
                    type="text"
                    @keyup.native.enter="login"
                  />

                  <v-text-field
                    v-model="user_password"
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-key"
                    type="password"
                    @keyup.native.enter="login"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="orange" @click="masterReset"><v-icon left>mdi-database-refresh</v-icon>Master Reset</v-btn>
                <v-spacer />
                <v-btn color="success" @click="login"><v-icon left>mdi-login</v-icon>Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    layout: 'loginLayout',
    data: () => ({
        user_email: '',
        user_password: '',
        appSnackbar: false,
        appSnackbarColor: 'info',
        appSnackbarMsg: '',
    }),
    props: {
      source: String,
    },
    created: function(){
        this.$store.dispatch(`localStorage/setupUserlist`);
    },
    methods: {
      showSnackBar(msg, color){
        this.appSnackbarMsg = msg;
        this.appSnackbar = true;
        this.appSnackbarColor = color;
      },
      masterReset(){
        this.$store.dispatch(`localStorage/masterResetApp`);
        this.showSnackBar(`Successfully Reset Master App Data!`, "warning");
      },
      login(){
          this.$store.dispatch(`localStorage/authenticateUser`, {email: this.user_email, password: this.user_password}).then(user => {
          if(user){
              this.showSnackBar(`Welcome back ${user.name}!`, "success");
              this.$router.push({path: '/inbox'});
          }
          else{
              this.showSnackBar("Failed Login; please check email and password and try again.", "error");
          }
        });  
      }
    }
  }
</script>