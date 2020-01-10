<template>
  <v-app>
    <v-navigation-drawer
      dark
      class="blue-grey darken-3"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list v-if="!miniVariant && currentUser" style="background-image: url('https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg'); min-height: 200px;">
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="currentUser.photo"></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title current_user_name">{{currentUser.name}}</v-list-item-title>
            <v-list-item-subtitle class="current_user_designation">{{currentUser.designation}}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-list nav>
        <v-divider v-if="!miniVariant"></v-divider>
        <div
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-group
            v-if="item.children"
            no-action
            value="true"
            @click="gotoPage(item.to)"
          >
            <template v-slot:activator>
              <v-list-item-avatar v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="subItem in item.items"
              :key="subItem.title"
              @click="actionFromSidebar(subItem.title)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="subItem.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-btn dark class="ma-2" :color="sahajColor" name="btn_toggle_mini" @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-text-field
        class="pt-8"
        flat
        solo
        label="Search for something..."
        name="input_navbar_search_filter"
        v-model="layoutSearchFilter"
      ></v-text-field>
      <!-- <v-toolbar-title v-text="title" /> -->
      <v-spacer />
      <v-badge v-if="unreadCount > 0" overlap color="orange">
        <template v-slot:badge>{{unreadCount > 0 ? unreadCount: null}}</template>
        <v-btn text icon>
          <v-icon>mdi-email</v-icon>
        </v-btn>
      </v-badge>
      <v-badge overlap :color="sahajColor">
        <template v-slot:badge>88</template>
        <v-btn text icon>
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </v-badge>
      <v-btn class="ma-2" text name="btn_logout" @click="logoutUser">
        <v-icon left>mdi-logout</v-icon> Log out
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      sahajColor: "#00B493",
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-view-grid',
          title: 'Dashboards',
          to: '/dash'
        },
        {
          icon: 'mdi-diamond-stone',
          title: 'Layouts',
          to: '/layouts'
        },
        {
          icon: 'mdi-chart-bar',
          title: 'Graphs',
          to: '/graphs'
        },
        {
          icon: 'mdi-email',
          title: 'Mailbox',
          to: '/inbox',
          children: true,
          items: [
              { title: 'Inbox' },
              { title: 'Email view' },
              { title: 'Compose Email' },
              { title: 'Email templates' },
            ],
        },
        {
          icon: 'mdi-chart-pie',
          title: 'Metrics',
          to: '/metrics'
        },
        {
          icon: 'mdi-flask-outline',
          title: 'Widgets',
          to: '/widgets'
        },
        {
          icon: 'mdi-square-edit-outline',
          title: 'Forms',
          to: '/forms'
        },
        {
          icon: 'mdi-monitor',
          title: 'App Views',
          to: '/views'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Search for something...',
      layoutSearchFilter: ''
    }
  },
  mounted: function(){
    this.checkUserAuthStatus();
    // this.$store.dispatch(`localStorage/resetMasterFolderList`);
    // this.$store.dispatch(`localStorage/resetMasterCategoryList`);
    // this.$store.dispatch(`localStorage/resetMasterLabelList`);
    // this.$store.dispatch(`localStorage/resetMasterEmailList`);
  },
  watch: {
    currentUser (val) {
      if(!val){
        console.log("user logged out successfully!")
        this.gotoPage('/');
      }
      else{
        this.gotoPage('/inbox');
      }
    },
    layoutSearchFilter (val){
      this.$store.commit('localStorage/updateLayoutSearchFilter', val);
    }
  },
  computed: {
    unreadCount(){
      return this.$store.getters['localStorage/unreadEmailCount'];
    },
    draftCount(){
      return this.$store.getters['localStorage/draftEmailCount'];
    },
    currentUser(){
      return this.$store.getters['localStorage/currentUser'];
    },
    authenticated(){
      return this.$store.getters['localStorage/userAuthenticated'];
    }
  },
  methods: {
    gotoPage(pagePath){
      this.$router.push({path: pagePath});
    },
    checkUserAuthStatus(){
      this.$store.dispatch(`localStorage/setupUserlist`);
      if(!this.authenticated){
        console.log("### User not authenticated, redirecting to login page!");
        setTimeout(() => {
          this.gotoPage('/');
        }, 400);
      }
      else{
        console.log("### User authenticated: ", this.authenticated);
      }
    },
    logoutUser(){
      this.$store.dispatch(`localStorage/logoutUser`);
    },
    actionFromSidebar(menuItem){
      console.log("### this is the menu item: ", menuItem);
      if(menuItem == "Compose Email"){
        this.$store.dispatch(`localStorage/setEmailModeToCompose`);
        this.$store.dispatch(`localStorage/openEmailDialog`);
      }
      else if(menuItem == 'Inbox'){
        this.gotoPage('/inbox');
      }
    }
  }
}
</script>
