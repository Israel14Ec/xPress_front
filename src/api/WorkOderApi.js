import api from "../config/axios";

export default {
    //Crear una orden de trabajo
    create (data) {
        return api.post('v1/workOrders', data)
    },
    //Crear orden de trabajo completa con sus tablas asociadas
    createComplete(data) {
        return api.post('v1/workOrdersComplete', data)
    },
    //Obtiene todo
    getWorkOrder () {
        return api.get('v1/workOrders')
    },
    //Obtiene por el id
    getWorkOderById (id) {
        return api.get(`v1/workOrders/${id}`)
    },
    //Obtiene la orden de trabajo por el ID con todos los datos
    getWorkOrderCompleteById (id) {
        return api.get(`v1/workOrdersData/${id}`)
    },

    //Api para obtener todos los datos de workOrder x Job, en funcion de id_department y work_order_statuses
    getWorkOrderDepartmentByStatus(id_department, id_job_status) {
        return api.get('v1/workOrdersByDepartment', {
            params: {
                id_department,
                id_job_status
            }
        })
    },

    //Obtiene todos los datos de workOrder x Job en función del id_department y id_order_statuses
    getOrderCompleteByStatus(id_department, id_order_statuses) {
        return api.get('v1/orderCompleteByStatus', {
            params: {
                id_department,
                id_order_statuses
            }
        })
    },


    //Actualiza el estado de workOrder al siguiente estado
    updateStatusWorkOrder(id_work_order, id_order_statuses) {
        return api.patch('v1/updateStatusWorkOrder', {
            id_work_order,
            id_order_statuses
        });
    },


    //Actualiza la orden
    updateWorkOrder (id, data) {
        return api.put(`v1/workOrders/${id}`, data)
    },

    //Actualiza la ordén de trabajo junto con los empleados asignados
    updateOrdersWithEmployee (idWorkOrder, data) {
        return api.patch(`v1/workOrdersUpdate/${idWorkOrder}`, data)
    },

    //Elimina la orden
    deleteWorkOrder(id) {
        return api.delete(`v1/workOrders/${id}`)
    },
    //Elimina la imagen
    deleteImgWorkOrder(data){
        return api.patch('v1/workOrders/deleteImage', data)
    },
    
    //Finaliza una orden de trabajo
    workOrderFinish(data){
        return api.patch('v1/workOrdersFinish', data)
    },

    //Edita la orden de trabajo finalizada
    editWorkOrderFinish(data) {
        return api.patch('v1/workOrdersFinish/edit', data)
    },

    //Obtiene la orden de trabajo y el job
    getWorkOrderJob(id_user, id_job_status) {
        return api.get('v1/workOrderbyUser', {
            params: {
                id_user,
                id_job_status
            }
        })
    },
    

    //TABLA INTERMEDIA --------------------

    //Obtiene los trabajos del usuario, en función del idWorkOrderStatus y el usuario
    getWorkOrderComplete(id_user, id_order_statuses) {
        return api.get('v1/asignar_trabajador', {
            params: {
                id_user,
                id_order_statuses
            }
        })
    },


    //Obtiene todos los datos de la orden de trabajo
    getWorkOrderCompleteId(id) {
        return api.get(`v1/workOrdersComplete/${id}`)
    },

    //Obtiene los datos de la orden de trabajo pasandole el idJob
    getCompleteWorkByIDJob(idJob) {
        return api.get(`v1/workOrdersCompleteByJob/${idJob}`)
    }


}