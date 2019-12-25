var uuid = require('uuid');

export const state = () => ({
    emailList: [],
    selectedEmailList: [],
    categoryList: [],
    folderList: [],
    labelList: [],
    userDetails: {},
    authenticatedUsers: [],
    searchFilter: '',
    emailDialog: false,
    dialogMode: 'Compose'
})

export const mutations = {
    updateEmailList(state, newList){
        state.emailList = newList;
    },
    markEmailsRead(state, emailsRead){
        state.emailList.forEach(email => {
            if(emailsRead.some((a) => a.id == email.id)){
                email.unread = false;
            }
        });
    },
    updateLayoutSearchFilter(state, newSearchFilter){
        state.searchFilter = newSearchFilter;
    },
    updateFolderList(state, newList){
        state.folderList = newList;
    },
    updateCategoryList(state, newList){
        state.categoryList = newList;
    },
    updateLabelList(state, newList){
        state.labelList = newList;
    },
    updateAuthenticatedUserList(state, userList){
        state.authenticatedUsers = userList;
    },
    updateCurrentUser(state, userObj){
        if(userObj)
            userObj.authenticated = true;
        state.userDetails = userObj;
    },
    addEmailToMasterList(state,newEmail){
        state.emailList.push(newEmail);
    },
    remove (state, selectedEmailList) {
        console.log("#### about to try deleting emails using this selected email list: ", selectedEmailList);
        selectedEmailList.forEach(email => {
            state.emailList.splice(state.emailList.indexOf(email), 1)
        });
    },
    updateEmailDialogState(state, newState){
        state.emailDialog = newState;
    },
    setEmailDialogMode(state, newMode){
        state.dialogMode = newMode;
    },
    toggle (state, todo) {
        todo.done = !todo.done
    }
}

export const getters = {
    inboxListForUser: state => {
        return (state.emailList && state.userDetails) ? state.emailList.filter(x => x.recipientEmail == state.userDetails.email) : [];
    },
    sentFolderForUser: state => {
        return (state.emailList && state.userDetails) ? state.emailList.filter(x => x.senderEmail == state.userDetails.email) : [];
    },
    unreadEmailCount: state => {
        return (state.emailList && state.userDetails) ? state.emailList.filter(x => x.recipientEmail == state.userDetails.email && x.unread == true).length : 0
    },
    unreadSentEmailCount: state => {
        return (state.emailList && state.userDetails) ? state.emailList.filter(x => x.senderEmail == state.userDetails.email && x.unread == true).length : 0
    },
    draftEmailCount: state => {
        return (state.emailList && state.userDetails) ? state.emailList.filter(x => x.recipientEmail == state.userDetails.email && x.draft == true).length : 0
    },
    userAuthenticated: state => {
        return state.userDetails && state.userDetails.email && state.userDetails.authenticated;
    },
    currentUser: state => {
        return state.userDetails;
    },
    updatedSearchFilter: state => {
        return state.searchFilter;
    },
    emailDialogState: state => {
        return state.emailDialog;
    },
    emailDialogMode: state => {
        return state.dialogMode;
    }
}

