import { defineStore, storeToRefs } from 'pinia'
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import MaterialAssignedApi from '../api/MaterialAssignedApi'
import { useMaterialStore } from './material'

export const useMaterialAssignedStore = defineStore('materialAssigneds', () => {

    const materialStore = useMaterialStore()
    const { materials } = storeToRefs(materialStore)
    const toast = inject('toast')
    const router = useRouter()

    const undeliveredMaterials = ref([]) //materiales no entregados
    const loadundeliveredMaterials = ref(true) //materiales carga
    
    const undeliveredMaterialId = ref({})
    const loadMaterialId = ref(true)

    const deliveredAmount = ref()

    //Para la tabla paginada
    const currentPage = ref(1); // Página actual
    const dataMaterialOrders = ref([]) 
    const total = ref(0)
    const loading = ref(true)
    const itemsPerPage = ref([5, 10, 15, -1])
    const selectedItemsPerPage = ref(5) //item seleccionado
    const search = ref('')

    async function getUndeliveredMaterials() {
        try {
            loadundeliveredMaterials.value = true
            const { data } = await MaterialAssignedApi.getUndelivered()
            undeliveredMaterials.value = data
    
        } catch (error) {
            console.log(error)
        } finally {
            loadundeliveredMaterials.value = false
        }
    }

    //Trae a un material_assigneds, segun el id
    async function getMaterialAssignedById(id) {
        try {
            loadMaterialId.value = true
            const { data } = await MaterialAssignedApi.getMaterialAssignedById(id)
            undeliveredMaterialId.value = data
            deliveredAmount.value = undeliveredMaterialId.value.amount

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
            router.push({name: 'ordersAdmin'})

        } finally { loadMaterialId.value = false }
    }
    
    //ACEPTA LOS PEDIDOS DE MATERIAL
    async function acceptOrders(idMaterialAssigned) {
        try {
            
            //Validaciones
            if(!deliveredAmount.value) {
                toast.open({
                    message: 'No ingreso un valor',
                    type: 'warning'
                })
                return 
            }

            if(deliveredAmount.value < 0) {
                toast.open({
                    message: 'Ingreso un número no válido',
                    type: 'warning'
                })
                return
            }

            
            const { data } = await MaterialAssignedApi.acceptOrders(idMaterialAssigned, {
                'delivered_amount': deliveredAmount.value
            } )

            const materialData = data.material
                
            toast.open({
                message: data.msg,
                type: 'success'
            })

            router.push({name: 'ordersAdmin'})

            //Quita el pedido del vector ref:
            const index = undeliveredMaterials.value.findIndex(item => parseInt(item.id_material_assigned) === parseInt(idMaterialAssigned));
            if(index !== -1){
                undeliveredMaterials.value.splice(index, 1)
            }

            //Actualiza el vector ref de material
            const indexMaterial = materials.value.findIndex(item => item.id_material === materialData.id_material)
            if(indexMaterial !== -1){
                const newValue = {
                    ...materials.value[indexMaterial],
                    stock: materialData.stock,
                    total_value: materialData.total_value
                }
                materials.value[indexMaterial] = newValue
            }
            
            
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //TRAE LOS PEDIDOS ENTREGADOS 
    async function getMaterialDelivered() {
        try {
            loading.value = true
            const { data } = await MaterialAssignedApi.getDelivered(selectedItemsPerPage.value, currentPage.value)
            dataMaterialOrders.value = data.data
            total.value = data.total
    
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }

    const totalOrders = computed(() => {
        return undeliveredMaterials.value.length
    })

    //FILTRA EL HISTORIAL DE MATERIALES, POR EL NUMERO DE CAF, NOMBRE DEL MATERIAL, TRABAJO
    const filteredData = computed(() => {
        const searchTerm = search.value.toLowerCase().trim();

        if (!searchTerm) {
            return dataMaterialOrders.value;
        }

        return dataMaterialOrders.value.filter((item) => {
            const numCaf = item.num_caf.toLowerCase()
            const materialName = item.name_material.toLowerCase();
            const jobName = item.name_material.toLowerCase();

            return numCaf.includes(searchTerm) || materialName.includes(searchTerm) || jobName.includes(searchTerm)
        })
        
    })


    //función para cambiar la pagina actual de la tabla
    function handlePaginationUpdate (options) {
        currentPage.value = options.page;
        getMaterialDelivered()
    }

    return {
        undeliveredMaterials,
        loadundeliveredMaterials,
        undeliveredMaterialId,
        loadMaterialId,
        deliveredAmount,
        totalOrders,
        currentPage,
        dataMaterialOrders,
        total,
        loading,
        itemsPerPage,
        selectedItemsPerPage,
        search,
        filteredData,
        getUndeliveredMaterials,
        getMaterialAssignedById,
        acceptOrders,
        getMaterialDelivered,
        handlePaginationUpdate
        
    }
})