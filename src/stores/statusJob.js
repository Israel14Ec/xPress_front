import { defineStore } from 'pinia'
import { ref, onMounted, inject } from 'vue'
import StatusJobApi from '../api/StatusJobApi'

export const useStatusJobStore = defineStore('statusJobs', () => {

    const status = ref([])
    const load = ref(true)
    const toast = inject('toast')
    const statusOption = ref([])
    const statusStep = ref([])

    onMounted( async () => {
        try {
            const { data } = await StatusJobApi.get()
            const { data: step} = await StatusJobApi.getByStep()
            status.value = data
            statusStep.value = step

        } catch (error) {
            console.log(error)
        } finally {
            load.value = false
        }
    })

    //Obtener
    async function getOptions() {
        try {
            const { data } = await StatusJobApi.get()
            statusOption.value = data.map(option => ({
                label: option.name,
                value: option.id_job_status
            }))
  
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Crear
    async function create(dataStatus) {
        try {
            const {data} = await StatusJobApi.create(dataStatus)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            status.value.push(data.data)
            statusOption.value.push({
                label: data.data.name,
                value: data.data.id_job_status
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
    async function update({id_job_status, ...value}) {
        try {
            const { data } = await StatusJobApi.update(id_job_status, value)
            const index = status.value.findIndex(state => state.id_job_status === id_job_status)
            if(index !== -1) {
                status.value[index] = { ...status.value[index], ...data.data}
                statusOption.value[index] = {
                    label: data.data.name,
                    value: id_job_status
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
    async function deleteStatus({id_job_status}) {
        try {
            const { data } = await StatusJobApi.deleteStatusJob(id_job_status)
            status.value = status.value.filter(state => state.id_job_status !== id_job_status)
            statusOption.value = statusOption.value.filter(option => option.__original !== id_job_status);
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


    return {
        status,
        load,
        statusOption,
        statusStep,
        getOptions,
        create,
        update,
        deleteStatus
    }
})