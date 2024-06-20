<template>
    <div class="bg-white p-3 rounded-xl w-full">
            
        <div class="flex flex-row justify-between items-end mx-auto">
            <div class="flex flex-row items-center gap-2">
                <div :style="{ backgroundColor: objectStatus.color }" class="h-1 w-1 rounded-full overflow-hidden p-1">
                </div>
                <p class="text-gray-700 tracking-tight"> {{ objectStatus.name }}</p>
                
                <div v-if="select">
                    <div v-if="!load"
                        class="ml-4 h-5 w-5 rounded-full overflow-hidden bg-gray-200 p-1 flex justify-center items-center shadow-sm">
                        <p class="text-gray-700 font-semibold text-xs"> {{ count }}</p>
                    </div>
                </div>
        

            </div>
            <div class="w-5 hover:text-blue-700 cursor-pointer" @click="handleClick(objectStatus)">
                <Bars3Icon />
            </div>
        </div>

        <!--Color del Borde-->
    
        <div class="my-4" :style="{ borderTopColor: objectStatus.color, borderTopWidth: '4px', borderTopStyle: 'solid' }">
        </div>

        <div 
            v-if="select"
            class="overflow-y-auto max-h-80"    
        >
            <div class="">
                <div v-if="jobStore.load">
                    <Spinner />
                </div>

                <div v-if="!load" class="flex flex-col justify-center items-center">

                    <template v-if="jobsData.length > 0">
                        <CardJob 
                            v-for="job in jobsData" 
                            :object-job="job" 
                            :step="objectStatus.step"
                            :key="job.id_job"
                            @job-deleted="handleJobDeleted"
                        />
                    </template>
                    <p v-else class="text-gray-500 text-center text-sm">No hay trabajos registrados en este estado</p>

                </div>
                <div v-else>
                    <Spinner/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, watch, computed, onMounted } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/solid'
import { useJobStore } from '../../stores/job'
import Swal from 'sweetalert2'
import CardJob from './CardJob.vue';
import Spinner from '../Spinner.vue';


const select = ref(true)
const jobStore = useJobStore()
const jobsData = ref([]) //Almacena los datos de la API
const load = ref()


const props = defineProps({
    objectStatus: {
        type: Object
    },
})


//Obtiene los valores de jobData
const handleClick = () => {
    select.value = !select.value; // Cambia el valor del select
}

//Elimina un trabajo 
const handleJobDeleted = (job) => {
    Swal.fire({

        title: 'Eliminar trabajo',
        text: `Se eliminara el trabajo "${job.name_job}"`,
        showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar',
        }).then( (result) => {
            if (result.isConfirmed) {        
                jobStore.deleteJob(job.id_job)    
                
                const index = jobsData.value.findIndex((job) => job.id_job === job.id_job);
                if(index !== -1) {
                    jobsData.value.splice(index, 1);
                }                 
            }
    });
    
};

//Computed para cambiar el valor del contador
const count = computed(() => jobsData.value.length)

//Escucha por la fecha para poner traer los datos nuevos
watch(() => jobStore.dateValue, async () => {
    load.value = true;
    try {
        jobsData.value = await jobStore.getByDate(props.objectStatus.id_job_status);
    } catch (error) {
            console.error(error);
    } finally {
            load.value = false;
    }

}, { deep: true });

onMounted( async () => {
    load.value = true;
    try {
        jobsData.value = await jobStore.getByDate(props.objectStatus.id_job_status);
    } catch (error) {
            console.error(error);
    } finally {
            load.value = false;
    }
})


</script>

