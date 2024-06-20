import api from "../config/axios";

export default {

    //Obtener orden de trabajo, junto con demas tablas intermedias
    getAssign (user_id) {
        return api.get('v1/asignar_trabajador', {
            params: {
                user_id
            }
            
        })
    },

    //Eliminar la asociacion de la tabla intermedia
    deletWorkOrderUser (userId, workOrderId) {
        return api.delete(`v1/asignar_trabajador/${userId}/${workOrderId}`)
    }
}