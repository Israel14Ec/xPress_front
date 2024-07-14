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

    function startListening() {
        console.log('startListening initialized');
        echoInstance.channel('home').listen('Hello', (e) => {
            console.log('Received message from home channel:', e);
            messages.value.push(e.welcome);
        });
    }

    function startListening2() {
        console.log('startListening2 initialized');
        echoInstance.private('private-test.' + userData.value.id_user)
            .listen('PrivateHellow', (e) => {
                console.log('Received message from private-test channel:', e);
                messages.value.push(e);
            });
    }

    function startListeningJob() {
        console.log('startListeningJob initialized');
        try {
            echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
                .listen('UserAssigned', ({ data }) => {
                    console.log('Received UserAssigned event:', data);
                    toast.open({
                        message: 'Se le ha asignado un nuevo trabajo, revise las notificaciones',
                        type: 'info',
                    });
                    notify.value.unshift(data); // Al comienzo del Array
                });

        } catch (error) {
            console.log('Error in startListeningJob:', error);
        }
    }

    function startListenWorkAssigned() {
        console.log('startListenWorkAssigned initialized');
        try {
            echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
                .listen('WorkAssigned', ({ data }) => {
                    console.log('Received WorkAssigned event:', data);
                    toast.open({
                        message: 'Se asigno un nuevo trabajo',
                        type: 'info',
                    });
                    notify.value.unshift(data);
                });
        } catch (error) {
            console.log('Error in startListenWorkAssigned:', error);
        }
    }

    function startListenReportMaterial() {
        console.log('startListenReportMaterial initialized');
        try {
            echoInstance.private(`materialReport.${userData.value.id_user}`)
                .listen('MaterialAssigned', ({ data }) => {
                    console.log('Received MaterialAssigned event:', data);
                    toast.open({
                        message: data.description,
                        type: 'warning',
                    });
                    notify.value.unshift(data);
                });
        } catch (error) {
            console.log('Error in startListenReportMaterial:', error);
        }
    }

    function startListenReportEquipment() {
        console.log('startListenReportEquipment initialized');
        try {
            echoInstance.private(`equipmentReport.${userData.value.id_user}`)
                .listen('EquipmentAssigned', ({ data }) => {
                    console.log('Received EquipmentAssigned event:', data);
                    toast.open({
                        message: data.description,
                        type: 'warning',
                    });
                    notify.value.unshift(data);
                });

        } catch (error) {
            console.log('Error in startListenReportEquipment:', error);
        }
    }

    function startlisteningMaterialUnavailable() {
        console.log('startlisteningMaterialUnavailable initialized');
        try {
            echoInstance.private(`materialUnavailable.${userData.value.id_user}`)
                .listen('MaterialUnavailable', ({ data }) => {
                    console.log('Received MaterialUnavailable event:', data);
                    toast.open({
                        message: data.subject,
                        type: 'info',
                    });
                    notify.value.unshift(data);
                });
        } catch (error) {
            console.log('Error in startlisteningMaterialUnavailable:', error);
        }
    }

    function startListeningEquipmentUnavailable() {
        console.log('startListeningEquipmentUnavailable initialized');
        try {
            echoInstance.private(`equipmentUnavailable.${userData.value.id_user}`)
                .listen('EquipmentUnavailable', ({ data }) => {
                    console.log('Received EquipmentUnavailable event:', data);
                    toast.open({
                        message: data.subject,
                        type: 'info',
                    });
                    notify.value.unshift(data);
                });

        } catch (error) {
            console.log('Error in startListeningEquipmentUnavailable:', error);
        }
    }

    function startListenReportWorkComplete() {
        console.log('startListenReportWorkComplete initialized');
        try {
            echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
                .listen('ReportWorkComplete', ({ data }) => {
                    console.log('Received ReportWorkComplete event:', data);
                    toast.open({
                        message: data.subject,
                        type: 'info',
                    });
                    console.log(data);
                    notify.value.unshift(data); // Al comienzo del Array
                });

        } catch (error) {
            console.log('Error in startListenReportWorkComplete:', error);
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
        startListeningEquipmentUnavailable,
    };
});
