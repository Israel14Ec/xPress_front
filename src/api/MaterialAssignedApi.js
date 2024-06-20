import api from "../config/axios";

export default {


    //Crear asignación de material
    createAssignedMaterial(data){
        return api.post('v1/createAssignedMaterial', data)
    },

    //Editar la cantidad solicitada del material
    assignedMaterialEdit(data) {
        return api.patch(`v1/assignMaterialEdit`, data)
    },

    //Eliminar asignación de material
    deletedAssignedMaterial(idMaterialAssigned) {
        return api.delete(`v1/deletedAssignedMaterial/${idMaterialAssigned}`)
    },

    //Obtiene todos los pedidos de los materiales
    getUndelivered() {
        return api.get('v1/materialAssigned/undeliveredOrders')
    },

    //Obtiene los pedidos de materiales entregados
    getDelivered(perPage,  page) {
        return api.get('v1/materialAssigned/deliveredOrders', {
            params: {
                per_page: perPage,
                page
            }
        })
    },

    //Obtiene el material_assigneds, según el id
    getMaterialAssignedById(id) {
        return api.get(`v1/materialAssigned/${id}`)
    },


    //ACEPTA LOS PEDIDOS DE MATERIAL (MODIFICA EL STOCK DE MATERIAL. SU VALOR, CAMBIA EL ESTADO DE amountAccept), 
    acceptOrders(id, data) {
        return api.patch(`v1/materialAssigned/accept_orders/${id}`, data)
    }

}