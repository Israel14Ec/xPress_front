import api from "../config/axios";

export default {

    //Cantidad de trabajos x estado
    countJobByStatus() {
        return api.get('v1/report/countJobByStatus')
    },

    //Cantidad de trabajos x establecimientos
    countJobByEstablishment(){
        return api.get('v1/report/countJobByEstablishment')
    },

    //Cantidad de trabajos completados
    countJob() {
        return api.get('v1/report/countJob')
    },
    //Valor del inventario - material
    totalMaterialValue() {
        return api.get('v1/report/totalmaterialValue')
    },

    //valor del inventario - equipment
    totalEquipmentValue() {
        return api.get('v1/report/totalEquipmentValue')
    }

}
