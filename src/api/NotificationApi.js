import api from "../config/axios";

export default {

    //Trae a todas las notificaciones
    get(){
        return api.get('v1/notificationAll')
    },
    //Trae a las notificaciones no leidas
    getUnRead () {
        return api.get('v1/notificationUnRead')
    },
    //Trae las notificaciones leidas
    getRead () {
        return api.get('v1/notificationRead')
    },
    //Marca como leida la notificación
    markAsRead (notificationId) {
        return api.patch(`v1/notificacion/markAsRead/${notificationId}`)
    },
    //Elimina las notificaciones
    deleteNotification(data) {
        return api.delete(`v1/notificacion/deleteNotification`, data)
    }
}