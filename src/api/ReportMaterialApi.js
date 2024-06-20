import api from "../config/axios";

export default {

    //crear
    create(data) {
        return api.post('v1/reportMaterial', data)
    },
    //Obtener el reporte del material en función de eviction_completed (si esta en desalojo o no)
    getReportMaterialByEviction() {
        return api.get('v1/reportMaterialByEviction')
    },
    //Ajusta el stock del material y finaliza el desalojo
    completedReportMaterial(id) {
        return api.patch(`v1/completedReportMaterial/${id}`)
    }    

}