import { defineStore, storeToRefs } from 'pinia'
import { ref, inject, onMounted, watch } from 'vue'
import { useMagnitudeValue } from './magnitudeValue'
import MagnitudeApi from '../api/MagnitudeApi'
import MagnitudeValueApi from '../api/MagnitudeValueApi'


export const useMagnitudeStore = defineStore('magnitudes', ()=> {

    const magnitudes = ref([])
    const magnitudeValues = ref([])
    const load = ref(true)
    const toast = inject('toast')
    
    const magnitudValueStore = useMagnitudeValue()

    const { valuesFormatMagtnitudes } = storeToRefs(magnitudValueStore)

    onMounted( async () => {
        try {
            const { data } = await MagnitudeApi.get()
            magnitudes.value = data
            const { data: dataValue} = await MagnitudeValueApi.get()
            magnitudeValues.value = dataValue

        } catch (error) {
            console.log(error)
        } finally {
            load.value = false
        }
    })

    //Watch para escuchar los cambios, esto los añade en valuesFormatMagtnitudes, para el select
    watch(
        () => magnitudeValues.value,
        () => {
            const newFormatted = magnitudeValues.value.map((item) => {
                return {
                    label: `${item.value} ${item.magnitude?.symbol}`,
                    value: item.id_magnitude_value,
                    new: item.magnitude
                };
            });
            
            valuesFormatMagtnitudes.value = newFormatted
        }, {deep: true}
    )

    //Agregar
    async function addMagnitude(dataMagnitude) {
        try {
            const { data } = await MagnitudeApi.create(dataMagnitude)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            magnitudes.value.push(data.data)

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
            
        }
    }

    //Actualizar
    async function updateMagnitude ({id_magnitude, ...value}) {
        try {
            const { data } = await MagnitudeApi.update(id_magnitude, value)
           
            toast.open({
                message: data.msg,
                type: 'success'
            })

            //Actualizar
            const index = magnitudes.value.findIndex( magnitud => magnitud.id_magnitude === id_magnitude)
            magnitudes.value[index] = data.data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Eliminar
    async function deleteMagnitude(id) {
        try {
            const { data } = await MagnitudeApi.delete(id)
            toast.open({
                message: data.msg,
                type: 'success'
            })

            magnitudes.value = magnitudes.value.filter(magnitud => magnitud.id_magnitude !== id)

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Valores de las magnitudes (magnitude_values) -----------------------------------

    //crear
    async function createMagnitudeValues(formData) {
        try {
            const { data } = await MagnitudeValueApi.create(formData)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            
            magnitudeValues.value.push(data.data)
            
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Actualizar
    async function updateMagnitudeValue({id_magnitude_value, ...value}) {
        try {
            const { data } = await MagnitudeValueApi.update(id_magnitude_value, value)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            
            const index = magnitudeValues.value.findIndex((item) => item.id_magnitude_value === id_magnitude_value)
            magnitudeValues.value[index] = data.data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Eliminar
    async function deleteMagnitudeValue(id) {
        try {
            const { data } = await MagnitudeValueApi.delete(id)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            magnitudeValues.value = magnitudeValues.value.filter((item) => item.id_magnitude_value !== id)

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    return {
        magnitudes,
        magnitudeValues,
        load, 
        addMagnitude,
        updateMagnitude,
        deleteMagnitude,
        createMagnitudeValues,
        deleteMagnitudeValue,
        updateMagnitudeValue
    }
})