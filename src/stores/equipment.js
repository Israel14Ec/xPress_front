import { ref, onMounted, watch, inject } from 'vue'
import { defineStore } from 'pinia'
import {useRouter} from 'vue-router'
import TypeEquipmentApi from '../api/TypeEquipmentApi'
import StatusEquipmentApi from '../api/StatusEquipmentApi'
import EquipmentApi from '../api/EquipmentApi'
import useImage from '../composables/useImage';

export const useEquipmentStore = defineStore('equipments', ()=> {
    
    const {uploadImage, url, deleteImage} = useImage()

    const toast = inject('toast')
    const load = ref()

    const typeEquipments = ref([])
    const statusEquipments = ref([])
    const statusOptions = ref([])
    const typeOptions = ref([])
    const equipments = ref([])

    const router = useRouter()
    
    const formEquipment = ref([])
    const nameDocument = 'equipo' //nombre del document donde se va a subir la imagen en Storage

    onMounted(async () => {
        try {

            load.value = true
            const {data: dataType} = await TypeEquipmentApi.getTypeEquipment()
            typeEquipments.value = dataType
            typeOptions.value = dataType.map(type => ({
                label: type.name_type_equipment, 
                value: type.id_type_equipment
            }))

            const {data: dataStatus} = await StatusEquipmentApi.get()
            statusEquipments.value = dataStatus
            statusOptions.value = dataStatus.map(status => ({
                label: status.name_status_equipment,
                value: status.id_status_equipment
            }));

            const {data: dataEquipments} = await EquipmentApi.getByTypeStatus()
            equipments.value = dataEquipments
            
        } catch (error) {
            console.log(error)
        } finally {
            load.value = false
        }
    })

    //Watch para actualizar los cambios de statusEquipment
    watch(statusEquipments, (newValue, oldValue) => {
        statusOptions.value = newValue.map(status => ({
            label: status.name_status_equipment,
            value: status.id_status_equipment
        }));
    }, { deep: true });

    //watch para actualizar los cambios de typeOptions
    watch(typeEquipments, (newValue, oldValue) => {
        typeOptions.value = newValue.map(type => ({
            label: type.name_type_equipment,
            value: type.id_type_equipment
        }));
    }, { deep: true });
    
    async function createTypeEquipment(dataType) {
        try {
            const {data} = await TypeEquipmentApi.createTypeEquipment(dataType)
            typeEquipments.value.push(data.data)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            getEquipmentsByParams()

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }

    async function updateTypeEquipment({id_type_equipment, ...values}) {
        try {

            const {data} = await TypeEquipmentApi.updateTypeEquipment(id_type_equipment, values)

            toast.open({
                message: data.msg,
                type: 'success'
            })
            getEquipmentsByParams()
            // Encuentra el índice del elemento actualizado
            const index = typeEquipments.value.findIndex(item => item.id_type_equipment === id_type_equipment);

            if (index !== -1) {
                // Actualiza el elemento en el array
                typeEquipments.value[index] = data.data;
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function deleteTypeEquipment({id_type_equipment}) {

        try {
            const {data} = await TypeEquipmentApi.deleteTypeEquipment(id_type_equipment)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            typeEquipments.value = typeEquipments.value.filter((item) => item.id_type_equipment !== id_type_equipment);

        } catch (error) {
            console.log(error)
            toast.open({
                message: 'No se pudo eliminar',
                type: 'error'
            })
        }
    }

    async function createStatusEquipment(dataStatus) {
        try {
            const {data} = await StatusEquipmentApi.create(dataStatus)
            statusEquipments.value.push(data.data)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            getEquipmentsByParams()

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }

    async function updateStatusEquipment({id_status_equipment, ...values}) {
        try {

            const { data } = await StatusEquipmentApi.update(id_status_equipment, values)
            console.log(data.data)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            getEquipmentsByParams()

            // Encuentra el índice del elemento actualizado
            const index = statusEquipments.value.findIndex(item => item.id_status_equipment === id_status_equipment);

            if (index !== -1) {
            // Actualiza el elemento en el array
                statusEquipments.value[index] = data.data;
            }

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }

    async function deleteStatusEquipment({id_status_equipment}) {

        try {
            const { data } = await StatusEquipmentApi.delete(id_status_equipment)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            statusEquipments.value = statusEquipments.value.filter((item) => item.id_status_equipment !== id_status_equipment);

        } catch (error) {
            console.log(error)
            toast.open({    
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    async function createEquipment() {
        
        try {
            
            if(formEquipment.value.image.length > 0) {
                const file = formEquipment.value.image[0].file
                await uploadImage(nameDocument, file)
                formEquipment.value.image = url.value
                console.log(url.value)
            } else {
                console.log("sin imagen")
                formEquipment.value.image = ''
            }

            const {data} = await EquipmentApi.create(formEquipment.value)
            getEquipmentsByParams() //Actualiza
            toast.open({
                message: data.msg,
                type: 'success'
            })
            router.push({name: 'EquipmentHome'})
    
        } catch (error) {
            console.log(error)
            toast.open({    
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    async function getEquipmentsByParams(id_status_equipment, id_type_equipment) {
        try {
            const {data} = await EquipmentApi.getByTypeStatus(id_status_equipment, id_type_equipment)
            equipments.value = data
    
        } catch (error) {
            console.log(error)
        }
    }

    async function getEquipmentById(id) {
        load.value = true
        try {
            const { data } = await EquipmentApi.getbyId(id)
            return data.msg

        } catch (error) {
            console.log(error)
        } finally {
            load.value = false
        }
    }

    async function updateEquipment({id_construction_equipment, ...values}) {
        try {
            const { data } = await EquipmentApi.update(id_construction_equipment, values)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            getEquipmentsByParams()
            router.push({name: 'EquipmentHome'})
        } catch (error) {

            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    async function deleteEquipment(dataEquipment) {
        
        try {

            if(dataEquipment.image) {
                deleteImage(dataEquipment.image) //Borra imagen del storage
            }
            const {data} = await EquipmentApi.delete(dataEquipment.id_construction_equipment)
            getEquipmentsByParams()
            toast.open({
                message: data.msg,
                type: 'success'
            })
        } catch (error) {
            console.log(error)
        }
    
    }
    
    return {
        load,
        typeEquipments,
        statusEquipments,
        statusOptions,
        typeOptions,
        formEquipment,
        equipments,
        nameDocument,
        createTypeEquipment,
        updateTypeEquipment,
        deleteTypeEquipment,
        createStatusEquipment,
        updateStatusEquipment,
        deleteStatusEquipment,
        createEquipment,
        getEquipmentsByParams,
        getEquipmentById,
        updateEquipment,
        deleteEquipment
    }
})