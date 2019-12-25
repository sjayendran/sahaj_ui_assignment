<template>
  <v-flex class="grey lighten-5">
    <v-row justify="center">
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
      <v-dialog v-model="emailDialog" :persistent="dialogMode == 'Compose'" max-width="700px" @click:outside="dismissEmailDialog">
        <v-card>
          <v-card-title>
            <span v-if="dialogMode == 'Compose'" class="headline">Compose Mail</span>
            <span v-else class="headline">Email</span>
          </v-card-title>
          <v-card-text v-if="dialogMode == 'Compose'">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="new_email_to" label="To: " required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="new_email_subject" label="Subject: " required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    outlined
                    v-model="new_email_body"
                    name="email_body"
                    label="Email"
                    placeholder="Your Email Body Goes Here"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-text v-else-if="readEmailObject && dialogMode == 'Read'">
            <v-row>
              <v-col cols="12">
                <h4>From: <i>{{readEmailObject.senderName}} ({{readEmailObject.senderEmail}})</i></h4>
                <h4>Subject: <i>{{readEmailObject.subject}}</i></h4>
                <h4>Received: <i>{{readEmailObject.sentTime | humanizeTimestamp}}</i></h4>
                <small>Content begins below</small><hr>
                <pre class="emailBodyStyled">
                  {{readEmailObject.body}}
                </pre>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions v-if="dialogMode == 'Compose'">
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="cancelComposeEmail">Cancel</v-btn>
            <v-btn color="success" @click="sendEmail"><v-icon left>mdi-send</v-icon>Send</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row
      class="mb-6"
      no-gutters
    >
      <v-col cols="3">
        <div class="inboxLeftPanel">
          <v-btn block color="#00B493" dark @click="composeEmail">Compose Mail</v-btn>
          <v-list
            nav
            dense
            color="grey lighten-4"
            flat
          >
            <v-subheader>FOLDERS</v-subheader>
            <v-list-item-group v-model="chosenFolder" color="primary">
              <v-list-item
                v-for="(item) in folderList"
                :key="item.text"
                class="slimListItem"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-avatar v-if="item.text == 'Inbox' && unreadCount > 0">
                  <v-chip
                    label
                    dark
                    small
                    :color="item.badge_color"
                  >
                    {{unreadCount}}
                  </v-chip>
                </v-list-item-avatar>
                <v-list-item-avatar v-else-if="item.text == 'Drafts' && draftCount > 0">
                  <v-chip
                    label
                    dark
                    small
                    :color="item.badge_color"
                  >
                    {{draftCount}}
                  </v-chip>
                </v-list-item-avatar>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-list
            nav
            dense
            color="grey lighten-4"
            flat
          >
            <v-subheader>CATEGORIES</v-subheader>
            <v-list-item-group v-model="chosenCategory" color="primary">
              <v-list-item
                v-for="(item, i) in categoryList"
                :key="item.text"
                class="slimListItem"
              >
                <v-list-item-icon>
                  <v-icon small :color="item.color">mdi-checkbox-blank-circle</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-list
            nav
            dense
            flat
            color="grey lighten-4"
          >
            <v-subheader>LABELS</v-subheader>
            <div>
              <v-chip
                v-for="(item) in labelList"
                :key="item.text"
                label
                small
                class="ma-1"
                color="light-grey"
              >
                <v-icon left>mdi-tag</v-icon>
                {{item.text}}
              </v-chip>
            </div>
          </v-list>
        </div>
      </v-col>
      <v-col cols="9">
        <v-container class="grey lighten-5">
          <v-row no-gutters class="pa-1">
            <h1>{{chosenFolderName}} {{folderUnreadCount > 0 ? '('+folderUnreadCount+')': null}}</h1>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="emailSearchFilter"
              label="Search email"
              outlined
              height="10"
              dense
            >
            </v-text-field>
            <v-btn small color="#00B493" dark class="ma-1">Search</v-btn>
          </v-row>
          <v-row no-gutters class="pa-2">
            <v-btn tile outlined small class="ma-1" @click="refreshInbox" :disabled="inboxLoading" :loading="inboxLoading"><v-icon left>mdi-autorenew</v-icon>Refresh</v-btn>
            <v-btn tile outlined small class="ma-1" @click="markRead"><v-icon>mdi-eye</v-icon></v-btn>
            <v-btn tile outlined small class="ma-1"><v-icon>mdi-exclamation</v-icon></v-btn>
            <v-btn tile outlined small class="ma-1" @click="deleteEmails"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-btn-toggle>
              <v-btn tile outlined small class="ma-1"><v-icon>mdi-arrow-left-thick</v-icon></v-btn>
              <v-btn tile outlined small class="ma-1"><v-icon>mdi-arrow-right-thick</v-icon></v-btn>
            </v-btn-toggle>
          </v-row>
          <v-data-table
            v-model="selectedInboxList"
            :headers="inboxHeaders"
            :items="currentlyActiveEmailList"
            item-key="id"
            :search="universalSearchFilter"
            show-select
            :sort-by="['sentTime']"
            :sort-desc="[true]"
            :loading="inboxLoading"
            no-data-text="No emails here."
            hide-default-header
            hide-default-footer
            class="elevation-1"
            @click:row="openEmail"
          >
          <template v-slot:item.senderName="{ item }">
            <span v-if="item.unread">
              <b>{{item.senderName}}</b>
            </span>
            <span v-else>
              {{item.senderName}}
            </span>
          </template>

          <template v-slot:item.categories="{ item }">
            <v-chip
              v-for="(category) in item.categories"
              :key="category"
              class="ma-2"
              label
              small
              dark
              :color="categoryList.find(y => y.text.includes(category)).color"
            >
              <b>{{category}}</b>
            </v-chip>
          </template>

          <template v-slot:item.subject="{ item }">
            <span v-if="item.unread">
              <b>{{item.subject}}</b>
            </span>
            <span v-else>
              {{item.subject}}
            </span>
          </template>

          <template v-slot:item.sentTime="{ item }">
            <span v-if="item.unread">
              <b>{{item.sentTime | humanizeTimestamp}}</b>
            </span>
            <span v-else>
              {{item.sentTime | humanizeTimestamp}}
            </span>
          </template>
          </v-data-table>
        </v-container>
      </v-col>
    </v-row>
  </v-flex>
