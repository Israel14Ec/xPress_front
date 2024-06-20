import { defineStore } from 'pinia'
import { ref, inject, onMounted } from 'vue'
import CommunicationApi from '../api/CommunicationApi'

export const useCommunicationStore = defineStore('communications', () => {
    
    const toast = inject('toast')
    const communications = ref([])
    const communicationsOption = ref([]) 
    const load = ref(true)

    //Obtiene
    onMounted( async()=> {
        try {
            const {data} = await CommunicationApi.get()
            communications.value = data

        } catch (error) {
            console.log(error)
        } finally {
            load.value = false
        }
    })

    //Obtiene opciones 
    async function getOptions() {
        try {
            const {data} = await CommunicationApi.get()
            communicationsOption.value = data.map(option => ({
                label: option.name_communication,
                value: option.id_communication_type
            }))
        } catch (error) {
            console.log(error)
        }
    }
    //Agregar medio de comunicación
    async function create(dataCommunication) {
        try {
            const {data} = await CommunicationApi.create(dataCommunication)
            communications.value.push(data.data)
            communicationsOption.value.push({
                label: data.data.name_communication,
                value: data.data.id_communication_type
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
    async function update({id_communication_type, ...values}) {
        try {
            const response = await CommunicationApi.update(id_communication_type, values);

            const updatedInfo = response.data.data; 

            const index = communications.value.findIndex(c => c.id_communication_type === id_communication_type);
            if (index !== -1) {
                communications.value[index] = {...communications.value[index], ...updatedInfo};
                communicationsOption.value[index] = {
                    label: updatedInfo.name_communication,
                    value: id_communication_type
                }
            }
            console.log(updatedInfo)
            
            toast.open({
                message: response.data.msg, 
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
    

    //Eliminar 
    async function deleteCommunication({id_communication_type}) {
        try {
            const { data } = await CommunicationApi.delete(id_communication_type)
            communications.value = communications.value.filter(c => c.id_communication_type !== id_communication_type);
            communicationsOption.value = communicationsOption.value.filter(option => option.__original !== id_communication_type);
            toast.open({
                message: data.msg,
                type: 'success'
            })
        } catch (error) {
            console.log(error)
            toast.open({
                message:error.response.data.msg,
                type: 'error'
            })
        }
    }

    return {
        communications,
        load,
        communicationsOption,
        getOptions,
        create,
        update,
        deleteCommunication
    }
})