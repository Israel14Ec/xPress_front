import { defineStore } from 'pinia'
import { onMounted, ref} from 'vue'
import MagnitudeValueApi from '../api/MagnitudeValueApi'

export const useMagnitudeValue = defineStore('magnitudeValues', () => {

    const valuesFormatMagtnitudes = ref([])
    
    onMounted ( async () => {
        try {
            const { data } = await MagnitudeValueApi.getFormatMagnitude()
            valuesFormatMagtnitudes.value = data
            valuesFormatMagtnitudes.value = valuesFormatMagtnitudes.value.map((item) => {
                return {
                    label: item.magnitude,
                    value: item.id_magnitude_value,
                }
            })

        } catch (error) {
            console.log(error)
        }
    })

    return {
        valuesFormatMagtnitudes
    }
})