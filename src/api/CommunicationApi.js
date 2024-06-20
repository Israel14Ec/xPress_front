import api from "../config/axios"

export default {

    //Guarda en la db
    create(data){
        return api.post('v1/communication_type', data) 
    },
    //Obtiene
    get() {
        return api.get('v1/communication_type')
    },
    //actualiza
    update(id, data) {
        return api.put(`v1/communication_type/${id}`, data)
    },
    //Eliminar
    delete(id) {
        return api.delete(`v1/communication_type/${id}`)
    }
}