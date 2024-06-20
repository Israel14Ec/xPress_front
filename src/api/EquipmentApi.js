import api from "../config/axios";

export default {
    
    //Crea un equipment
    create(data){
        return api.post('v1/equipment', data)
    },
    createEquipmentAssigned(data) {
        return api.post('v1/createEquipmentAssigned', data)
    },
    //Obtiene los equipment en funcion del type y status
    getByTypeStatus(id_status_equipment = 0, id_type_equipment = 0){
        return api.get(`v1/equipment/${id_status_equipment}/${id_type_equipment}`)
    },
    //Obtiene un equipo en funcion del id
    getbyId(id) {
        return api.get(`v1/equipmentById/${id}`)
    },
    //Editar
    update(id, data) {
        return api.put(`v1/equipment/${id}`, data)
    },
    //eliminar
    delete(id){
        return api.delete(`v1/equipment/${id}`)
    },

    //Manda notificación de un equipo que se necesita para un trabajo, pero no existe o no esta disponible
    notiEquipmentUnavailable(data) {
        return api.post('v1/equipmentNotification', data)
    }
}