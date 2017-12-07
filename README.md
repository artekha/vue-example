# wbNav


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Get started

Instal eventBar package via npm:

  `npm i wb-nav` 

  or

  `npm install wb-nav`

Import package into your component: 

`import wbNav from 'wb-nav';`

or

`let wbNav = require('wb-nav');`

Set it as vue component

`components: { wbNav },`

Use it

`<wb-nav :navLogo="'navLogo.png'" :mainColor="'blue'" :showItems="loginState.loggedIn" :userName="userName" :navbarItems="navbarItems" :profileMenuItems="profileMenuItems"></wb-nav>`

---

**Properties:**

* navLogo - path to logo image(if null will drawn wb logo)
* mainColor - color of hover item and borders colors(if null will be equeal wb color #ff9800)
* showItems - boolean parameter for show/hide items in nav(i.e. if user logged in or not)
* userName - username that will be shown near the profile icon
* navbarItems - array of objects that will be shown as main menu items. They should have next format:

```
{
  id: 0,
  name: 'DASHBOARD', //name that will be showed
  active: false,
  url: 'url', 
  onClick: this.changeLocation, // function that will be called on click and receives item's data as parameter
},
```

* profileMenuItems - array of objects that will be shown as profile droopdown items. They should have next format:

```
{
  icon: 'business',
  name: 'Application management',
  url: 'url',
  onClick: this.profileMenuItemsOnClick, // function that will be called on click and receives item's data as parameter
},
```
