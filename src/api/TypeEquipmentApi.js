import api from "../config/axios";

export default {
    
    //Crea un type equipment
    createTypeEquipment(data){
        return api.post('v1/typeEquipment', data)
    },
    //Obtiene todo
    getTypeEquipment(){
        return api.get('v1/typeEquipment')
    },
    //Actualiza un type equipment
    updateTypeEquipment(id, data){
        return api.put(`v1/typeEquipment/${id}`, data)
    },
    //Elimina un type equipment
    deleteTypeEquipment(id) {
        return api.delete(`v1/typeEquipment/${id}`)
    }


}