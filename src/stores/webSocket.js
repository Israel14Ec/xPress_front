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

    function startListeningJob() {
        try {
            echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
                .listen('UserAssigned', ({ data }) => {
                    toast.open({
                        message: 'Se le ha asignado un nuevo trabajo, revise las notificaciones',
                        type: 'info',
                    });
                    notify.value.unshift(data); // Al comienzo del Array
                });

        } catch (error) {
            console.log(error);
        }
    }

    function startListenWorkAssigned() {
        try {
            echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
                .listen('WorkAssigned', ({ data }) => {
                    toast.open({
                        message: 'Se asigno un nuevo trabajo',
                        type: 'info',
                    });
                    notify.value.unshift(data);
                });
        } catch (error) {
            console.log(error);
        }
    }

    function startListenReportMaterial() {
        try {
            echoInstance.private(`materialReport.${userData.value.id_user}`)
                .listen('MaterialAssigned', ({ data }) => {
                    toast.open({
                        message: data.description,
                        type: 'warning',
                    });
                    notify.value.unshift(data);
                });
        } catch (error) {
            console.log(error);
        }
    }

    function startListenReportEquipment() {
        try {
            echoInstance.private(`equipmentReport.${userData.value.id_user}`)
                .listen('EquipmentAssigned', ({ data }) => {
                    toast.open({
                        message: data.description,
                        type: 'warning',
                    });
                    notify.value.unshift(data);
                });

        } catch (error) {
            console.log(error);
        }
    }

    function startlisteningMaterialUnavailable() {
        try {
            echoInstance.private(`materialUnavailable.${userData.value.id_user}`)
                .listen('MaterialUnavailable', ({ data }) => {
                    toast.open({
                        message: data.subject,
                        type: 'info',
                    });
                    notify.value.unshift(data);
                });
        } catch (error) {
            console.log(error);
        }
    }

    function startListeningEquipmentUnavailable() {
        try {
            echoInstance.private(`equipmentUnavailable.${userData.value.id_user}`)
                .listen('EquipmentUnavailable', ({ data }) => {
                    toast.open({
                        message: data.subject,
                        type: 'info',
                    });
                    notify.value.unshift(data);
                });

        } catch (error) {
            console.log(error);
        }
    }

    function startListenReportWorkComplete() {
        try {
            echoInstance.private(`userAssignedJob.${userData.value.id_user}`)
                .listen('ReportWorkComplete', ({ data }) => {
                    toast.open({
                        message: data.subject,
                        type: 'info',
                    });
                    console.log(data);
                    notify.value.unshift(data); // Al comienzo del Array
                });

        } catch (error) {
            console.log(error);
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
