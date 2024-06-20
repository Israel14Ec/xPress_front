import api from "../config/axios";

export default {
    
    //Agrega un cliente
    create(data){
        return api.post('v1/client', data)
    },
    //Obtiene clientes no eliminados
    get(){
        return api.get('v1/client')
    }, 
    //Obtiene eliminados
    getDelete(){
        return api.get('v1/clientDelete')
    },
    //Actualiza
    update(id, data) {
        return api.put(`v1/client/${id}`, data)
    },

    //Elimina
    delete(id) {
        return api.delete(`v1/client/${id}`)
    },

    //Restaura un client eliminado
    restoreClient(id) {
        return api.patch(`v1/client_restore/${id}`)
    }
 
}