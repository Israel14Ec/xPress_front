import {defineStore, storeToRefs } from 'pinia'
import { ref, inject, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useJobStore } from './job'
import UserApi from '../api/UserApi'
import EquipmentApi from '../api/EquipmentApi'
import WorkOderApi from '../api/WorkOderApi'
import JobApi from '../api/JobApi'

export const useAssignedWorkerStore = defineStore('assignedWorkers', () => {

    const auth = useAuthStore()
    const { userData } = storeToRefs(auth)

    const jobStore = useJobStore()
    const { jobData } = storeToRefs(jobStore)

    const usersAvailable = ref([]) //Usuarios disponibles
    const usersNoAvailable = ref([]) //Usuarios no disponibles
    const isMaxPriority = ref(false) //Máxima prioridad
    
    const instructions = ref('') //va a guardar las instrucciones 
    const assignedDate = ref([]) //Fechas
    
    const usersSelect = ref([]) //Ref para guardar a los usuarios seleccionados
    const loading = ref()
    const load = ref()
    const loadWorkOrder = ref()
    const materialSelected = ref ([])
    
    const equipmentsType = ref([]) //Llama a la API
    const equipmentsSelect = ref([])
    
    const worksUser = ref([]) //Almacena el trabajo del usuario
    const workInProgress = ref([]) //Almacena al trabajo en progreso

    const workDataHistory = ref([]) //Almacena el Historial de trabajos

    const toast = inject('toast') 
    const router = useRouter()
    
    const step = ref(1) //Maneja el v-stepper
    
    const search = ref('') //Para el buscar
    const MAX_PRIORITY = 1 //Máximo Prioridad

    //Obtiene a los usuarios de un departamento que estan disponibles para un trabajo
    async function getWorkersAvailable() {
        try {
            loading.value = true
            const { data } = await UserApi.getUserAvailable(userData.value.id_department, assignedDate.value[0], assignedDate.value[1])
            usersAvailable.value = data

        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }

    //Obtiene a los usuarios de una departamento que no estan disponibles para el trabajo
    async function getWorkersNoAvailable () {
        try {
            const { data } = await UserApi.getUserNoAvailable(userData.value.id_department, assignedDate.value[0], assignedDate.value[1])
            usersNoAvailable.value = data

        } catch (error) {
            console.log(error)
        }
    }

    //--------- Funciones para manejar usuario --------------
    function selectUsers (data) {
        try {
            const existIndex = usersSelect.value.findIndex(user => user.id_user === data.id_user);
            // Si el usuario no existe, lo añade
            if (existIndex === -1) {
                usersSelect.value.push(data);
            }   
        } catch (error) {
            console.log(error)
        }
    }

    function selectUserDelete(id) {
        try {
            const index = usersSelect.value.findIndex(user => user.id_user === id)
            if(index !== -1){
                usersSelect.value.splice(index, 1)
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    
    //--------- Funciones para manejar material --------------
    function addMaterialSelect(data) {
        try {
            const index = materialSelected.value.findIndex(material => material.id_material === data.id_material)
            if(index === -1) {
                materialSelected.value.push(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

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

    function materialSelectDelete(id) {
        try {
            const index = materialSelected.value.findIndex(material => material.id_material === id)
            materialSelected.value.splice(index, 1)
        } catch (error) {
            console.log(error)
        }
    }


    //Funciones para manejar el equipo --------------------------------------------------

    //Obtiene de la API
    async function getEquipmentByType(id_status_equipment, id_type_equipment) {
        try {
            load.value = true
            const {data} = await EquipmentApi.getByTypeStatus(id_status_equipment, id_type_equipment)
            equipmentsType.value = data
        } catch (error) {
            console.log(error)
        } finally {
            load.value = false
        }
    }

    //Añadir al vector ref de equipmenteSelect
    function equipmentSelectAdd(data) {
        try {
            const index = equipmentsSelect.value.findIndex(equipment => equipment.id_construction_equipment === data.id_construction_equipment)
            if(index === -1) {
                equipmentsSelect.value.push(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    //Quitar del vector ref de equipmenteSelect
    function equipmentSelectDel(id) {
        try {
            const index = equipmentsSelect.value.findIndex(equipment => equipment.id_construction_equipment  === id)
            if(index !== -1) {
                equipmentsSelect.value.splice(index, 1)
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    //Manda notificación de un material que se necesita para un trabajo 
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

    //FUNCIONES PARA VALIDAR el v-stepper --------------------------------------------------------

    function validateStep () {
        
        switch (step.value) {
            case 1:
                if (instructions.value === '' || assignedDate.value.length === 0) {
                    toast.open({
                        message: 'No se agrego los datos requeridos',
                        type: 'error'
                    })
                    return false;
                } 
                return true  

            case 2:
                
                if(usersSelect.value.length === 0) {
                    toast.open({
                         message: 'No se agrego a ningun trabajador',
                        type: 'error'
                    })
                    return false
                }
        
                return true
                
            case 3:

                if(materialSelected.value.length === 0){
                    toast.open({
                        message: 'No se selecciono ningun material',
                        type: 'warning'
                    })
        
                }
    
                return true
            case 4:
                if(equipmentsSelect.value.length === 0) {
                    toast.open({
                        message: 'No se selecciono ningun equipo',
                        type: 'warning'
                    })
                }

                return true
        }
        
    }

    function nextStep() {
        if(validateStep()){
            if (step.value < 5) step.value++;
        }
    }

    function prevStep() {
        if (step.value > 1) step.value--;
    }


    //Watch para escuchar por los cambios de la fecha y traer a los usuarios
    watch(() => assignedDate.value, (newVal, oldVal) => {
            if(assignedDate.value.length > 0) {
                if (newVal !== oldVal) {
                    getWorkersAvailable();
                    usersSelect.value = []
                    
                    //El trabajo es de máxima prioridad
                    if(jobData.value.level_priority === MAX_PRIORITY) {
                        getWorkersNoAvailable()
                        isMaxPriority.value = true
                    } else {
                        isMaxPriority.value = false
                    }
                }
            }
        },
        {
            deep: true, 
            immediate: false, 
        }
    );

    //Actualizar el estado de trabajo tomando en cuenta el work_order_statuses
    async function updateStatusBasedOnWork(idJob) {
        try {
            const { data } = await JobApi.updateStatusBasedOnWork(idJob)
            console.log(data)

        } catch (error) {
            console.log(error)
        }
    }


    //---------------   CREAR ORDEN DE TRABAJO -----------------
    async function createWorkOrder(idJob) {
        try {
            loadWorkOrder.value = true
            //Formatea materialSelected
            const formattedMaterials = materialSelected.value.map(material => {
                return {
                  id_material: material.id_material.toString(),
                  amount: material.quantity.toString()
                };
            });
            
            const dataRequest = {
                id_job: idJob,
                instructions: instructions.value,
                assigned_date: assignedDate.value[0],
                end_date: assignedDate.value[1],
                id_user: usersSelect.value.map(user => user.id_user),
                materials: formattedMaterials,
                id_equipment_assigned: equipmentsSelect.value.map(equipment => equipment.id_construction_equipment)
              };
              
            const {data} = await WorkOderApi.createComplete(dataRequest)
              
            toast.open({
                message: data.msg,
                type: 'success'
            })

            updateStatusBasedOnWork(idJob) //Cambia el estado del trabajo
            router.push({name: 'HomeDepartment'})

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
            
        } finally {
            loadWorkOrder.value= false
        }
    }

    //Obtener las ordenes de trabajo del empleado (con tablas intermedias)
    async function workOrdersUser(idStatusJob) {
        try {
            load.value = true
            const { data } = await WorkOderApi.getWorkOrderComplete(userData.value.id_user, idStatusJob)
            return data
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        } finally {
            load.value = false
        }
    }

    //Obtiene las ordenes de trabajo y job en función del empleado
    async function getWorkOrderJobByUser(idStatusJob) {
        try {
            load.value = true
            const { data } = await WorkOderApi.getWorkOrderJob(userData.value.id_user, idStatusJob)
            return data
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        } finally {
            load.value = false
        }
    }

    //Filtro para workDataHistory
    const filteredworkDataHistory = computed(() => {
        if (!search.value) return workDataHistory.value;
        const searchTerm = search.value.toLowerCase();
        return workDataHistory.value.filter(item => {
          return item.job.name_job.toLowerCase().includes(searchTerm);
        });
    })

    //Quitar del vector worksUser, cuando cambia el estado del trabajo
    async function deleteWorkUser (id) {
        const index = worksUser.value.findIndex(work => work.id_work_order === id);
        if (index !== -1) {
            worksUser.value.splice(index, 1);
        }
    }

    //calcular el valor de worksUser
    const calcWorksUser = computed(() => {
        
        return worksUser.value.length
    })
    

    return {
        loading,
        usersAvailable,
        usersNoAvailable,
        isMaxPriority,
        usersSelect,
        instructions,
        materialSelected,
        equipmentsType,
        load,
        equipmentsSelect,
        assignedDate,
        step,
        loadWorkOrder,
        worksUser,
        calcWorksUser,
        workInProgress,
        workDataHistory,
        filteredworkDataHistory,
        search,
        getWorkersAvailable,
        getWorkersNoAvailable,
        selectUsers,
        selectUserDelete,
        addMaterialSelect,
        materialSelectDelete,
        materialSelectEdit,
        getEquipmentByType,
        getWorkOrderJobByUser,
        equipmentSelectAdd,
        equipmentSelectDel,
        validateStep,
        nextStep,
        prevStep,
        createWorkOrder,
        workOrdersUser,
        deleteWorkUser,
        notiEquipmentUnavailable
    }
})