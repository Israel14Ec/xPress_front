import { defineStore } from 'pinia'
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEquipmentStore } from './equipment'
import EquipmentAssignedApi from '../api/EquipmentAssignedApi'

export const useEquipmentAssigned = defineStore('equipmentAssigneds', () => {

    const toast = inject('toast')
    const loadUndeliveredEquipment = ref(true)
    const undeliveredEquipments = ref([])

    const undeliveredEquipmentId = ref({})
    const loadEquipmentId = ref(true)

    const router = useRouter()

    //Instancia de equipments para modificar el vector ref
    const equipmentStore = useEquipmentStore()

    //Tabla paginada
    const loading = ref(true)
    const currentPage = ref(1); // Página actual
    const itemsPerPage = ref([5, 10, 15, -1])
    const selectedItemsPerPage = ref(5) //item seleccionado
    const dataEquipmentOrders = ref([])
    const total = ref(0)

    //Datos para los equipos en desalojo
    const equipmentEvictionData = ref([])
    const loadEquipmentEviction = ref(true)
   

    async function getUndeliveredEquipment() {
        try {

            loadUndeliveredEquipment.value = true
            const { data } = await EquipmentAssignedApi.undeliveredOrdersEquipment()
            undeliveredEquipments.value = data

        } catch (error) {
            console.log(error)
        } finally {
            loadUndeliveredEquipment.value = false
        }
    }

    //Trae un pedido por el id
    async function getEquipmentAssignedById(id) {
        try {
            loadEquipmentId.value = true
            const { data } = await EquipmentAssignedApi.getEquipmentAssignedbyId(id)
            undeliveredEquipmentId.value = data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
            router.push({name: 'ordersAdmin'})

        } finally {
            loadEquipmentId.value = false
        }
    }

    //ACEPTA LOS PEDIDOS DE EQUIPOS
    async function acceptOrderEquipment(id) {
        try {
            
            const { data } = await EquipmentAssignedApi.acceptOrder(id)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            router.push({name: 'ordersAdmin'})

            //Quitar del vector ref
            undeliveredEquipments.value = undeliveredEquipments.value.filter(item => parseInt(item.id_equipment_assigned) !== parseInt(data.data.id_equipment_assigned))

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
            
        }
    }

    //TRAE LOS PEDIDOS DE EQUIPOS (HISTORIAL)
    async function getEquipmentDelivered() {
        try {
            loading.value = true
            const { data } = await EquipmentAssignedApi.deliveredOrdersEquipment(selectedItemsPerPage.value, currentPage.value)
            dataEquipmentOrders.value = data.data
            total.value = data.total

        } catch (error) {
            console.log(error)
        } finally { loading.value = false}
    } 

    //Calcula el total de equipos
    const totalOrders = computed(() => {
        return undeliveredEquipments.value.length
    })

    //función para cambiar la pagina actual de la tabla
    function handlePaginationUpdate (options) {
        currentPage.value = options.page;
        getEquipmentDelivered()
    }

    //Obtiene los equipos para hacer el desalojo
    async function equipmentEviction() {
        try {
            loadEquipmentEviction.value = true
            const { data } = await EquipmentAssignedApi.getEquipmentEviction()
            equipmentEvictionData.value = data


        } catch (error) {
            console.log(error)
        } finally { loadEquipmentEviction.value = false}
    }

    //Marca como desalojado a un equipo por el id
    async function completedEvictionEquipment(idEquipmentAssigned) {
        try {
            const { data } = await EquipmentAssignedApi.completedEvictionEquipment(idEquipmentAssigned)

            const idEquipment = data.data.id_construction_equipment
 

            //Quita del vector ref
            equipmentEvictionData.value =  equipmentEvictionData.value.filter(equipmentEviction => equipmentEviction.id_equipment_assigned !== idEquipmentAssigned)

            //Actualiza el vector materials
            const index = equipmentStore.equipments.findIndex(equipment => equipment.id_construction_equipment === idEquipment )

            if( index !== -1) {
                equipmentStore.equipments[index] = data.data
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

    
    return {
        loadUndeliveredEquipment,
        undeliveredEquipments,
        undeliveredEquipmentId,
        loadEquipmentId,
        totalOrders,
        dataEquipmentOrders,
        total,
        itemsPerPage,
        selectedItemsPerPage,
        loading,
        loadEquipmentEviction,
        equipmentEvictionData,
        getUndeliveredEquipment,
        getEquipmentAssignedById,
        acceptOrderEquipment,
        getEquipmentDelivered,
        handlePaginationUpdate,
        equipmentEviction,
        completedEvictionEquipment
    }
})