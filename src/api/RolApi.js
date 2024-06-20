import api from '../config/axios'

export default {

    //Obtiene todos los roles validos
    get(){
        return api.get('/v1/rol')
    },
    //Obtiene el rol por el id
    getRolById(id){
        return api.get(`/v1/rol/getById/${id}`)
    }
}