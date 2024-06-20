import { defineStore } from 'pinia'
import { ref, onMounted, inject } from 'vue'
import MaintananceApi from '../api/MaintananceApi'

export const useMaintenanceStore = defineStore('maintenances', () => {

    const maintenances = ref([])
    const load = ref(true)
    const toast = inject('toast')
    const maintenanceOption = ref([])
    onMounted(async () => {
        try {
            const {data} = await MaintananceApi.get()
            maintenances.value = data
        } catch (error) {
            console.log(error)

        } finally {
            load.value = false
        }
    })

    //Buscar 
    async function getOptions() {
        try {
            const { data } = await MaintananceApi.get()
            maintenanceOption.value = data.map(option => ({
                label: option.name,
                value: option.id_type_maintenance
            }))
        } catch (error) {
            console.log(error)
        }
    }
    //Crear
    async function create(dataMaintenance) {
        try {
            const { data } = await MaintananceApi.create(dataMaintenance)
            maintenances.value.push(data.data)
            maintenanceOption.value.push({
                label: data.data.name,
                value: data.data.id_type_maintenance
            })
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

    //Actualizar
    async function update({id_type_maintenance, ...value}) {
        try {
            const {data} = await MaintananceApi.update(id_type_maintenance, value)
            const index = maintenances.value.findIndex(maintenance => maintenance.id_type_maintenance === id_type_maintenance)
            if(index !== -1) {
                maintenances.value[index] = { ...maintenances.value[index], ...data.data}
                maintenanceOption.value[index] = {
                    label: data.data.name,
                    value: id_type_maintenance
                }
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
            });
        }
    }

    //Eliminar
    async function deleteMaintenance({id_type_maintenance}) {
        try {
            const { data } = await MaintananceApi.deleteMaintenance(id_type_maintenance)
            maintenances.value = maintenances.value.filter(maintenance => maintenance.id_type_maintenance !== id_type_maintenance)
            maintenanceOption.value = maintenanceOption.value.filter(option => option.__original !== id_type_maintenance);
            toast.open({
                message: data.msg,
                type: 'success'
            })

        } catch (error) {
            console.log(error)

        }
    }

    return {
        maintenances,
        load,
        maintenanceOption,
        getOptions,
        create,
        update,
        deleteMaintenance
    }
})