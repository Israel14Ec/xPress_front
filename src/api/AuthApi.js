import api from "../config/axios"

export default {

    //Autentificar usuario
    login(data){
        return api.post('/v1/user/login', data)
    },

    //Obtener perfil del usuario autenticado
    userProfile(){
        return api.get('/v1/user/userProfile')
    },

    //Cerrar sesión
    logOut(){
        return api.post('/v1/user/logout')
    }
}