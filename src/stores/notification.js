import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import NotificationApi from '../api/NotificationApi'

export const useNotificationStore = defineStore('notifications', () => {

    const notify = ref([])
    const notifyRead = ref([])
    const load = ref()
    const loadRead = ref()
    
    const toast = inject('toast')


    //Mensajes no leidos
    async function getUnRead() {
        try {
            load.value = true
            const { data } = await NotificationApi.getUnRead();
            notify.value = data.map(notification => {
                return {
                    ...notification.data, 
                    id: notification.id 
                };
            });
        } catch (error) {
            console.error(error);
        } finally {
            load.value = false
        }
    }

    //Mensajes leidos
    async function getRead() {
        try {
            loadRead.value = true
            const { data } = await NotificationApi.getRead()
            notifyRead.value = data.map(notification => {
                return {
                    ...notification.data, 
                    id: notification.id 
                };
            });

        } catch (error) {
            console.log(error)
        } finally {
            loadRead.value = false
        }
    }

    //Marcar como mensajes leidos
    async function markAsRead(notifyData) {
        try {
            
            const { data } = await NotificationApi.markAsRead(notifyData.id)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            
            // Buscar el índice de la notificación en notifyRead
            const index = notify.value.findIndex(item => item.id === notifyData.id);
            if (index !== -1) {
                notify.value.splice(index, 1);
            }
            
            notifyRead.value.unshift(notifyData) //Agregar al vector notifyRead

            
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Eliminar una notificación
    async function deleteNotify(id) {
        try {
            const { data } = await NotificationApi.deleteNotification(id)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            //Quitar del vector ref
            const index = notifyRead.value.findIndex(item => item.id === id)
            if (index !== -1) {
                notifyRead.value.splice(index, 1);
            }

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Computed para calcular la longitud
    const countNotify = computed(()=> {
        return notify.value.length
    })

    return {
        load,
        notify,
        notifyRead,
        countNotify,
        loadRead,
        getUnRead,
        markAsRead,
        getRead,
        deleteNotify
    }
})