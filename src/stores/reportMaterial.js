import {defineStore } from 'pinia'
import { ref, inject } from 'vue'
import { useMaterialStore } from './material'
import ReportMaterialApi from '../api/ReportMaterialApi'

export const useReportMaterialStore = defineStore('reportMaterial', () => {

    //Datos para la tabla paginada
    const loading = ref(true)
    const dataReportMaterials = ref([])
    const toast = inject('toast')

    //Instancia de materiales
    const materialStore = useMaterialStore()

    //Obtiene los materiales que deben ser desalojados
    async function reportMaterialByEviction () {
        try {
            loading.value = true
            const { data } = await ReportMaterialApi.getReportMaterialByEviction() 
            dataReportMaterials.value = data
    
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    }

    async function completedReportMaterial(idReportMaterial) {
        try {

            const { data } = await ReportMaterialApi.completedReportMaterial(idReportMaterial)
            
            //Quita del vector ref
            dataReportMaterials.value = dataReportMaterials.value.filter(
                report => report.id_report_material !== idReportMaterial)
            
            const idMaterial = data.data.id_material
   
            //Actualizo del vector de materiales
            const index = materialStore.materials.findIndex(material => material.id_material === idMaterial)
            if (index !== -1) {
                materialStore.materials[index] = data.data
            }

            toast.open({
                message: data.msg,
                type: 'success'
            })
        } catch (error) {
            console.log(error)
        }
    }

    return {

        loading,
        dataReportMaterials,
        reportMaterialByEviction,
        completedReportMaterial
    }
})