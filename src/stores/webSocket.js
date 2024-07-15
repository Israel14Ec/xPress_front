import { defineStore, storeToRefs } from 'pinia';
import { ref, inject } from 'vue';
import { useAuthStore } from './auth';
import { useNotificationStore } from './notification';
import echoInstance from '../config/echo'; // Asegúrate de que la ruta sea correcta

export const useWebSocketStore = defineStore('websockets', () => {
    const toast = inject('toast');
    const messages = ref([]);
    const authStore = useAuthStore();
    const notification = useNotificationStore();
    const { userData } = storeToRefs(authStore);
    const { notify } = storeToRefs(notification);

    function registerListeners() {
        echoInstance.channel('home').listen('Hello', (e) => {
            console.log('Received message from home channel:', e);
            messages.value.push(e.welcome);
        });

        echoInstance.private('private-test.' + userData.value.id_user)
            .listen('PrivateHellow', (e) => {
                console.log('Received message from private-test channel:', e);
                messages.value.push(e);
            });

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
            .listen('WorkAssigned', ({ data }) => {
                console.log('Received WorkAssigned event:', data);
                toast.open({
                    message: 'Se asigno un nuevo trabajo',
                    type: 'info',
                });
                notify.value.unshift(data);
            });

        echoInstance.private(`materialReport.${userData.value.id_user}`)
            .listen('MaterialAssigned', ({ data }) => {
                console.log('Received MaterialAssigned event:', data);
                toast.open({
                    message: data.description,
                    type: 'warning',
                });
                notify.value.unshift(data);
            });

        echoInstance.private(`equipmentReport.${userData.value.id_user}`)
            .listen('EquipmentAssigned', ({ data }) => {
                console.log('Received EquipmentAssigned event:', data);
                toast.open({
                    message: data.description,
                    type: 'warning',
                });
                notify.value.unshift(data);
            });

        echoInstance.private(`materialUnavailable.${userData.value.id_user}`)
            .listen('MaterialUnavailable', ({ data }) => {
                console.log('Received MaterialUnavailable event:', data);
                toast.open({
                    message: data.subject,
                    type: 'info',
                });
                notify.value.unshift(data);
            });

        echoInstance.private(`equipmentUnavailable.${userData.value.id_user}`)
            .listen('EquipmentUnavailable', ({ data }) => {
                console.log('Received EquipmentUnavailable event:', data);
                toast.open({
                    message: data.subject,
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

    function startListening() {
        console.log('startListening initialized');
        registerListeners();
    }

    function handleReconnect() {
        echoInstance.connector.pusher.connection.bind('connected', () => {
            console.log('Reconnected to WebSocket');
            registerListeners();
        });

        echoInstance.connector.pusher.connection.bind('disconnected', () => {
            console.warn('Disconnected from WebSocket, attempting to reconnect...');
            setTimeout(() => {
                echoInstance.connector.pusher.connect();
            }, 3000);
        });
    }

    handleReconnect();

    return {
        messages,
        startListening,
        startListening2: startListening,
        startListeningJob: startListening,
        startListenWorkAssigned: startListening,
        startListenReportMaterial: startListening,
        startListenReportWorkComplete: startListening,
        startListenReportEquipment: startListening,
        startlisteningMaterialUnavailable: startListening,
        startListeningEquipmentUnavailable: startListening,
    };
});
