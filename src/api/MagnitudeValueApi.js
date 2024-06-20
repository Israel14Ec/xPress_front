import api from "../config/axios";

export default {

    //obtiene todo
    get() {
        return api.get('v1/magnitude_value')
    },
    //Trae los datos formateados
    getFormatMagnitude() {
        return api.get('v1/formatMagnitude')
    },
    //crea un nuevo magnitude_value
    create( data ) {
        return api.post('v1/magnitude_value', data)
    },
    //Actualizar
    update(id, data) {
        return api.put(`v1/magnitude_value/${id}`, data)
    },
    //Eliminar
    delete(id) {
        return api.delete(`v1/magnitude_value/${id}`)
    }
   
}