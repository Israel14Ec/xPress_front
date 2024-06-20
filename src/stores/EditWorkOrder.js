import { defineStore, storeToRefs } from 'pinia'
import { ref, inject, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatterDayMonthYear } from '../helpers/utils'
import WorkOderApi from '../api/WorkOderApi'
import { useAuthStore } from './auth'
import UserApi from '../api/UserApi'
import MaterialApi from '../api/MaterialApi'
import MaterialAssignedApi from '../api/MaterialAssignedApi'
import EquipmentAssignedApi from '../api/EquipmentAssignedApi'
import Swal from 'sweetalert2'
import EquipmentApi from '../api/EquipmentApi'

export const useEditWorkOrderStore = defineStore('editWorkOrder', () => {

    const loadWorkOrder = ref(true)
    const job =ref({})
    const workers = ref([])
    const materialAssigned = ref([])
    const equipmentAssigned = ref([])
    const step = ref(1)
    const idOrder = ref()

    const router = useRouter()
    const toast = inject('toast')
    const isNewDateExist = ref(false)

     
    //Datos del stepper -------------------
    //Step 1
    const instructions = ref('')
    const dateWork = ref([])
    const newDateWork = ref([])
    const workerSelect = ref([])

    //Step 2
    const materialsAvailable = ref([])
    const loadMaterialsAvailable = ref([])
    const materialSelected = ref([])

    //Step 3
    const loadEquipment = ref(true)
    const equipmentType = ref([])
    const equipmentSelect = ref([])


    //Trabajadores disponibles
    const loadWorker = ref(true)
    const workerAvailable = ref([])

    //Datos para modal
    const from = ref('')
    const subject = ref('')
    const subjectEquipment = ref('')

    //Usuario
    const authStore = useAuthStore()
    const { userData } = storeToRefs(authStore)
    

    onMounted( () => {
        from.value = `${authStore.userData.name} ${authStore.userData.last_name}`
    })

    async function getWorkOrderCompleteById(idWorkOrder) {
        try {
            loadWorkOrder.value = true
            const { data } = await WorkOderApi.getWorkOrderCompleteById(idWorkOrder)


            job.value = data.job
            workers.value = data.workers
            materialAssigned.value = data.material_assigned
            equipmentAssigned.value = data.equipment_assigned
            instructions.value = data.instructions
            dateWork.value.push(formatterDayMonthYear(data.assigned_date))
            dateWork.value.push(formatterDayMonthYear(data.end_date))
            newDateWork.value = dateWork.value
            idOrder.value = idWorkOrder
            workerSelect.value = data.workers;
            subject.value = `Pedido de material que no esta disponible en el inventario, para el trabajo ${job.value.name_job }`
            subjectEquipment.value = `Pedido de equipo que no esta disponible en el inventario, para el trabajo ${job.value.name_job }`
            getWorkersAvailable()

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
            router.push({name: 'JobInProgressHead'})
            
        } finally {
            loadWorkOrder.value = false
        }
    }

    //Obtiene a los usuarios de un departamento que estan disponibles para un trabajo
    async function getWorkersAvailable() {
        try {
            loadWorker.value = true
            
            const { data } = await UserApi.getUserAvailableEdit(
                userData.value.id_department,
                newDateWork.value[0],
                newDateWork.value[1],
                idOrder.value
            )
            workerAvailable.value = data
            
        } catch (error) {
            console.log(error)
        } finally {
            loadWorker.value = false
        }
    }

    //Agregar empleado al vector ref
    async function addWorkSelect (workerData) {
        try {   

            const existIndex = workerSelect.value.findIndex( worker => worker.id_user === workerData.id_user )
            if( existIndex === -1){
                workerSelect.value.push(workerData)
            }
                
        } catch (error) {
            console.log(error)
        }
    }

    //ELiminar empleado seleccionado del vector ref
    async function workSelectDelete(idUser) {
        try {

            workerSelect.value = workerSelect.value.filter( worker => worker.id_user !== idUser)
        } catch (error) {
            console.log(error)
        }
    }

    //Función para actualizar la ordén de trabajo junto con los empleados asignados
    async function updateOrdersWithWorker(idWorkOrder) {
        try {

            //Validaciones ---------------------------------
            //instrucciones
            if(!instructions.value) {
                toast.open({
                    message: 'Debe añadir las instrucciones de la ordén de trabajo',
                    type: 'warning'
                })
                return
            }

            //Usuarios válidos
            if(workerSelect.value.length === 0) {
                toast.open({
                    message: 'Debe seleccionar al menos a un empleado',
                    type: 'warning'
                })
                return
            }

         
            const idUsers = workerSelect.value.map(worker => worker.id_user)
            const newData = {
                instructions: instructions.value,
                assigned_date: newDateWork.value[0],
                end_date: newDateWork.value[1],
                id_users: idUsers
            }

            const  {data}  = await WorkOderApi.updateOrdersWithEmployee(idWorkOrder, newData)
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
            });
   
        }
    }

    //Obtiene los materiales
    async function getMaterials() {
        try {
            loadMaterialsAvailable.value = true
            const { data } = await MaterialApi.get()
            materialsAvailable.value = data
        } catch (error) {
            console.log(error)
        } finally {
            loadMaterialsAvailable.value = false
        }
    }

    //Crea los campos de material_assigned
    async function createAssignedMaterial(idWorkOrder) {
        try {

            if( materialSelected.value.length === 0) {
                toast.open({
                    message: 'Seleccione al menos un material para realizar la solicitud.',
                    type: 'warning'
                })
                return
            }

           
            const formattedMaterials = materialSelected.value.map(material => {
                return {
                    id_material: material.id_material,
                    amount: material.quantity
                }
            })

            const dataToSend = {
                materials: formattedMaterials,
                id_work_order: idWorkOrder
            }

             //Llamado a la API
            const { data } = await MaterialAssignedApi.createAssignedMaterial(dataToSend)
            toast.open({
                message: data.msg,
                type: 'success'
            })

            //Sobrescribo con los datos de la api
            materialAssigned.value = data.data
            materialSelected.value = []

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Llamada a la api para eliminar el material asignado
    async function deletedAssignedMaterial(id) {
        try {
            
            const { data } = await MaterialAssignedApi.deletedAssignedMaterial(id)

            toast.open({
                message: data.msg,
                type: 'success'
            })

            //Quita del vector ref materialAssigned
            materialAssigned.value = materialAssigned.value.filter(material => material.pivot.id_material_assigned !== id)
            
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Llamada a la API para editar la cantidad solicitada
    async function assignedMaterialEdit(dataUpdate) {
        try {
            const { data } = await MaterialAssignedApi.assignedMaterialEdit(dataUpdate)

            toast.open({
                message: data.msg,
                type: 'success'
            })

            //Actualizar el vector ref el amount
            const index = materialAssigned.value.findIndex(material => material.pivot.id_material_assigned == dataUpdate.id_material_assigned)
            if( index !== -1) {
                materialAssigned.value[index].pivot.amount = data.data.amount
            }
                
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Manda notificación de un material que se necesita para un trabajo 
    async function notiMaterialUnavailable(item) {
        try {
            
            const { data } = await MaterialApi.notiMaterialUnavailable(item)
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

    //Manda notificación de un equipo
    async function notiEquipmentUnavailable(item) {
        try {           
            const { data } = await EquipmentApi.notiEquipmentUnavailable(item)
            toast.open({
                message: data.msg,
                type:'success'
            })
        
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Funciones para material select --------------------------------
    function addMaterialSelected (dataMaterial) {
        const index = materialSelected.value.findIndex(material => material.id_material === dataMaterial.id_material)
        if(index === -1) {
            materialSelected.value.push(dataMaterial)
        }
    }

    //Editar material del vector
    function materialSelectEdit(data) {
        try {
    
            const index = materialSelected.value.findIndex(material => material.id_material === data.id_material)
            if (index !== -1) {
                materialSelected.value[index].quantity = data.quantity;
            }

        } catch (error) {
            console.log(error)
        }   
    }

    //Eliminar material del vector
    function materialSelectDelete (id) {
        materialSelected.value = materialSelected.value.filter( material => material.id_material !== id )
    }

    // Funciones para equipos ---------------------------------------------------------------------------

    async function createAssignEquipment(idWorkOrder) {
        try {

            if(equipmentSelect.value.length === 0) {
                toast.open({
                     message: 'Seleccione al menos un equipo para realizar la solicitud.',
                    type: 'warning'
                })
                return 
            }

            const formattedEquipment = equipmentSelect.value.map(equipment => equipment.id_construction_equipment)
            
            const dataToSend = {
                id_work_order: idWorkOrder,
                id_equipments: formattedEquipment
            }

            const { data } = await EquipmentApi.createEquipmentAssigned(dataToSend)

            toast.open({
                message: data.msg,
                type: 'success'
            })
        
            //Saco del vector ref de equipos
            equipmentType.value = equipmentType.value.filter(equipment =>
                !formattedEquipment.includes(equipment.id_construction_equipment)
            );

            
            //Agrego al vector ref de equipos asignados
            equipmentAssigned.value = data.data 

            //Limpio el vector ref
            equipmentSelect.value = []

        } catch (error) {
            console.log(error)
        }
    }

    //Trae los equipos disponibles
    async function getEquipmentByType(id_status_equipment, id_type_equipment){
        try {
            loadEquipment.value = true
            const { data } = await EquipmentApi.getByTypeStatus(id_status_equipment, id_type_equipment)
            equipmentType.value = data
        } catch (error) {
            
        } finally {
            loadEquipment.value = false
        }
    }

    //Eliminar equipo asignado
    function equipmentAssignedDelete(equipment){
        try {
            Swal.fire({
                title: 'Eliminar pedido de equipo',
                html: `Esta seguro de eliminar el pedido del equipo: <b>${equipment.name_equipment}</b>?`,
                icon: 'info',
                showDenyButton: true,
                confirmButtonText: 'Aceptar',
                denyButtonText: 'Cancelar',
            }).then(async (result) => {
                if(result.isConfirmed){

                    const { data } = await EquipmentAssignedApi.equipmentAssignedDelete(equipment.pivot.id_equipment_assigned )
                    
                    toast.open({
                        message: data.msg,
                        type: 'success'
                    })
                    //sacar del vector ref
                    equipmentAssigned.value = equipmentAssigned.value.filter( item => item.pivot.id_equipment_assigned !== equipment.pivot.id_equipment_assigned)
                            
                        }
                    })

        } catch (error) {
            console.log(error)
            toast.open({
                
            })
        }
    }

    //Agregar al vector ref 
    function addEquipmentSelect (data) {
        const index = equipmentSelect.value.findIndex(equipment => equipment.id_construction_equipment === data.id_construction_equipment)
        if(index === -1){
            equipmentSelect.value.push(data)
        }
    }

    //Quitar del vector ref 
    function deleteEquipmentSelect(idConstructionEquipment) {

        equipmentSelect.value = equipmentSelect.value.filter(equipment => equipment.id_construction_equipment !== idConstructionEquipment)
    }


    //Controles para el v-stepper
    function nextStep () {
        if(step.value < 3) step.value++
    }

    function prevStep () {
        if(step.value > 1) step.value--
    }


    //watch para escuchar los cambios en la fecha:
    watch(newDateWork, (newValue, oldValue) => {
        
        if(newValue.length !== 0) {
           
            if ( !newDateWork.value.every((val, index) => val === dateWork.value[index])) {
                getWorkersAvailable();
                isNewDateExist.value = true;
            } else {
                isNewDateExist.value = false
            }

        } else {
            isNewDateExist.value = false
        }
 
      }, { deep: true, immediate: false });

    return {
        loadWorkOrder,
        job,
        workers,
        materialAssigned,
        equipmentAssigned,
        step,
        instructions,
        dateWork,
        newDateWork,
        loadWorker,
        workerAvailable,
        isNewDateExist,
        workerSelect,
        materialsAvailable,
        loadMaterialsAvailable,
        materialSelected,
        from,
        subject,
        loadEquipment,
        equipmentType,
        equipmentSelect,
        subjectEquipment,
        getWorkOrderCompleteById,
        getWorkersAvailable,
        addWorkSelect,
        workSelectDelete,
        updateOrdersWithWorker,
        getMaterials,
        nextStep,
        prevStep,
        addMaterialSelected,
        materialSelectEdit,
        materialSelectDelete,
        deletedAssignedMaterial,
        assignedMaterialEdit,
        createAssignedMaterial,
        notiMaterialUnavailable,
        equipmentAssignedDelete,
        getEquipmentByType,
        addEquipmentSelect,
        deleteEquipmentSelect,
        createAssignEquipment,
        notiEquipmentUnavailable
    }
})