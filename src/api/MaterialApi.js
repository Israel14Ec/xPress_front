import api from "../config/axios";

export default {

    //Crea un nuevo material
    create(data) {
        return api.post('v1/material', data)
    },
    //Lista los materiales
    get(){
        return api.get('v1/material')
    },
    //Buscar por el id
    getById(id){
        return api.get(`v1/materialById/${id}`)
    },
    //Actualiza
    update(id, data){
        return api.put(`v1/materialById/${id}`, data)
    },
    //Elimina un material
    delete(id) {
        return api.delete(`v1/material/${id}`)
    },

    //Manda notificación de un material que se necesita para un trabajo 
    notiMaterialUnavailable(data) {
        return api.post('v1/materialNotification', data)
    }

}