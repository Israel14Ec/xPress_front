import api from '../config/axios'

export default {

    //Crea un nuevo usuario
    create(data) {
        return api.post('v1/user', data)
    },
    //Crea a un administrador
    createAdmin(data){
        return api.post('v1/user/createAdmin', data)
    },
    //Muestra los usuarios que no tienen rol
    getUserNoRol() {
        return api.get('v1/user/userNoRole')
    },
    //Usuarios que no tienen rol para un departamento
    getUserDepartmentNoRol(departmentId) {
        return api.get(`v1/user/userNoRol/department?id_department=${departmentId}`);
    },
    //Muestra los usuario segun departamento y rol
    getUserRol(id_user,id_department, id_rol) {
        return api.get(`v1/user/userRol/${id_user}/${id_department}/${id_rol}`)
    },
    //Muestra a los usuarios invalidos (Removidos el acceso)
    getInvalidUser(){
        return api.get('v1/user/invalidUser')
    },
    //Muestra a los usuarios removidos el acceso x department
    getRemoveuserDepartment(departmentId) {
        return api.get(`v1/user/invaliduser/department?id_department=${departmentId}`);
    },
    //Obtiene a los trabajadores x Departamento disponibles
    getUserAvailable(id, assigned_date, end_date) {
        return api.get('v1/user/userAvailable', {
            params: {
                id_department: id,
                assigned_date,
                end_date
            }
        });
    },

    //Obtiene a los usuarios empleados del departamento que están disponibles en las fechas incluyendo a los que ya se les asigno el trabajo en las mismas fechas
    getUserAvailableEdit(id_department, assigned_date, end_date, id_work_order ) {
        return api.get('v1/user/getUserAvailableEdit', {
            params: {
                id_department,
                assigned_date,
                end_date,
                id_work_order
            }
        })
    },

    //Obtiene a los trabajadores x Departamento que no estan disponibles ese día
    getUserNoAvailable (id, assigned_date, end_date){
        return api.get('v1/user/userNoAvailable', {
            params: {
                id_department: id,
                assigned_date,
                end_date
            }
        })
    },
    
    //Actualizar rol de usuario
    updateUserRol(id, data){ 
        return api.patch(`v1/user/updateUserRole/${id}`, data)
    },

    //Actualizar el perfil del usuario
    updateUserProfile(id, data) {
        return api.patch(`v1/user/updateUserProfile/${id}`, data)
    },

    //Elimina la imagen del usuario
    deleteProfileImage(id) {
        return api.patch(`v1/user/deleteProfileImage/${id}`)
    },

    //Eliminado logico de un usuario
    deleteLogicUser(id){
        return api.patch(`v1/user/deleteLogicUser/${id}`)
    },
    //Eliminar un usuario
    deleteUser(id){
        return api.delete(`v1/user/deleteUser/${id}`)
    },

    //------------RECUPERAR CONTRASEÑA ----------------
    //enviar email
    forgotPassword (email) {
        return api.post('v1/user/forgotPassword', email)
    },
    //validar el token de recuperación
    validatePassToken (token) {
        return api.get('v1/user/validatePassToken', {
            params: {
                token
            }
        })
    },
    //Establecer nueva contraseña
    updatePassword (data) {
        return api.post('v1/user/updatePassword', data)
    }
}