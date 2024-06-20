<template>
    <div class="mt-4">

        <h4 class="text-xl text-gray-700 font-semibold">Organización de trabajos</h4>
        <p>Aquí puedes gestionar tus trabajos. Puedes agregar, editar, eliminar y asignar trabajos según sea necesario.</p>

        <div class="mt-3 flex flex-col lg:flex-row justify-between items-start mx-auto gap-3">
            
            <div class="w-full lg:w-2/3">
                <div v-if="statusJob.load">
                    <Spinner/>
                </div>
                <div v-else>
                    <div class="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-5">
                        <div 
                            v-for="status in statusJob.statusStep" 
                            :key="status.id_job_status"
                        >
                            <CardJobStatus
                                :object-status="status"
                            />
                        </div>
                    </div>
                </div>
 
            </div>

            <!--Parte del calendario-->

            <div class="flex gap-3 mt-3 w-full md:mt-0 lg:w-1/3">
                <div class="flex flex-col ">
                    <div class="flex flex-row justify-between mb-4">

                        <div>
                            <p class="text-yellow-500 font-bold text-xl mb-5">Trabajos para: </p>
                            <p class="text-gray-700 font-semibold"> {{ jobStore.formattedDate }}</p>
                            <p class="text-sm text-gray-500">{{ jobStore.dateValue }}</p>

                        </div>
                       
                        <RouterLink
                            :to="{name: 'AddJob'}"
                        >
                            <ButtonBlack class="bg-gray-900 text-white mb-3 pointer-events-none">
                                <PlusCircleIcon/>
                                <template #text>Añadir Trabajo</template>
                            </ButtonBlack>
                        </RouterLink>

                        
                    </div>
       
                    <div class="bg-white p-2 rounded-lg ">
                        <VueTailwindDatepicker
                            i18n="es-mx"
                            as-single
                            no-input
                            v-model="jobStore.dateValue"
                            :formatter="formatter"
                        />
                    </div> 
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { PlusCircleIcon } from '@heroicons/vue/24/solid'
import { RouterLink } from 'vue-router';
import { useJobStore } from '../../../stores/job'
import { formatter } from '../../../helpers/utils'
import { useStatusJobStore } from '../../../stores/statusJob'
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import ButtonBlack from '../../../components/ButtonBlack.vue';
import CardJobStatus from '../../../components/AdminComponents/CardJobStatus.vue';
import Spinner from '../../../components/Spinner.vue';

const jobStore = useJobStore()
const statusJob = useStatusJobStore()


</script>
