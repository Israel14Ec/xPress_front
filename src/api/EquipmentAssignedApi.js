import api from "../config/axios";

export default {

    //Crea un equipo asignado
    createEquipmentAssigned(data) {
        return api.post('v1/createEquipmentAssigned', data)
    },
    equipmentAssignedDelete(id) {
        return api.delete(`v1/equipmentAssignedDelete/${id}`)
    },
    //Trae a los materiales pedidos
    undeliveredOrdersEquipment(){
        return api.get('v1/quipmentAssigned/undeliveredOrders')
    },

    //Trae a los equipos entregados
    deliveredOrdersEquipment(perPage, page) {
        return api.get('v1/quipmentAssigned/deliveredOrders', {
            params: {
                per_page: perPage,
                page
            }
        })
    },

    //Obtiene el equipment_assigneds, segun el id
    getEquipmentAssignedbyId(id) {
        return api.get(`v1/quipmentAssigned/${id}`)
    },

    //ACEPTA LOS PEDIDOS DE EQUIPO (Cambia el estado de is_delivered a true)
    acceptOrder(id){
        return api.patch(`v1/quipmentAssigned/${id}`)
    },
    //Obtiene los equipos para hacer el desalojo
    getEquipmentEviction() {
        return api.get('v1/equipmentEviction')
    },
    //Marca como desalojado a un equipo por el id
    completedEvictionEquipment(idEquipmentAssigned) {
        return api.patch(`v1/completedEvictionEquipment/${idEquipmentAssigned}`)
    }

}