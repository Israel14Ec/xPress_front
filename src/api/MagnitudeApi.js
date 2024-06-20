import api from "../config/axios";

export default {

    //Obtiene un nuevo material
    get(){
        return api.get('v1/magnitude')
    },
     //Crea uno nuevo
    create(data) {
        return api.post('v1/magnitude', data)
    },
    //editar
    update(id, data){
        return api.put(`v1/magnitude/${id}`, data)
    },
    //Eliminar
    delete(id) {
        return api.delete(`v1/magnitude/${id}`)
    }
}