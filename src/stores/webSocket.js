import { defineStore, storeToRefs } from 'pinia';
import { ref, inject } from 'vue';
import { useAuthStore } from './auth';
import { useNotificationStore } from './notification';
import { initEcho } from '../config/echo';

export const useWebSocketStore = defineStore('websockets', () => {
    const toast = inject('toast');
    const messages = ref([]);
    const authStore = useAuthStore();
    const notification = useNotificationStore();
    const { userData } = storeToRefs(authStore);
    const { notify } = storeToRefs(notification);

    const echoInstance = initEcho();

    // -------------------------- LISTENERS ---------------------------------------
    //Admin
    function registerAdminListeners() {

        //Escucha por el reporte de material
        echoInstance.private(`materialReport.${userData.value.id_user}`)
            .listen('MaterialAssigned', ({ data }) => {
                console.log('Received MaterialAssigned event:', data);
                toast.open({
                    message: data.description,
                    type: 'warning',
                });
                notify.value.unshift(data);
            });
        
        //Escucha por el equipo reportado
        echoInstance.private(`equipmentReport.${userData.value.id_user}`)
            .listen('EquipmentAssigned', ({ data }) => {
                console.log('Received EquipmentAssigned event:', data);
                toast.open({
                    message: data.description,
                    type: 'warning',
                });
                notify.value.unshift(data);
            });
        
        //Escucha por la notificación del material no disponible
        echoInstance.private(`materialUnavailable.${userData.value.id_user}`)
            .listen('MaterialUnavailable', ({ data }) => {
                console.log('Received MaterialUnavailable event:', data);
                toast.open({
                    message: data.subject,
                    type: 'info',
                });
                notify.value.unshift(data);
            });
        
        //Escucha por la notificación del equipo no disponible 
        echoInstance.private(`equipmentUnavailable.${userData.value.id_user}`)
            .listen('EquipmentUnavailable', ({ data }) => {
                console.log('Received EquipmentUnavailable event:', data);
                toast.open({
                    message: data.subject,
                    type: 'info',
                });
                notify.value.unshift(data);
            });
    }

    // Listeners para Jefe de Departamento
    function registerDepartmentHeadListeners() {
        echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
            .listen('UserAssigned', ({ data }) => {
                console.log('Received UserAssigned event:', data);
                toast.open({
                    message: 'Se le ha asignado un nuevo trabajo, revise las notificaciones',
                    type: 'info',
                });
                notify.value.unshift(data);
            });

        echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
            .listen('ReportWorkComplete', ({ data }) => {
                console.log('Received ReportWorkComplete event:', data);
                toast.open({
                    message: data.subject,
                    type: 'info',
                });
                notify.value.unshift(data);
            });
    }

     // Listeners para Empleado
     function registerEmployeeListeners() {
        echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
            .listen('WorkAssigned', ({ data }) => {
                console.log('Received WorkAssigned event:', data);
                toast.open({
                    message: 'Asignación de trabajo - Revise las notificaciones',
                    type: 'info',
            });
            notify.value.unshift(data);
        });
    }

    // ----------------- Función para iniciar los listeners --------------------------------------
    function startAdminListening() {
        console.log('startAdminListening initialized');
        registerAdminListeners();
    }

    function startDepartmentHeadListening() {
        console.log('startDepartmentHeadListening initialized');
        registerDepartmentHeadListeners();
    }

    function startEmployeeListening() {
        console.log('startEmployeeListening initialized');
        registerEmployeeListeners();
    }

    /*
    function handleReconnect() {
        
        echoInstance.connector.pusher.connection.bind('connected', () => {

        });

        echoInstance.connector.pusher.connection.bind('disconnected', () => {
            console.warn('Disconnected from WebSocket, attempting to reconnect...');

        });
    }


    handleReconnect();
    */
    return {
        messages,
        startAdminListening,
        startDepartmentHeadListening,
        startEmployeeListening
        
    };
});
