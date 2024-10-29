import {defineStore} from 'pinia'
import {inject, ref} from 'vue'
import {useRouter} from 'vue-router'
import { disconnectEcho } from '../config/echo'
import AuthApi from '../api/AuthApi'
import { namePathToRol } from '../helpers/utils'


export const useAuthStore = defineStore('auths', ()=> {

    const router = useRouter()
    const toast = inject('toast')    
    const userData = ref({})

    //Realiza la autenticación del usuario
    async function authUser (dataForm) {

        try {
            //Datos del formulario
            const requestData = {
                email: dataForm.email,
                password: dataForm.password
            }
            
            const {data} = await AuthApi.login(requestData) //Obtengo el valor del token
            const { token, data:dataUser} = data
            localStorage.setItem('AUTH_TOKEN', token) //Guardo el token en el storage
            const namePage = namePathToRol(dataUser.id_user);
            router.push({name: namePage})
  
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Cierre de sesión del usuario
    async function logOut () {
        try {
            
            const {data} = await AuthApi.logOut() //Llama a la API
            disconnectEcho() //Desconecto el echo
            localStorage.removeItem('AUTH_TOKEN') //Reinicia el token del storage
            userData.value = {} //Reinicio el valor del objeto
            router.push({name: 'login'})
            toast.open({
                    message: data.msg,
                    type: 'success'
            })
         
        } catch (error) {
            console.log(error)
        }
    }

    return {
        userData,
        authUser,
        logOut
        
    }

})