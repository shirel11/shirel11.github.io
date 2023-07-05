<template>
  <div id="app">
         <ejs-toast ref='toastRef' id='toast_type' :position='position' :created='created' :close='onclose' :beforeOpen='onbeforeOpen'>
                </ejs-toast>
    <div class="fixed-top">
    <nav v-if="ShowNav" id="Navig"  class="navbar navbar-expand navbar-dark bg-dark">
      <!-- <a href="/" class="navbar-brand">VoteMote</a> -->
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" /> VoteMote<!--בית--> 
          </router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link to="/admin" class="nav-link">Admin Board</router-link>
        </li>
        <li v-if="showModeratorBoard" class="nav-item">
          <router-link to="/mod" class="nav-link">Moderator Board</router-link>
        </li>
              <li  v-if="currentUser" class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link>
        </li> -->
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> הרשמה
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> התחברות
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <!-- <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li> -->
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> התנתק
          </a>
        </li>
      </div>
    </nav>
</div>
    <div class="container" style="margin-top: 8vh;">
      <router-view />
    </div>
  </div>
</template>

<script >


import {   loadCldr,enableRtl } from '@syncfusion/ej2-base';

import * as n1 from  '../node_modules/cldr-data/main/he/currencies.json'
import * as n2 from '../node_modules/cldr-data/main/he/timeZoneNames.json';
import * as n3 from '../node_modules/cldr-data/main/he/numbers.json';
import * as n4 from '../node_modules/cldr-data/main/he/ca-gregorian.json';
import * as s from '../node_modules/cldr-data/supplemental/currencyData.json';
import * as s2 from '../node_modules/cldr-data/supplemental/numberingSystems.json';

loadCldr(n1, n2, n3, n4, s, s2);
enableRtl(true);
export default {
  data() {
    return {
      ShowNav:true,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }

      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_MODERATOR');
      }

      return false;
    }
  },
  methods: {
    HideOrShowNavBar(Show){
      this.ShowNav=Show;
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }, 
    infoToast: function(message,body){
          this.$refs.toastRef.show({ title: message, content: body, cssClass: 'e-toast-info', icon: 'e-info toast-icons',position: { X: 'Right', Y: 'Bottom' },showCloseButton:true,showProgressBar:true})
        },
        successToast: function(message,body){
          this.$refs.toastRef.show({ title: message, content: body, cssClass: 'e-toast-success', icon: 'e-success toast-icons',position: { X: 'Right', Y: 'Bottom' },showCloseButton:true,showProgressBar:true})
        },
        warningToast: function(message,body){
          this.$refs.toastRef.show({ title: message, content:body, cssClass: 'e-toast-warning', icon: 'e-warning toast-icons',position: { X: 'Right', Y: 'Bottom' },showCloseButton:true,showProgressBar:true})
        },
        dangerToast: function(message,body){
    
          this.$refs.toastRef.show({ title: message, content: body, cssClass: 'e-toast-danger', icon: 'e-error toast-icons',position: { X: 'Right', Y: 'Bottom' },showCloseButton:true,showProgressBar:true})
        },
        hideToast: function(){
            this.$refs.toastRef.hide('All');

        }
  }
};
</script>
<style>
  @import "../node_modules/@syncfusion/ej2-base/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-buttons/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-calendars/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-inputs/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-vue-grids/styles/material.css";
  @import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
  @import "../node_modules/@syncfusion/ej2-vue-calendars/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-vue-notifications/styles/material.css";
  @import "../node_modules/@syncfusion/ej2-vue-richtexteditor/styles/material.css";


html {
  position: relative;
  min-height: 100%;
}
*{
  direction: rtl;
}
.navbar .navbar-expand .navbar-dark .bg-dark , .nav-link,.navbar-nav .ml-auto,.nav-item,#Navig{
  direction: ltr;
}
body {
  margin-bottom: 160px !important; /* Height of the footer */
  padding: 0;
   min-height: 77vh;
}

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 160px; /* Set the fixed height of the footer here */
}

/* Override Bootstrap Styling */

.btn-primary {
  background-color: #025fce !important;
}




/* Toast style */
@font-face {
    font-family: 'Toast_icons';
    src: url(data:application/x-font-ttf;charset=utf-8;base64,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) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  #toast_types button {
    margin: 5px;
    min-width: 160px;
    max-width: 160px;
  }



  .toast-icons {
    font-family: 'Toast_icons' !important;
    speak: none;
    font-size: 55px;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #toast_type .e-toast-icon.e-icons {
    height: auto;
    font-size: 30px;
  }
  
  .bootstrap5 #toast_type .e-toast-icon.e-icons,
  .bootstrap5-dark #toast_type .e-toast-icon.e-icons {
    height: 25px;
  }

  #toast_type .toast-icons.e-success::before {
    content: "\e701";
  }

  #toast_type .toast-icons.e-error::before {
    content: "\e700";
  }

  #toast_type .toast-icons.e-info::before {
    content: "\e704";
  }

  #toast_type .toast-icons.e-warning::before {
    content: "\e703";
  }
</style>