import { defineStore, storeToRefs } from 'pinia'
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './auth'
import useImage from '../composables/useImage'
import WorkOderApi from '../api/WorkOderApi' 
import ReportMaterialApi from '../api/ReportMaterialApi'

export const useWorkOrderStore = defineStore('workOrders', () => {

    const authStore = useAuthStore()
    const { userData } = storeToRefs(authStore)
    const { uploadImage, url, deleteImage } = useImage()

    const toast = inject('toast')
    const router = useRouter()

    const load = ref(true)
    const workOrder = ref({})
    const nameJob = ref('')
    
    const reportMaterial = ref([])
 
    const loadWorkOrderId = ref(true)
    const dataWorkOrderId = ref({})
    const nameJobWork = ref('')

    const workOrderCompleteDep = ref([]) //Ordenes de trabajo completadas, Jefe de departamento
    const workOrderIdHead = ref() //Orden de trabajo en particular by ID, jefe de departamento
    const loadOrderDep = ref(true) //Para jefe de departamento
    const loadWorkComplete = ref(false)
    const nameJobHead = ref('')//Para jefe de departamento
    const search = ref('') //para el v-data-table

    const image = ref('')
    const hourJob = ref()
    const instructions = ref()
    const assignedDate = ref()
    const endDate = ref()
    const value = ref(false) //Define si existe o no material sobrante
    const nameDocument = 'trabajosCompletados'
    const step = ref(1)
    const departmentId = ref(userData.value.id_department)

    const loadCompleteJob = ref(true)
    const jobComplete = ref({})

    //Ordenes de trabajo por el estado
    const loadWorkOrder = ref(true)
    const workOrderByStatus = ref([])

    const loadReportJob = ref(true)

    //Obtiene la orden de trabajo en función del ID
    async function getWorkOrderCompleteByID(id) {
        try {
            load.value = true
            const { data } = await WorkOderApi.getWorkOrderCompleteId(id)
            workOrder.value = data
            nameJob.value = workOrder.value.job.name_job
            
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
            router.push({name: 'WorkProgressEmployee'})
        } finally {
            load.value = false
        }
    }

    //Obtiene los datos de la orden de trabajo pasandole el idJob
    async function getCompleteWorkByIDJob(id) {
        try {
            loadCompleteJob.value = true
            const { data } = await WorkOderApi.getCompleteWorkByIDJob(id)
            jobComplete.value = data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
            router.push({name: 'AllJobAdmin'})
        } finally {
            loadCompleteJob.value = false
        }
    }

    //Obtiene el trabajo completo x ID, para jefe de departamento
    async function getWorkCompleteByIdHead(id) {
        try {
            loadWorkComplete.value = true 
            const { data } = await WorkOderApi.getWorkOrderCompleteId(id)
            workOrderIdHead.value = data
            nameJobHead.value = workOrderIdHead.value.job.name_job

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
            router.push({name: 'ReportJob'})

        } finally {
            loadWorkComplete.value = false
        }
    }

    //Obtiene el work_order con job x id_work_order
    async function getWorkOrderById(id) {
        try {
            loadWorkOrderId.value = true
            const { data } = await WorkOderApi.getWorkOderById(id)
            dataWorkOrderId.value = data
            nameJobWork.value = data.job.name_job

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
            
        } finally {
            loadWorkOrderId.value = false
        }
    }
    

    //Obtiene todos los datos de workOrder x Job, en funcion de id_department y id_job_status
    async function getOrderByStatusDep(id_job_status) {
        try {

            loadOrderDep.value = true
            const { data } = await WorkOderApi.getWorkOrderDepartmentByStatus(departmentId.value, id_job_status)
            workOrderCompleteDep.value = data
  
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        } finally {
            loadOrderDep.value = false
        }
    }

    //Obtiene la orden de trabajo en función de su ID y estado
    async function getOrderCompleteByStatus(idOrderStatus) {
        try {
            loadWorkOrder.value
            const { data } = await WorkOderApi.getOrderCompleteByStatus(departmentId.value, idOrderStatus)
            workOrderByStatus.value = data
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        } finally {
            loadWorkOrder.value = false
        }
    }

    //Retorna la ordén de trabajo
    async function returnOrderCompleteByStatus (idOrderStatus) {
        try {
            loadReportJob.value = true
            const { data } = await WorkOderApi.getOrderCompleteByStatus(departmentId.value, idOrderStatus)
            return data
        } catch (error) {
            console.log(error)
        } finally {
            loadReportJob.value = false
        }
    }

    //Actualiza el estado de la orden de trabajo
    async function updateStatusWorkOrder (idWorkOrder, idOrderStatuses) {
        try {
            const { data } = await WorkOderApi.updateStatusWorkOrder(idWorkOrder, idOrderStatuses)
            console.log(data)
            toast.open({
                message: data.msg,
                type: 'success'
            })
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    // Filtrar los elementos basado en name_job y num_caf
    const filteredWorkOrders = computed(() => {

        if (!search.value) return workOrderCompleteDep.value; // Si no hay valor de búsqueda, devuelve todos los elementos
        const searchValue = search.value.toLowerCase();
        return workOrderCompleteDep.value.filter(item => {
            const jobName = item.job.name_job.toLowerCase();
            const numCaf = item.job.num_caf ? item.job.num_caf.toLowerCase() : '';
            return jobName.includes(searchValue) || numCaf.includes(searchValue);
        });
    });

    //Filtrar elementos  Filtrar los elementos basado en name_job y num_caf para workOrderByStatus
    const filteredWorkOrdersStatus = computed(() => {

        if (!search.value) return workOrderByStatus.value; 
        const searchValue = search.value.toLowerCase();
        return workOrderByStatus.value.filter(item => {
            const jobName = item.job.name_job.toLowerCase();
            const numCaf = item.job.num_caf ? item.job.num_caf.toLowerCase() : '';
            return jobName.includes(searchValue) || numCaf.includes(searchValue);
        });
    });

    //Elimina la foto seleccionada
    async function deleteImageWorkOrder(url, id_work_order) {
        try {
            deleteImage(url) //Borra la imagen de storage
            const { data } = await WorkOderApi.deleteImgWorkOrder({ url, id_work_order }); 
            
            //Saca la url del vector ref
            const indexToRemove = dataWorkOrderId.value.after_picture.findIndex(image => image === url); 
            if (indexToRemove !== -1) {
                dataWorkOrderId.value.after_picture.splice(indexToRemove, 1);
            }
            
            toast.open({
                message: data.msg,
                type: 'success'
            })
         
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }


    //Maneja la logica para agregar o quitar del vector ref reportMaterial
    function addReportMaterial(data) {
        try {
            const index = reportMaterial.value.findIndex(material => material.id_material === data.id_material)
            if(index === -1) {
                reportMaterial.value.push(data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    function deleteReportMaterial(id) {
        try {
            const index = reportMaterial.value.findIndex(material => material.id_material === id)
            reportMaterial.value.splice(index, 1)

        } catch (error) {
            console.log(error)
        }
    }

    function editReportMaterial(data) {
        try {
            const index = reportMaterial.value.findIndex(material => material.id_material === data.id_material)
            if (index !== -1) {
                reportMaterial.value[index].quantity = data.quantity;
            }
        } catch (error) {
            console.log(error)
        }
    }


    //Guardar la orden de trabajo finalizada
    async function finishWorkOrder() {

        const idStatusFinishWork = 3
        try {

            if (!validateHourJob()) {
                return;
            }

            //Validar imagen
            if (image.value.length === 0) {
                toast.open({
                    message: 'No ingresó una imagen',
                    type: 'warning'
                });
                return; 
            }
    
            //Subir imagen a firebase
            const file = image.value[0].file
            await uploadImage(nameDocument, file)
        
            const dataForm = {
                "id_work_order": workOrder.value.id_work_order,
                "hour_job": hourJob.value,
                "after_picture": url.value,
                "id_department": userData.value.id_department
            }
            
            const { data } = await WorkOderApi.workOrderFinish(dataForm)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            
            //Actualiza el estado de la orden de trabajo
            updateStatusWorkOrder(workOrder.value.id_work_order, idStatusFinishWork)  
            step.value += step.value

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }

    //Funcion para editar los datos de orden de trabajo finalizada - Employee
    async function editfinishWorkOrder() {
        try {

            if (!validateHourJob()) {
                return;
            }

            if(image.value.length > 0) { //Hay nueva imagen
                //Subir imagen a firebase
                const file = image.value[0].file
                await uploadImage(nameDocument, file)
            } else {
                image.value = ''
            } 
 
            const dataForm = {
                "id_work_order": dataWorkOrderId.value.id_job,
                "hour_job": hourJob.value,
                "after_picture": url.value
            }
            const { data } = await WorkOderApi.editWorkOrderFinish(dataForm) //Llamada a la API
            toast.open({
                message: data.msg,
                type: 'success'
            })

            dataWorkOrderId.value.after_picture.push(url.value) //Agrego la url
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });

        }
    }

    //Edita la información de la orden de trabajo, para jefe de departamento
    async function updateWorkOrder () {
        try {

            if (!validateHourJob()) {
                return;
            }

            if(image.value.length > 0) { //Hay nueva imagen
                const file = image.value[0].file
                await uploadImage(nameDocument, file) //Subir imagen a firebase
                image.value = url.value
            } else {
                image.value = ''
            } 

            const dataForm = {
                'instructions': instructions.value,
                'assigned_date': assignedDate.value,
                'end_date': endDate.value,
                'hour_job': hourJob.value,
                'after_picture': image.value
            }
       
            const { data } = await WorkOderApi.updateWorkOrder(dataWorkOrderId.value.id_work_order, dataForm)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            router.push({name: 'ReportJob'})

        } catch (error) {
            
        }
    }


    //Funciión para validar la hora
    function validateHourJob() {
        if (!hourJob.value || hourJob.value <= 0) {
            toast.open({
                message: 'Ingrese un valor valido para las horas trabajadas',
                type: 'warning'
            });
            return false;
        }
    
        // Verificar si se ingresa un numero valido
        const parts = hourJob.value.toString().split('.');
        const minutes = parts.length > 1 ? parseInt(parts[1]) : 0;
        if (minutes > 59) {
            toast.open({
                message: 'La hora ingresada no es válida',
                type: 'warning'
            });
            return false;
        }
    
        return true;
    }
    
    async function leftoverMaterial() {
        try {

            if(value.value ) { //En el select escogio el si hay material sobrante
                
                //Existe material sobrante
                if (reportMaterial.value.length < 1) {

                    toast.open({
                        message: 'No eligio ningun material, si no existe material sobrante seleccione en no',
                        type: 'warning'
                    })

                    return 
                }

                const materialData = reportMaterial.value.map(material => ({
                    id_material_assigned: material.pivot.id_material_assigned,
                    amount_left_over: material.quantity
                }));
                
                const { data } = await ReportMaterialApi.create(materialData)
                toast.open({
                    message: data.msg,
                    type: 'success'
                })
            } 
            
            router.push({name: 'WorkProgressEmployee'})

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Funcion para manejar el v-stepper

    function nextStep() {
        if(step.value === 1){
            finishWorkOrder()
        }
        else if(step.value === 2){
            leftoverMaterial()
        }   
        
    }

    function prevStep() {
        if (step.value > 1) step.value--;
    }

    
    return {
        load,
        workOrder,
        nameJob,
        reportMaterial,
        image, 
        hourJob,
        value,
        step,
        dataWorkOrderId,
        loadWorkOrderId,
        nameJobWork,
        workOrderCompleteDep,
        loadOrderDep,
        workOrderIdHead,
        nameJobHead,
        instructions,
        assignedDate,
        endDate,
        filteredWorkOrders,
        search,
        loadWorkComplete,
        loadCompleteJob,
        jobComplete,
        loadWorkOrder,
        workOrderByStatus,
        filteredWorkOrdersStatus,
        loadReportJob,
        getOrderCompleteByStatus,
        getWorkOrderCompleteByID,
        getWorkCompleteByIdHead,
        getCompleteWorkByIDJob,
        addReportMaterial,
        getWorkOrderById,
        deleteReportMaterial,
        editReportMaterial,
        finishWorkOrder,
        editfinishWorkOrder,
        updateWorkOrder,
        leftoverMaterial,
        prevStep,
        nextStep,
        deleteImageWorkOrder,
        getOrderByStatusDep,
        updateStatusWorkOrder,
        returnOrderCompleteByStatus
    }
})