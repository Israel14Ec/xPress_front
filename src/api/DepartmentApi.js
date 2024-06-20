import api from '../config/axios'

export default {

    //Obtiene todas las consultas
    get(){
        return api.get('v1/department')
    },
    //Crea nuevos departamento
    createDepartment (data) {
        return api.post('v1/department', data)
    },
    //Obtiene los departamentos y cantidad de usuarios
    getDepartmentUsers(){
        return api.get('v1/department/departmentusers')
    },
    //Obtiene un departamento y cantidad de usuarios menos el departamento de administración
    getDepartment() {
        return api.get('v1/departments/departmentusers/noAdmin')
    },

    //Get By Id
    getDepById(id) {
        return api.get(`v1/departmentsById/${id}`)
    },
    updateDepartment (id, data) {
        return api.put(`v1/department/${id}`, data)
    },
    //Elimina a los departamentos
    deleteDepartment(id){
        return api.delete(`v1/department/${id}`)
    }
}