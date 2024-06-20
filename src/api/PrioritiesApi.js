import api from "../config/axios";

export default {

    //Crear
    create(data) {
        return api.post('v1/job_priorities', data)
    },
    //Obtener
    get() {
        return api.get('v1/job_priorities')
    },
    //Actualizar
    update(id, data) {
        return api.put(`v1/job_priorities/${id}`, data)
    },
    //Eliminar
    deletePrioritie(id){
        return  api.delete(`v1/job_priorities/${id}`)
    }
}