import api from '../config/axios'

export default {

    //Guardar
    create(data){
        return api.post('v1/job', data)
    },

    //Obtener por ID de estado y fecha
    getByDate(date, jobIdStatus) {
        // Construir los parámetros de consulta
        const params = new URLSearchParams();
        if (date) {
            params.append('date', date);
        }
        if (jobIdStatus) {
            params.append('id_job_status', jobIdStatus);
        }
        return api.get('v1/jobByDate', { params });
    },
    getJobByStatusOrDate(perPage, page, date, jobIdStatus) {
        const params = new URLSearchParams();

        params.append('per_page', perPage)
        params.append('page', page)

        if (date) {
            params.append('date', date);
        }
        if (jobIdStatus) {
            params.append('id_job_status', jobIdStatus);
        }

        return api.get('v1/jobByStatusOrDate', { params });
    },

    //Obtiene un trabajo segun el ID
    getById(id){
        return api.get(`v1/jobByID/${id}`)
    },
    //Obtiene los datos del trabajos con join
    getByIdJoin(id, idDepartment) {
        return api.get(`v1/jobById/join/${id}`, {
            params: {
                id_department: idDepartment
            }
        })
    },
    //Actualiza un trabajo
    updateJob(id, data) {
        return api.put(`v1/job/${id}`, data)
    },
    //Eliminado logico de trabajo
    deleteLogicJob(id) {
        return api.delete(`v1/job/${id}`)
    },
    
    //Asigna un departamento
    assignDepartment(data){
        return api.post(`v1/job/assignDepartment`, data)
    },

    //Acualiza el estado del trabajo 
    updateStatus(id, data) {
        return api.patch(`v1/job/updateStatus/${id}`, data)
    },

    //Revierte el estado del trabajo
    reverseStatusJob(id) {
        return api.patch(`v1/job/reverseStatus/${id}`)
    },

    //Actualizar el estado de trabajo tomando en cuenta el work_order_statuses
    updateStatusBasedOnWork (id) {
        return api.patch(`v1/job/updateStatusBasedOnWork/${id}`)
    },

    //Trae los datos de un trabajo x departamento x fecha
    getJobDepartmentDate(date, id_department, id_job_status) {
        return api.get(`v1/job/department_date`, {
            params: {
                date,
                id_department,
                id_job_status
            }
        });
    },
    //

}