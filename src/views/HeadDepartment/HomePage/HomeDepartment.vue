<template>
    <div class="max-w-[97%] mt-10 mx-auto">
        <div class="flex flex-col lg:flex-row justify-between items-start mx-auto gap-10">
            
            <div class="mx-auto w-full md:w-2/3 bg-white rounded-sm">
                <div v-if="load" class="bg-white p-5">
                    <Spinner />
                    <p class="text-lg text-center text-red-500 font-bold">Cargando Trabajos</p>
                </div>

                <div v-else>
                    <div class="">
                        <div class="px-5 py-3">
                            <p class="text-gray-900 text-xl font-semibold">Tienes <span class="text-yellow-500">{{ jobStore.calcjobDataAssign }}</span> trabajos por asignar</p>
                      
                            <div class="mt-5 flex justify-start gap-5 text-gray-400 cursor-pointer">
                                <p class="text-yellow-500">Por asignar</p>
        
                            </div>
                            <div v-if="jobDataAssign.length  > 0">
                                <CardJobUnAssign
                                    v-for="job in jobDataAssign"
                                    :key="job.id_job"
                                    :object-job="job"
                                />
                            </div>
                            <div v-else>
                                <p class="mt-5 text-sm text-red-500">No hay trabajos por asignar</p>
                            </div>
                
                        </div>
                    </div>
                </div>

            </div>
           
            <!--Calendario--> 
            <div class="flex gap-3 mt-3 md:mt-0 w-full lg:w-1/3 mx-auto">
                
                <div class="flex flex-col">
                    <div class="mb-4">
                        <p class="text-gray-600 font-bold text-lg"> {{ jobStore.formattedDate }}</p>
                    </div>

                    <div class="bg-white p-2 rounded-lg">
                    <VueTailwindDatepicker
                        i18n="es-mx"
                        as-single
                        no-input
                        :formatter="formatter"
                        v-model="dateValue"
                    />
                </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { formatter } from '../../../helpers/utils'
import { useJobStore } from '../../../stores/job'
import { useAuthStore } from '../../../stores/auth'
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import CardJobUnAssign from '../../../components/HeadComponents/CardJobUnAssign.vue';
import Spinner from '../../../components/Spinner.vue'

const jobStore = useJobStore()
const auth = useAuthStore()

const { jobDataAssign, dateValue, load } = storeToRefs(jobStore)
const { userData } = storeToRefs(auth)

const statusAssing = 3

onMounted(async () => {
    jobStore.getJobDepartmentByDate(userData.value.id_department, statusAssing)
})

//Obserla los cambios en la fecha y vuelve a llamar
watch(() => dateValue.value, (newValue, oldValue) => {
    jobStore.getJobDepartmentByDate(userData.value.id_department, statusAssing)
})

</script>

