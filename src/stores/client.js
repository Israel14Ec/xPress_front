import {defineStore } from 'pinia'
import {inject, ref, onMounted } from 'vue'
import ClientApi from '../api/ClientApi'

export const useClientStore = defineStore('clients', () => {

    const toast = inject('toast')
    const clients = ref([])
    const deleteClients = ref([])
    const load = ref()
    const clientsOption = ref([])


    onMounted(async ()=> {
        try {
            load.value = true
            const {data: dataClient} = await ClientApi.get()
            clients.value = dataClient

        } catch (error) {
            console.log(error)

        } finally {
            load.value = false
        }
    })

    //Agregar cliente
    async function createClient (formClient) {
        try {
            const { data } = await ClientApi.create(formClient)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            clients.value.push(data.data)
            clientsOption.value.push({
                label: data.data.name_client,
                value: data.data.id_client
            })

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }
    
    //Obtener clientes no eliminados
    async function getClient() {
        try {
            const { data } = await ClientApi.get()
            clients.value = data
            clientsOption.value = data.map(option => ({ //Carga el select
                label: option.name_client,
                value: option.id_client
            }))
            

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }

    //Obtener clientes eliminados
    async function getDeleteClient() {
        try {
            const { data } = await ClientApi.getDelete()
            deleteClients.value = data
        } catch (error) {
            console.log(error)
        }
    }

    //Actualizar cliente
    async function updateClient({id_client, ...values}) {
        
        try {
            const { data } = await ClientApi.update(id_client, values)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            const index = clients.value.findIndex(c => c.id_client === id_client);
            if (index !== -1) {
                
                clients.value[index] = {...clients.value[index], ...data.data};
                clientsOption.value[index] = {
                    label: data.data.name_client,
                    value: id_client
                };
            }
            
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Eliminar cliente 
    async function deleteClient({id_client}) {
        try {
            const { data } = await ClientApi.delete(id_client)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            getClient()
            getDeleteClient()
            
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }


    //Restaurar cliente 
    async function restoreClient ({id_client}) {
        try {
            const { data } = await ClientApi.restoreClient(id_client)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            getClient()
            getDeleteClient()

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }

    return {
        clients,
        load,
        deleteClients,
        clientsOption,
        getClient,
        getDeleteClient,
        createClient,
        updateClient,
        deleteClient,
        restoreClient,
    }
})