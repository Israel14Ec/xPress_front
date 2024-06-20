import api from "../config/axios";

export default {
    
    //Crea un addmaterial, aumenta el stock de Material
    createAddMaterial(data){
        return api.post('v1/materialAdd', data)
    },

    //obtiene todos los valores en la tabla add_stock
    getAll(){
        return api.get('v1/materialAdd')
    },

    //Obtiene el add_material segun el id_material
    getAddByMaterialId(id){
        return api.get(`v1/materialAdd/${id}`)
    },
    //Actualiza un nuevo material
    updateAddMaterial(id, data) {
        return api.put(`v1/materialAdd/${id}`, data)
    }
}