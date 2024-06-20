import { defineStore, storeToRefs } from "pinia";
import { ref, inject} from 'vue'
import { useRouter } from 'vue-router'
import UserApi from "../api/UserApi";
import {useAuthStore} from './auth'

export const useUserStore = defineStore('user', () => {
    
    const userAuth = useAuthStore()
    const users = ref([])
    const usersRol = ref([])
    const usersInvalid = ref([])
    const usersNoRolDep = ref([])

    const { userData } = storeToRefs(userAuth)
    const loading = ref()
    const toast = inject('toast')

    const emailForgot = ref('') //email para recuperar contraseña
    const loadSendEmail = ref(false)

    const router = useRouter()
    
    //Funciones para cargar a los usuarios que no tienen rol
    async function loadUserNoRol () {
        try {
            loading.value = true
            const {data} = await UserApi.getUserNoRol() //Carga a los usuarios sin rol
            users.value = data          
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }

    //Usuarios que no tienen rol en función del departamento
    async function getUserDepartmentNoRol() {
        try {
            loading.value = true
            const id_department = userData.value.id_department
            const { data } = await UserApi.getUserDepartmentNoRol(id_department)
            usersNoRolDep.value = data
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }

    async function loadUserRol () {
        try {
            loading.value = true
            const {data} = await UserApi.getUserRol(userAuth.userData.id_user,0,0) //Cargamos con los id en 0, para traer a todos los usuarios
            usersRol.value = data
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }

    async function loadInvalidUser () {
        try {
            loading.value = true
            const {data} = await UserApi.getInvalidUser()
            usersInvalid.value = data
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }

    //Busqueda de usuario segun departamento y rol
    async function allUser (department,rol) {
        try {
            loading.value = true
            const {data} = await UserApi.getUserRol(userAuth.userData.id_user, department, rol)
            usersRol.value = data
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }


    //Recarga a los usuarios 
    async function loadUsers() {
        try {
            const {data} = await UserApi.getUserNoRol()
            const {data: dataUser} = await UserApi.getUserRol(userAuth.userData.id_user,0,0)
            const {data: invalidUser} = await UserApi.getInvalidUser()
            users.value = data
            usersRol.value = dataUser        
            usersInvalid.value = invalidUser 
        } catch (error) {
            console.log(error)
        }
    }

    //Actualiza el rol de los usuarios
    async function updateUserRol (userValue) {
        try {
            const {data} = await UserApi.updateUserRol(userValue.id_user, userValue) //llamo a la API
            loadUsers() //Actualizo los datos
            toast.open({
                message: data.msg,
                type: 'success'
            })
        } catch (error) {
            console.log(error)
        }
    }

    //Agrega a un usuario administrador--------
    async function addUserAdmin(dataAdmin) {
        try {
            const { data } = await UserApi.createAdmin(dataAdmin)
            toast.open({
                message: data.msg,
                type: 'success'
            })
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Actualiza el rol -- Para el Jefe de departamento
    async function updateRolHead ({id_user, ...value}) {
        try {
            const { data } = await UserApi.updateUserRol(id_user, value)

            const index = usersNoRolDep.value.findIndex(u => u.id_user === id_user); 
            usersNoRolDep.value.splice(index, 1); //Quitar del vector ref
            toast.open({
                message: data.msg,
                type: 'success'
            })

            

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }

    //Obtiene al usuario con acceso removido por departamento
    async function getRemoveAccessDepartment(id) {
        try {
            const { data } = await UserApi.getRemoveuserDepartment(id)
            usersInvalid.value = data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }

    //Restaura a un usuario - Para jefe de departamento 
    async function restoreUserDep (user) {
        try {

            await UserApi.updateUserRol(user.id_user, user)
            const index = usersInvalid.value.findIndex(u => u.id_user === user.id_user); 
            usersInvalid.value.splice(index, 1); //Quitar del vector ref de usersInvalid
            toast.open({
                message: "Se restauro al usuario",
                type: 'success'
            })
            //Agrega el vector ref de usersRol
            usersRol.value.push(user) 

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }



    //Restaurar usuario
    async function restoreUser (user) {
        try {
            await UserApi.updateUserRol(user.id_user, user)
            loadUsers()
            toast.open({
                message: "Se restauro al usuario",
                type: 'success'
            })
        } catch (error) {
            console.log(error)
        }

    }

    //Eliminado logico para - Head Department
    async function deleteUserDep(id) {
        try {
            const { data } = await UserApi.deleteUser(id)
            const index = usersNoRolDep.value.findIndex(u => u.id_user === id); 
            usersNoRolDep.value.splice(index, 1); //Quitar del vector ref
            toast.open({
                message: data.msg,
                type: 'success'
            })
        } catch (error) {
            console.log(error)

        }
    }

    //Elimina a un usuario
    async function deleteUser (id){
        try {
            const {data} = await UserApi.deleteUser(id)
            loadUsers() //Actualizo los datos
            toast.open({
                message: data.msg,
                type: 'success'
            })
        } catch (error) {
            console.log(error)
        }
    }

    //Eliminado logico de un usuario
    async function deleteLogicUser (id) {
        try {
            const {data} = await UserApi.deleteLogicUser(id)
            loadUsers() //Actualizo los datos
            toast.open({
                message: data.msg,
                type:'success'
            })

        } catch (error) {
            console.log(error)
        }
    }

    //Eliminado logico para Jefe de departamento
    async function deleteLogicDep(user) {
        try {
            const {data} = await UserApi.deleteLogicUser(user.id_user)
    
            const index = usersRol.value.findIndex(u => u.id_user === user.id_user); 
            usersRol.value.splice(index, 1); //Quitar del vector ref de usersInvalid
            toast.open({
                message: data.msg,
                type:'success'
            })
        
            //Agrega el vector ref de usersRol
            usersInvalid.value.push(user) 
            
        } catch (error) {
            console.log(error)
        }
    }


    //-------------Recuperar contraseña  -------------------

    //Enviar email
    async function recoverPassword() {
        try {
            loadSendEmail.value = true
            const { data } = await UserApi.forgotPassword({'email': emailForgot.value})
            toast.open({
                message: data.msg,
                type: 'success'
            })
            emailForgot.value = ''

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        } finally {
            loadSendEmail.value = false
        }
    }

    //Validar que es un token valido
    async function validateTokenPass(token) {
        try {
            const  {data}  = await UserApi.validatePassToken(token)
            console.log(data)
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
            setTimeout(() => {
                router.push({name: 'login'})
            }, 1000);
            
        }
    }

    //Establecer nueva contraseña
    async function resetPassword (token, password) {
        try {
            const { data } = await UserApi.updatePassword({token, password})
            console.log(data)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            router.push({name: 'login'})
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    return {
        users,
        usersRol,
        usersInvalid,
        loading,
        usersNoRolDep,
        emailForgot,
        loadSendEmail,
        loadUserRol,
        loadUserNoRol,
        loadInvalidUser,
        allUser,
        getUserDepartmentNoRol,
        addUserAdmin,
        updateUserRol,
        restoreUser,
        restoreUserDep,
        deleteUser,
        deleteLogicUser,
        updateRolHead,
        deleteUserDep,
        deleteLogicDep,
        getRemoveAccessDepartment,
        recoverPassword,
        validateTokenPass,
        resetPassword
    }
})