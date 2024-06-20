import api from "../config/axios";

export default {

    //Crea un nuevo establecimiento
    create(data){
        return api.post('v1/establishment', data)
    },
    //Obtiene todos los establecimientos
    get() {
        return api.get('v1/establishment')
    },
    //Actualiza el establecimiento
    update(data, id){
        return api.put(`v1/establishment/${id}`, data)
    },
    //Elimina un establecimiento en partícular
    delete(id){
        return api.delete(`v1/establishment/${id}`)
    }
}