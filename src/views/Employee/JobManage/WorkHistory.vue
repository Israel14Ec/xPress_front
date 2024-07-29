<template>
    <div>
        <div v-if="load">
            <Spinner />
            <p class="text-red-500 text-center">Cargando datos</p>
        </div>
        <div v-else>
            <div class="rounded-lg">
                <div class="mb-5">
                    <p class="text-gray-500 font-semibold">Historial de los trabajos completados</p>
                    <p class="text-gray-700 text-sm">En esta sección puedes visualizar todos los trabajos finalizados hasta la fecha</p>
                </div>
           
                <div class="mb-5">
                    <SearchInput v-model:searchValue="search" />
                    <p class="text-xs font-semibold text-gray-500">Se puede buscar por el nombre del trabajo</p>
                </div>
        
                <v-data-table 
                    :headers="headers" 
                    :items="assignStore.filteredworkDataHistory" 
                    no-data-text="No hay datos disponibles"
                    items-per-page-text="Mostrando" 
                    :items-per-page-options="itemsOption" 
                    >

                    <template v-slot:item.job="{ item }">
                        <p class="text-center text-gray-700 font-bold w-32">{{ item.job.name_job }}</p>
                        <v-img v-if="item.job.before_picture" :src="item.job.before_picture" cover class="h-24 w-36 my-4"></v-img>
                        <v-img v-else class="h-20 w-20" src="/trabajo.png"></v-img>
                    </template>
                    
                    <template v-slot:item.description="{ item }">
                        <p class="text-sm w-72">{{ item.job.description }}</p>
                    </template>

                    <template v-slot:item.time="{ item }">
                        <div class="mb-5">
                            <p class="text-red-500 ">Fecha de Inicio: </p>
                            <p class="text-sm">{{ item.assigned_date  }}</p>
                        </div>
                    
                        <div>
                            <p class="text-red-500">Fecha de Fin:</p>
                            <p class="text-sm"> {{ item.end_date }}</p>
                        </div>
                
                    </template>

                    
                    <template v-slot:item.actions="{ item }">

                        <div class="flex flex-col items-start gap-4">
                            
                            <RouterLink :to="{name: 'ViewCompleteJobEmployee', params:{id: item.id_work_order} }">
                                <div class="flex flex-row justify-center items-center cursor-pointer gap-1 text-green-500 hover:text-green-300">
                                    <EyeIcon class="w-5"/>
                                    <p>Ver</p>
                                </div>
                            </RouterLink>
                      

                            <RouterLink :to="{name: 'EditCompleteJobEmployee', params:{id: item.id_work_order}}">
                                <div class="flex flex-row justify-center items-center cursor-pointer gap-1 text-orange-500 hover:text-orange-600">
                                    <PencilIcon class="w-5"/>
                                    <p>Editar</p>
                                </div>
                            </RouterLink>
                        </div>
                  
                    
                    </template>

                </v-data-table>
            </div>
        </div>
    </div>
</template>

<script setup>


import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAssignedWorkerStore } from '../../../stores/assignedWorker'
import { PencilIcon, EyeIcon } from '@heroicons/vue/24/solid'
import Spinner from '../../../components/Spinner.vue';
import SearchInput from '../../../components/SearchInput.vue'

const statusJob = ref(3) //ORDEN DE TRABAJO FINALIZADA

const assignStore = useAssignedWorkerStore()
const { workDataHistory, load, search } = storeToRefs(assignStore)

onMounted(async () => {
    workDataHistory.value = await assignStore.workOrdersUser(statusJob.value)
})

const headers = [
    { key: 'job', title: 'Trabajo' },
    { key: 'description', title: 'Descripción' },
    { key: 'time', title: 'Tiempo demorado' },
    { key: 'actions', title: 'Acciones' }
];

const itemsOption = [
    5, 10, 15, -1
]

</script>

