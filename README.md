# Solution for Sahaj UI Assignment

> Solution is deployed here: https://sahajuinow.sandjay.now.sh/

## Summary of technologies used:
- JS Framework: Vue.JS / NuxtJS / VueX  
- Front end framework: Vuetify.JS  
- Deployment platform: Zeit's Now (Netlify caused deployment errors)  
- Data is persisted in local storage, and accessed via VueJS's Vuex system  

## Usage: 
- Upon loading the solution site, you will notice a simple login form for the user to enter their email address & password, in order to login.  
- Also on the login page, you will also notice a yellow colored button on the bottom left that can be used to reset the master app data, to the original state; NOTE: IN ORDER TO START TESTING THE ASSIGNMENT YOU MUST RESET THE MASTER DATA, as all data is stored inside the browser's local storage and nothing exists in either account's inbox till the master reset is done.
- ONLY 2 users have been set up for the purposes of this assignment; please find below their email address and password, so that this can be tested properly:  

    - USER 1 (David Williams)
        username: david@williams.com
        password: password123
    - USER 2 (John Doe)
        username: john@doe.com
        password: password@123

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
