<template>
  <wb-nav  :mainColor="'#eeaa11'" :showItems="true" :userName="'Bruce'" :navbarItems="navbarItems" :profileMenuItems="profileMenuItems"></wb-nav>
</template>
<style>
 
</style>
<script>
import wbNav from 'wb-nav';

export default {
  name: 'navbar',
  components: {
    wbNav,
  },
  data: function () {
    return {
      navbarItems: [
        {
          id: 0,
          name: 'DASHBOARD',
          active: false,
          url: 'url',
          onClick: this.changeLocation,
        },
        {
          id: 1,
          name: 'SERVICES',
          active: true,
          url: 'url',
          onClick: this.changeLocation,
        },
        {
          id: 2,
          name: 'ALARMS',
          active: false,
          url: 'url',
          onClick: this.changeLocation,
        },
      ],

      profileMenuItems: [
        {
          icon: 'business',
          name: 'Application management',
          url: 'url',
          onClick: this.profileMenuItemsOnClick,
        },
        {
          icon: 'build',
          name: 'Service Management',
          url: 'url',
          onClick: this.profileMenuItemsOnClick,
        },
        {
          icon: 'people',
          name: 'Customer Management',
          url: 'url',
          onClick: this.profileMenuItemsOnClick,
        },
        {
          icon: 'featured_play_list',
          name: 'Developer Management',
          url: 'url',
          onClick: this.profileMenuItemsOnClick,
        },
        {
          icon: 'settings',
          name: 'Settings',
          url: 'url',
          onClick: this.profileMenuItemsOnClick,
        },
        {
          icon: 'exit_to_app',
          name: 'Log out',
          url: 'url',
          onClick: this.profileMenuItemsOnClick,
        },
      ],
    };
  },
  created() {
  },
  methods: {
   profileMenuItemsOnClick: function (item) {
    console.log('profileMenuItems onClick', item);
   },
   changeLocation: function (item) {
    console.log('profileMenuItems onClick', item);
   },
  },
};
</script>
