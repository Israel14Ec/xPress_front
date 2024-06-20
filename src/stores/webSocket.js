import { defineStore, storeToRefs } from 'pinia';
import { ref, inject } from 'vue';
import { useAuthStore } from './auth';
import { useNotificationStore } from './notification';
//import echoInstance from '../config/echo';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


export const useWebSocketStore = defineStore('websockets', () => {

    const toast = inject('toast')
    //Configuración del echo para canales privados
    window.Pusher = Pusher;
    const token = localStorage.getItem('AUTH_TOKEN')

    const echoConfig = {
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_KEY, 
        wsHost: import.meta.env.VITE_PUSHER_HOST, 
        wsPort: import.meta.env.VITE_WS_PORT, 
        forceTLS: false, 
        disableStats: true,
        cluster: 'mt1',
        authEndpoint: import.meta.env.VITE_AUTH_ENDPOINT,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    };

    const echoInstance = new Echo(echoConfig);


    const messages = ref([]);
    const authStore = useAuthStore()
    const notification = useNotificationStore()
    const { userData } = storeToRefs(authStore)
    const { notify } = storeToRefs(notification)

    function startListening() {
        echoInstance.channel('home').listen('Hello', (e) => {
            messages.value.push(e.welcome);
        });
    }

    function startListening2() {
        echoInstance.private('private-test.' + userData.value.id_user)
          .listen('PrivateHellow', (e) => {
              console.log(e);
              messages.value.push(e);
          }); 
    }
    

    //Escucha por las actualizaciones del trabajo - Jefe de departamento
    function startListeningJob() {
        try {
            echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
            .listen('UserAssigned', ({data}) => {
                toast.open({
                    message: 'Se le ha asignado un nuevo trabajo, revise las notificaciones',
                    type: 'info'
                })
                notify.value.unshift(data) //Al comienzo del Array
            })

        } catch (error) {
            console.log(error)
        }
    }

    //Escucha por el trabajo asignado - Empleado
    function startListenWorkAssigned() {
        try {
            echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
            .listen('WorkAssigned', ({data}) => {
                toast.open({
                    message: 'Se asigno un nuevo trabajo',
                    type: 'info'
                })
                notify.value.unshift(data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    //Escucho por el evento de reportMaterial - Admin
    function startListenReportMaterial() {
        try {
            echoInstance.private(`materialReport.${userData.value.id_user}`)
            .listen('MaterialAssigned', ({data}) => {
                toast.open({
                    message: data.description,
                    type: 'warning'
                })
                notify.value.unshift(data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    //Escucha por el evento de equipment report - Admin
    function startListenReportEquipment() {
        try {
    
            echoInstance.private(`equipmentReport.${userData.value.id_user}`)
            .listen('EquipmentAssigned', ({data}) => {
               
                toast.open({
                    message: data.description,
                    type: 'warning'
                })
                notify.value.unshift(data)
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    //Escucho por el evento de materialUnavailable, material que se necesita para un trabajo ()
    function startlisteningMaterialUnavailable() {
        try {
            echoInstance.private(`materialUnavailable.${userData.value.id_user}`)
            .listen('MaterialUnavailable', ({data}) => {
                toast.open({
                    message: data.subject,
                    type: 'info'
                })
                notify.value.unshift(data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    //Escucho por el evento de equipmentUnavailable, se necesita un equipo para un trabajo
    function startListeningEquipmentUnavailable () {
        try {
            echoInstance.private(`equipmentUnavailable.${userData.value.id_user}`)
            .listen('EquipmentUnavailable', ({data}) => {
                toast.open({
                    message: data.subject,
                    type: 'info'
                })
                notify.value.unshift(data)
            })

        } catch (error) {
            console.log(error)
        }
    }

    //Escucho por el evento ReportWorkComplete - Jefe de departamento
    function startListenReportWorkComplete() { 
        try {
            echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
            .listen('ReportWorkComplete', ({data}) => {
                toast.open({
                    message: data.subject,
                    type: 'info'
                })
                console.log(data)
                notify.value.unshift(data) //Al comienzo del Array
            })

        } catch (error) {
            console.log(error)
        }
    }

    return { 
        messages, 
        startListening,
        startListening2,
        startListeningJob,
        startListenWorkAssigned,
        startListenReportMaterial,
        startListenReportWorkComplete,
        startListenReportEquipment,
        startlisteningMaterialUnavailable,
        startListeningEquipmentUnavailable
    };
});