export const actions = {
    increment (context) {
        context.commit('increment')
    },
    resetMasterEmailList(context){
        let originalEmailList = [
            {id: 1,categories: [], draft: false, unread: false, senderName: 'Anna Smith', senderEmail: 'anna@smith.com', subject: 'Lorem ipsum dolor noretek imit set.', recipientEmail: 'david@williams.com', sentTime: 1576833163363, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum fringilla velit. Suspendisse lectus ligula, feugiat non nulla ac, fermentum mollis nisl. Vivamus at placerat sapien. Vivamus porttitor, felis sit amet tempus vehicula, lacus magna laoreet neque, ut maximus urna velit sed turpis. Etiam tellus mauris, iaculis ut aliquam vel, malesuada quis nisi. In et vehicula sem. Etiam et felis ac lacus condimentum vulputate. Nam ut metus id purus pharetra accumsan ut id justo. Maecenas vel nulla eu leo fringilla gravida rhoncus eu orci. Vestibulum bibendum pulvinar nulla sed iaculis. Cras hendrerit non magna et mollis. Cras dapibus, metus faucibus aliquet gravida, tortor ante pulvinar nisi, consequat volutpat urna quam vitae arcu. Suspendisse id commodo sapien. Curabitur commodo accumsan magna nec suscipit. Curabitur non metus feugiat, malesuada erat nec, bibendum erat. Quisque neque elit, semper vitae rutrum id, vulputate a nibh. Aliquam bibendum placerat lorem, ut posuere metus dictum interdum.'},
            {id: 2,categories: [],draft: false, unread: true, senderName: 'Jack Nowak', senderEmail: 'jack@nowak.com', subject: 'Aldus Pagemaker including versions of Lorem Ipsum', recipientEmail: 'david@williams.com', sentTime: 1575796361163, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum fringilla velit. Suspendisse lectus ligula, feugiat non nulla ac, fermentum mollis nisl. Vivamus at placerat sapien. Vivamus porttitor, felis sit amet tempus vehicula, lacus magna laoreet neque, ut maximus urna velit sed turpis. Etiam tellus mauris, iaculis ut aliquam vel, malesuada quis nisi. In et vehicula sem. Etiam et felis ac lacus condimentum vulputate. Nam ut metus id purus pharetra accumsan ut id justo. Maecenas vel nulla eu leo fringilla gravida rhoncus eu orci. Vestibulum bibendum pulvinar nulla sed iaculis. Cras hendrerit non magna et mollis. Cras dapibus, metus faucibus aliquet gravida, tortor ante pulvinar nisi, consequat volutpat urna quam vitae arcu. Suspendisse id commodo sapien. Curabitur commodo accumsan magna nec suscipit. Curabitur non metus feugiat, malesuada erat nec, bibendum erat. Quisque neque elit, semper vitae rutrum id, vulputate a nibh. Aliquam bibendum placerat lorem, ut posuere metus dictum interdum.'},
            {id: 3,categories: ['Clients'],draft: false, unread: true, senderName: 'Facebook', senderEmail: 'test@fb.com', subject: 'Many desktop publishing packages and web page editors', recipientEmail: 'david@williams.com', sentTime: 1573204363112, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum fringilla velit. Suspendisse lectus ligula, feugiat non nulla ac, fermentum mollis nisl. Vivamus at placerat sapien. Vivamus porttitor, felis sit amet tempus vehicula, lacus magna laoreet neque, ut maximus urna velit sed turpis. Etiam tellus mauris, iaculis ut aliquam vel, malesuada quis nisi. In et vehicula sem. Etiam et felis ac lacus condimentum vulputate. Nam ut metus id purus pharetra accumsan ut id justo. Maecenas vel nulla eu leo fringilla gravida rhoncus eu orci. Vestibulum bibendum pulvinar nulla sed iaculis. Cras hendrerit non magna et mollis. Cras dapibus, metus faucibus aliquet gravida, tortor ante pulvinar nisi, consequat volutpat urna quam vitae arcu. Suspendisse id commodo sapien. Curabitur commodo accumsan magna nec suscipit. Curabitur non metus feugiat, malesuada erat nec, bibendum erat. Quisque neque elit, semper vitae rutrum id, vulputate a nibh. Aliquam bibendum placerat lorem, ut posuere metus dictum interdum.'},
            {id: 4,categories: [],draft: false, unread: true, senderName: 'Mailchip', senderEmail: 'mail@chip.com', subject: 'There are many variations of Lorem ipsum.', recipientEmail: 'david@williams.com', sentTime: 1569316363363, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum fringilla velit. Suspendisse lectus ligula, feugiat non nulla ac, fermentum mollis nisl. Vivamus at placerat sapien. Vivamus porttitor, felis sit amet tempus vehicula, lacus magna laoreet neque, ut maximus urna velit sed turpis. Etiam tellus mauris, iaculis ut aliquam vel, malesuada quis nisi. In et vehicula sem. Etiam et felis ac lacus condimentum vulputate. Nam ut metus id purus pharetra accumsan ut id justo. Maecenas vel nulla eu leo fringilla gravida rhoncus eu orci. Vestibulum bibendum pulvinar nulla sed iaculis. Cras hendrerit non magna et mollis. Cras dapibus, metus faucibus aliquet gravida, tortor ante pulvinar nisi, consequat volutpat urna quam vitae arcu. Suspendisse id commodo sapien. Curabitur commodo accumsan magna nec suscipit. Curabitur non metus feugiat, malesuada erat nec, bibendum erat. Quisque neque elit, semper vitae rutrum id, vulputate a nibh. Aliquam bibendum placerat lorem, ut posuere metus dictum interdum.'},
            {id: 5,categories: ['Documents'],draft: false, unread: true, senderName: 'Alex T.', senderEmail: 'alex@t.com', subject: 'Lorem ipsum dolor noretek imit set.', recipientEmail: 'david@williams.com', sentTime: 1564564363000, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum fringilla velit. Suspendisse lectus ligula, feugiat non nulla ac, fermentum mollis nisl. Vivamus at placerat sapien. Vivamus porttitor, felis sit amet tempus vehicula, lacus magna laoreet neque, ut maximus urna velit sed turpis. Etiam tellus mauris, iaculis ut aliquam vel, malesuada quis nisi. In et vehicula sem. Etiam et felis ac lacus condimentum vulputate. Nam ut metus id purus pharetra accumsan ut id justo. Maecenas vel nulla eu leo fringilla gravida rhoncus eu orci. Vestibulum bibendum pulvinar nulla sed iaculis. Cras hendrerit non magna et mollis. Cras dapibus, metus faucibus aliquet gravida, tortor ante pulvinar nisi, consequat volutpat urna quam vitae arcu. Suspendisse id commodo sapien. Curabitur commodo accumsan magna nec suscipit. Curabitur non metus feugiat, malesuada erat nec, bibendum erat. Quisque neque elit, semper vitae rutrum id, vulputate a nibh. Aliquam bibendum placerat lorem, ut posuere metus dictum interdum.'},
            {id: 6,categories: [],draft: false, unread: true, senderName: 'Monica Rhyther', senderEmail: 'monica@rhyther.com', subject: 'The standard chunk of Lorem Ipsum used', recipientEmail: 'david@williams.com', sentTime: 1558084362363, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum fringilla velit. Suspendisse lectus ligula, feugiat non nulla ac, fermentum mollis nisl. Vivamus at placerat sapien. Vivamus porttitor, felis sit amet tempus vehicula, lacus magna laoreet neque, ut maximus urna velit sed turpis. Etiam tellus mauris, iaculis ut aliquam vel, malesuada quis nisi. In et vehicula sem. Etiam et felis ac lacus condimentum vulputate. Nam ut metus id purus pharetra accumsan ut id justo. Maecenas vel nulla eu leo fringilla gravida rhoncus eu orci. Vestibulum bibendum pulvinar nulla sed iaculis. Cras hendrerit non magna et mollis. Cras dapibus, metus faucibus aliquet gravida, tortor ante pulvinar nisi, consequat volutpat urna quam vitae arcu. Suspendisse id commodo sapien. Curabitur commodo accumsan magna nec suscipit. Curabitur non metus feugiat, malesuada erat nec, bibendum erat. Quisque neque elit, semper vitae rutrum id, vulputate a nibh. Aliquam bibendum placerat lorem, ut posuere metus dictum interdum.'},
            {id: 7,categories: [],draft: false, unread: true, senderName: 'Sandra Derick', senderEmail: 'sandra@derick.com', subject: 'Contrary to popular belief', recipientEmail: 'david@williams.com', sentTime: 1549876361000, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum fringilla velit. Suspendisse lectus ligula, feugiat non nulla ac, fermentum mollis nisl. Vivamus at placerat sapien. Vivamus porttitor, felis sit amet tempus vehicula, lacus magna laoreet neque, ut maximus urna velit sed turpis. Etiam tellus mauris, iaculis ut aliquam vel, malesuada quis nisi. In et vehicula sem. Etiam et felis ac lacus condimentum vulputate. Nam ut metus id purus pharetra accumsan ut id justo. Maecenas vel nulla eu leo fringilla gravida rhoncus eu orci. Vestibulum bibendum pulvinar nulla sed iaculis. Cras hendrerit non magna et mollis. Cras dapibus, metus faucibus aliquet gravida, tortor ante pulvinar nisi, consequat volutpat urna quam vitae arcu. Suspendisse id commodo sapien. Curabitur commodo accumsan magna nec suscipit. Curabitur non metus feugiat, malesuada erat nec, bibendum erat. Quisque neque elit, semper vitae rutrum id, vulputate a nibh. Aliquam bibendum placerat lorem, ut posuere metus dictum interdum.'},
            {id: 8,categories: ['Adv'],draft: false, unread: true, senderName: 'Patrick Pertners', senderEmail: 'patrick@pertners.com', subject: 'If you are going to use a passage of Lorem', recipientEmail: 'david@williams.com', sentTime: 1538644362000, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum fringilla velit. Suspendisse lectus ligula, feugiat non nulla ac, fermentum mollis nisl. Vivamus at placerat sapien. Vivamus porttitor, felis sit amet tempus vehicula, lacus magna laoreet neque, ut maximus urna velit sed turpis. Etiam tellus mauris, iaculis ut aliquam vel, malesuada quis nisi. In et vehicula sem. Etiam et felis ac lacus condimentum vulputate. Nam ut metus id purus pharetra accumsan ut id justo. Maecenas vel nulla eu leo fringilla gravida rhoncus eu orci. Vestibulum bibendum pulvinar nulla sed iaculis. Cras hendrerit non magna et mollis. Cras dapibus, metus faucibus aliquet gravida, tortor ante pulvinar nisi, consequat volutpat urna quam vitae arcu. Suspendisse id commodo sapien. Curabitur commodo accumsan magna nec suscipit. Curabitur non metus feugiat, malesuada erat nec, bibendum erat. Quisque neque elit, semper vitae rutrum id, vulputate a nibh. Aliquam bibendum placerat lorem, ut posuere metus dictum interdum.'},
            {id: 9,categories: [],draft: false, unread: true, senderName: 'Michael Fox', senderEmail: 'michael@fox.com', subject: 'Humor or non-charateristic words, etc.', recipientEmail: 'david@williams.com', sentTime: 1524820361500, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum fringilla velit. Suspendisse lectus ligula, feugiat non nulla ac, fermentum mollis nisl. Vivamus at placerat sapien. Vivamus porttitor, felis sit amet tempus vehicula, lacus magna laoreet neque, ut maximus urna velit sed turpis. Etiam tellus mauris, iaculis ut aliquam vel, malesuada quis nisi. In et vehicula sem. Etiam et felis ac lacus condimentum vulputate. Nam ut metus id purus pharetra accumsan ut id justo. Maecenas vel nulla eu leo fringilla gravida rhoncus eu orci. Vestibulum bibendum pulvinar nulla sed iaculis. Cras hendrerit non magna et mollis. Cras dapibus, metus faucibus aliquet gravida, tortor ante pulvinar nisi, consequat volutpat urna quam vitae arcu. Suspendisse id commodo sapien. Curabitur commodo accumsan magna nec suscipit. Curabitur non metus feugiat, malesuada erat nec, bibendum erat. Quisque neque elit, semper vitae rutrum id, vulputate a nibh. Aliquam bibendum placerat lorem, ut posuere metus dictum interdum.'},
            {id: 10,categories: [],draft: false, unread: true, senderName: 'Damien Ritz', senderEmail: 'damien@ritz.com', subject: 'Oor Lorem Ipsum is that it has a more-or-less normal.', recipientEmail: 'david@williams.com', sentTime: 1506676361500, body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent rutrum fringilla velit. Suspendisse lectus ligula, feugiat non nulla ac, fermentum mollis nisl. Vivamus at placerat sapien. Vivamus porttitor, felis sit amet tempus vehicula, lacus magna laoreet neque, ut maximus urna velit sed turpis. Etiam tellus mauris, iaculis ut aliquam vel, malesuada quis nisi. In et vehicula sem. Etiam et felis ac lacus condimentum vulputate. Nam ut metus id purus pharetra accumsan ut id justo. Maecenas vel nulla eu leo fringilla gravida rhoncus eu orci. Vestibulum bibendum pulvinar nulla sed iaculis. Cras hendrerit non magna et mollis. Cras dapibus, metus faucibus aliquet gravida, tortor ante pulvinar nisi, consequat volutpat urna quam vitae arcu. Suspendisse id commodo sapien. Curabitur commodo accumsan magna nec suscipit. Curabitur non metus feugiat, malesuada erat nec, bibendum erat. Quisque neque elit, semper vitae rutrum id, vulputate a nibh. Aliquam bibendum placerat lorem, ut posuere metus dictum interdum.'},
        ];
        context.commit('updateEmailList', originalEmailList);
    },
    resetMasterCategoryList(context){
        let originalCategoryList = [
            { text: 'Work', color: '#00B493' },
            { text: 'Documents', color: 'red' },
            { text: 'Social', color: 'blue' },
            { text: 'Advertising', color: 'light-green' },
            { text: 'Clients', color: 'orange' },
        ];
        context.commit('updateCategoryList', originalCategoryList);
    },
    resetMasterFolderList(context){
        let originalFolderList = [
            { text: 'Inbox', icon: 'mdi-inbox', badge_content: context.getters.unreadEmailCount, badge_color: 'orange' },
            { text: 'Sent Mail', icon: 'mdi-email' },
            { text: 'Important', icon: 'mdi-star' },
            { text: 'Drafts', icon: 'mdi-file-document', badge_content: context.getters.draftEmailCount, badge_color: 'pink'  },
            { text: 'Trash', icon: 'mdi-trash-can-outline' },
        ];
        context.commit('updateFolderList', originalFolderList);
    },
    resetMasterLabelList(context){
        let originalLabelList = [
            { text: 'Family' },
            { text: 'Work' },
            { text: 'Home' },
            { text: 'Children' },
            { text: 'Holidays' },
            { text: 'Music' },
            { text: 'Photography' },
            { text: 'Film' },
        ];
        context.commit('updateLabelList', originalLabelList);
    },
    masterResetApp(context){
        context.dispatch('resetMasterEmailList');
        context.dispatch('resetMasterCategoryList');
        context.dispatch('resetMasterFolderList');
        context.dispatch('resetMasterLabelList');
    },
    setupUserlist(context){
        let goodUserList = [
            {name: 'David Williams', email: 'david@williams.com', designation: 'Art Director', password: 'password123', photo: 'https://randomuser.me/api/portraits/men/32.jpg'},
            {name: 'John Doe', email: 'john@doe.com', designation: 'HR Manager', password: 'password@123', photo: 'https://randomuser.me/api/portraits/men/51.jpg'}
        ];
        context.commit('updateAuthenticatedUserList', goodUserList);
    },
    logoutUser(context){
        context.commit('updateCurrentUser', undefined);
    },
    authenticateUser(context, args){
        let authenticatedUser;
        context.state.authenticatedUsers.forEach(eachUser => {
            if(eachUser.email == args.email && eachUser.password == args.password){
                authenticatedUser = eachUser;
            }
        })
        context.commit('updateCurrentUser', authenticatedUser);
        return authenticatedUser;
    },
    sendEmail(context, args){
        let newId = uuid.v4();
        args.id = newId;
        args.categories = [];
        args.draft = false;
        args.unread = true;
        args.sentTime = new Date().getTime();
        console.log("### going to send this email now: ", args);
        context.commit('addEmailToMasterList', args);
    },
    openEmailDialog(context){
        context.commit('updateEmailDialogState', true);
    },
    closeEmailDialog(context){
        context.commit('updateEmailDialogState', false);
    },
    setEmailModeToCompose(context){
        context.commit('setEmailDialogMode', 'Compose');
    },
    setEmailModeToRead(context){
        context.commit('setEmailDialogMode', 'Read');
    }
}