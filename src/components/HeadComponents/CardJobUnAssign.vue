<template>
    <div class="mb-10 bg-gray-50 shadow-lg rounded-lg md:px-16 overflow-y-auto py-10">
        <div class="flex justify-between items-start">
            <div>
                <p class="text-sm text-red-500 font-semibold">Prioridad: 
                <span class="text-gray-700 font-normal"> {{ objectJob.name_priority}} </span> 
                </p>
                <div class="mt-1 flex flex-col lg:flex-row justify-between items-start mx-auto gap-5">
                    <p class="text-black font-bold text-lg"> {{ objectJob.name_job }}</p>
                </div>

            </div>

            <RouterLink :to="{name: 'AssignResourcesHead', params: {id: objectJob.id_job}}">
                <ButtonBlack class="bg-gray-900 text-white hover:bg-gray-500">
                    <UserCircleIcon/>
                    <template #text>
                        Asignar Recursos
                    </template>
                </ButtonBlack>
            </RouterLink>
        </div>


        <div class="mt-5 flex flex-col md:flex-row gap-3">

            <div class="w-full md:w-1/2">
                <img 
                    v-if="objectJob.before_picture"
                    :src="objectJob.before_picture" 
                    alt="Imagen del trabajo" 
                    class="max-h-80 w-full object-cover rounded-md" 
                >
                <div v-else class="h-full w-full flex justify-center items-center">
                    <img src="/trabajo.png" alt="Imagen predeterminada del trabajo" class="h-full w-full object-cover rounded-md">
                </div>
            </div>

            
            <div class="w-1/2 h-5 space-y-1 text-sm">
                <p class="text-sm font-bold text-gray-900">Descripción</p>
                <p class="text-gray-700 mb-5 text-base"> {{ objectJob.description }} </p>

                <p class="text-black font-semibold">Local: 
                    <span class="text-gray-600 font-normal"> {{ objectJob.name_establishment }}</span> 
                </p>
                <p class=" text-black font-semibold">Mantenimiento:
                    <span class="text-gray-600 font-normal">{{ objectJob.name_maintenance }}</span> 
                </p>
                <p class="text-black font-semibold">Cliente: 
                    <span class="text-gray-600 font-normal">{{  objectJob.name_client  }}</span> 
                </p>
                <p class="text-black font-semibold">Fecha: 
                    <span class="text-gray-600 font-normal">{{  objectJob.start_date }}</span> 
                </p>
            </div>
        </div>

    </div>
</template>

<script setup>

import { RouterLink } from 'vue-router'
import ButtonBlack from '../ButtonBlack.vue';
import {UserCircleIcon} from '@heroicons/vue/24/solid'


const props = defineProps({
    objectJob: Object
})

</script>


