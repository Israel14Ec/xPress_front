import api from "../config/axios";

export default {

    //Crea en la db
    create(data) {
        return api.post('v1/statusEquipment', data)
    },
    //Obtiene todo
    get(){
        return api.get('v1/statusEquipment')
    },
    //Editar
    update(id, data){
        return api.put(`v1/statusEquipment/${id}`, data)
    },
    //Eliminar
    delete(id){
        return api.delete(`v1/statusEquipment/${id}`)
    }   
}