import api from "../config/axios";

export default {

    //Obtiene todo
    get() {
        return api.get('v1/job_statuses')
    },
    //Obtiene todos los que tengan un paso
    getByStep() {
        return api.get('v1/jobByStep')
    },
    //Obtiene un estado en función del step
    getStatusByStep(step) {
        return api.get(`v1/jobByStep/${step}`)
    },
    //Agrega
    create(data){
        return api.post('v1/job_statuses', data)
    },
    //Actualizar
    update(id, data){
        return api.put(`v1/job_statuses/${id}`, data)
    },
    //Eliminar
    deleteStatusJob (id) {
        return api.delete(`v1/job_statuses/${id}`)
    }
}