</template>

<script>
import moment from 'moment';

export default {
  data: () => ({
    item: 0,
    appSnackbar: false,
    appSnackbarColor: 'info',
    appSnackbarMsg: '',
    emailSearchFilter: '',
    inboxHeaders: [
      {
        text: 'From',
        align: 'left',
        value: 'senderName',
      },
      { text: 'Category', value: 'categories', align: 'right' },
      { text: 'Subject', value: 'subject' },
      { text: 'Time', value: 'sentTime' },
    ],
    new_email_to: null,
    new_email_subject: null,
    new_email_body: null,
    readEmailObject: null,
    inboxLoading: false,
    chosenFolder: 0,
    chosenCategory: null,
    chosenLabel: null,
    selectedInboxList: [],
  }),
  mounted: function(){
    this.$store.commit('localStorage/updateLayoutSearchFilter', '');
  },
  computed: {
    universalSearchFilter(){
      return this.$store.getters['localStorage/updatedSearchFilter'];
    },
    currentlyActiveEmailList(){
      if(this.chosenFolderName == 'Inbox')
        return this.inboxList;
      else if(this.chosenFolderName == 'Sent Mail')
        return this.sentFolder;
      else
        return [];
    },
    folderUnreadCount(){
      if(this.chosenFolderName == 'Inbox')
        return this.unreadCount;
      else if(this.chosenFolderName == 'Sent Mail')
        return this.unreadSentCount;
      else
        return 0;
    },
    chosenFolderName(){
      return this.folderList[this.chosenFolder] ? this.folderList[this.chosenFolder].text : null;
    },
    inboxList () {
      return this.$store.getters['localStorage/inboxListForUser'];
    },
    sentFolder(){
      return this.$store.getters['localStorage/sentFolderForUser'];
    },
    folderList() {
      return this.$store.state.localStorage.folderList;
    },
    categoryList(){
      return this.$store.state.localStorage.categoryList;
    },
    labelList(){
      return this.$store.state.localStorage.labelList;
    },
    unreadCount(){
      console.log("#### this is the unread email count for badge: ", this.$store.getters['localStorage/unreadEmailCount'])
      return this.$store.getters['localStorage/unreadEmailCount'];
    },
    unreadSentCount(){
      return this.$store.getters['localStorage/unreadSentEmailCount'];
    },
    draftCount(){
      return this.$store.getters['localStorage/draftEmailCount'];
    },
    emailDialog(){
      return this.$store.getters['localStorage/emailDialogState']; 
    },
    dialogMode(){
      return this.$store.getters['localStorage/emailDialogMode']; 
    }
  },
  filters: {
    humanizeTimestamp: function(value){
      return moment(value).calendar();
    },
  },
  watch: {
    emailSearchFilter (val){
      this.$store.commit('localStorage/updateLayoutSearchFilter', val);
    }
  },
  methods: {
    refreshInbox(){
      let self = this;
      self.inboxLoading = true;
      setTimeout(function(){
        self.inboxLoading = false;
      }, 3000);
    },
    showSnackBar(msg, color){
      this.appSnackbarMsg = msg;
      this.appSnackbar = true;
      this.appSnackbarColor = color;
    },
    markRead(){
      this.$store.commit('localStorage/markEmailsRead', this.selectedInboxList);
    },
    composeEmail(){
      this.$store.dispatch(`localStorage/setEmailModeToCompose`);
      this.$store.dispatch(`localStorage/openEmailDialog`);
    },
    cancelComposeEmail(){
      this.$store.dispatch(`localStorage/closeEmailDialog`);
    },
    dismissEmailDialog(){
      if(this.dialogMode == 'Read'){
        console.log("going to dismiss dialog in read mode!");
        this.readEmailObject = null;
        this.selectedInboxList = [];
        this.$store.dispatch(`localStorage/closeEmailDialog`);
      }
    },
    sendEmail(){
      this.$store.dispatch(`localStorage/sendEmail`, {recipientEmail: this.new_email_to, senderName: this.$store.getters['localStorage/currentUser'].name, senderEmail: this.$store.getters['localStorage/currentUser'].email, subject: this.new_email_subject, body: this.new_email_body});
      this.$store.dispatch(`localStorage/closeEmailDialog`);
      this.showSnackBar(`Email successfully sent!`, 'success');
    },
    openEmail(emailClicked){
      this.readEmailObject = emailClicked;
      this.$store.dispatch(`localStorage/setEmailModeToRead`);
      this.$store.dispatch(`localStorage/openEmailDialog`);
      this.selectedInboxList.push(emailClicked);
      this.markRead();
    },
    changeChosenFolder(currentFolder){
      console.log("#### folder clicked: ", currentFolder);
    },
    deleteEmails(){
      this.$store.commit('localStorage/remove', this.selectedInboxList);
      this.showSnackBar(`Successfully deleted ${this.selectedInboxList.length} email(s)`, 'info');
      this.selectedInboxList = [];
    }
  }
}
</script>

<style>
.slimListItem{
  max-height: 30px;
}

.inboxLeftPanel{
  max-height: 600px; 
  overflow-y: auto; 
  overflow-x: hidden;
}

.emailBodyStyled{
  white-space: pre-wrap;       /* css-3 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
  word-wrap: break-word;
}
</style>