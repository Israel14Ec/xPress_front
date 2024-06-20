import { defineStore } from "pinia";
import { ref, onMounted, inject } from 'vue'
import PrioritiesApi from '../api/PrioritiesApi'

export const useJobPrioritiesStore = defineStore('priorities', () => {
    
    const priorities = ref([])
    const load = ref(true) 
    const toast = inject('toast')
    const prioritiesOption = ref([]) 

    onMounted( async () => {
        try {
            const { data } = await PrioritiesApi.get()
            priorities.value = data
        } catch (error) {
            console.log(error)
        } finally {
            load.value = false
        }
    })

    //Obtener los datos
    async function getOptions() {
        try {
            const { data } = await PrioritiesApi.get()
            prioritiesOption.value = data.map(option => ({
                label: option.name,
                value: option.id_job_priority
            }))
        } catch (error) {
            console.log(error)
        }
    }
    //Crear 
    async function create(dataPriorities) {
        try {
            const { data } = await PrioritiesApi.create(dataPriorities)
            toast.open({
                message: data.msg,
                type:'success'
            })
            priorities.value.push(data.data) //Actualiza el vector ref
            prioritiesOption.value.push({
                label: data.data.name,
                value: data.data.id_job_priority
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
    async function update({id_job_priority, ...values}) {
        try {
            const { data } = await PrioritiesApi.update(id_job_priority, values)
            const index = priorities.value.findIndex(priority => priority.id_job_priority === id_job_priority)
            if(index !== -1) {
                priorities.value[index] = { ...priorities.value[index], ...data.data}
                prioritiesOption.value[index] = {
                    label: data.data.name,
                    value: id_job_priority
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
    async function deletPriority({id_job_priority}) {
        try {       
            const { data } = await PrioritiesApi.deletePrioritie(id_job_priority)
            priorities.value = priorities.value.filter(priority => priority.id_job_priority !== id_job_priority);
            prioritiesOption.value = prioritiesOption.value.filter(option => option.__original !== id_job_priority);
            console.log(prioritiesOption.value)
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
        priorities,
        load,
        prioritiesOption,
        getOptions,
        create,
        update,
        deletPriority
    }
})