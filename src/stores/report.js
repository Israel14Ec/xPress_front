import { ref, inject, computed } from 'vue'
import { defineStore } from 'pinia'
import ReportApi from '../api/ReportApi'

export const useReportStore = defineStore('reports', () => {
    
    const toast = inject('toast')
    
    const countJobStatus = ref([])
    const loadJobStatus = ref() 

    const countJobEstablishment = ref([])
    const loadJobEstablishment = ref()

    const countJob = ref()
    const totalMaterial = ref()
    const totalEquipment = ref()
    
    
    
    async function getCountJobStatus() {
        try {
            loadJobStatus.value = true
            const { data } = await ReportApi.countJobByStatus()
            countJobStatus.value = data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        } finally {
            loadJobStatus.value = false
        }
    }

    async function getCountJobEstablishment() {
        try {
          loadJobEstablishment.value = true;
          const { data } = await ReportApi.countJobByEstablishment();
        
          countJobEstablishment.value = data.map(item => [item.name_establishment, item.total_value]);
        } catch (error) {
          console.error(error);
          toast.open({
            message: error.response.data.msg,
            type: 'error'
          });
        } finally {
          loadJobEstablishment.value = false;
        }
      }
      
    async function getCountJob() {
        try {
            const { data } = await ReportApi.countJob()
            countJob.value = data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    async function getTotalMaterialValue() {
        try {
            const { data } = await ReportApi.totalMaterialValue()
            totalMaterial.value = data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    async function getTotalEquipmentValue () {
        try {
            const { data } = await ReportApi.totalEquipmentValue()
            totalEquipment.value = data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    const transformedData = computed(() => {
        return countJobStatus.value.map(item => [item.name, item.total_value]);
    });

    return {
        countJobStatus,
        countJob,
        countJobEstablishment,
        totalMaterial,
        totalEquipment,
        transformedData,
        loadJobStatus,
        loadJobEstablishment,
        getCountJobStatus,
        getCountJobEstablishment,
        getCountJob,
        getTotalMaterialValue,
        getTotalEquipmentValue
    }
})