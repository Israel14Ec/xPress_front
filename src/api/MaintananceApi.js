import api from "../config/axios";

export default {
    
    //Obtener
    get() {
        return api.get('v1/type_maintenance')
    },
    //Crear
    create(data) {
        return api.post('v1/type_maintenance', data)
    },
    //Actualizar
    update(id, data) {
        return api.put(`v1/type_maintenance/${id}`, data)
    },
    //Eliminar
    deleteMaintenance (id) {
        return api.delete(`v1/type_maintenance/${id}`)
    }
}