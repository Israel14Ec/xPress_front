import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

//Importaciones para FormKit
import {plugin, defaultConfig} from '@formkit/vue'
import config from '../formkit.config'

//Importaciones para Toast
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css'; //Tema para las notificaciones

//Importacion para sweetalert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Firebase
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './config/firebase'

//Vuetify
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

//Select2
//import Select2 from 'vue3-select2-component';

//VueChartkick - para los reportes
import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'

import App from './App.vue'
import router from './router'

//Configuración de TOAST:
const $toast = useToast({
    duration: 3000, //Duracion 3 segundos
    position: 'top-right'
})

//Vuetify
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        iconfont: 'mdi'
    }
})


const app = createApp(App)
app.use(vuetify)
app.use(VueChartkick)
app.provide('toast', $toast) //Proporcionamos los toast a todos los componentes
app.use(VueFire, {firebaseApp, modules: [VueFireAuth()],}) //Instalamos firebase
app.use(VueSweetalert2);    //Instalamos SweetAlert
app.use(plugin, defaultConfig(config))//Instalamos formkit
app.use(createPinia())
app.use(router)
app.mount('#app')
