<template>
    <div class="mt-4 mb-6">
        <h4 class="text-xl text-gray-700 font-semibold">Historial de trabajos</h4>
        <p>En esta sección se muestra un registro completo de todos los trabajos realizados, 
            se puede descargar un PDF del informe para los trabajos finalizados
        </p>
    </div>
    <div>

        <div class=" flex flex-col md:flex-row gap-3 md:gap-10 items-start mb-10">
            <div class="w-full md:w-1/2">
                <v-select v-model="select" label="Estado de trabajo" density="compact" variant="underlined"
                    :items="status" item-title="name" item-value="id_job_status"
                    hint="Selecciona un estado de trabajo" />

            </div>
            <div class="w-full md:w-1/2">
                <FormKit type="date" help="ingrese una fecha" v-model="date" />
            </div>
        </div>
        <div class="flex flex-col justify-center items-center">
            <p v-if="!select && !date">Seleccione un estado de trabajo o fecha para mostrar resultados</p>

            <div v-else class=" rounded-lg">

                <v-data-table-server 
                    :items-per-page-options="itemsOption" 
                    v-model:items-per-page="selectedItemsPerPage"
                    :items="jobHistoryData" 
                    :items-length="total" 
                    :headers="dataJob" 
                    :loading="loadPaginate"
                    no-data-text="No hay datos disponibles" 
                    items-per-page-text="Mostrando"
                    item-value="id_material_assigned" 
                    @update:options="jobStore.paginationUpdateHandler">

                    <template v-slot:item.status="{ item }">
                        <div class="flex items-center">

                            <div class="mr-2">
                                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }">

                                </div>
                            </div>
                            <p class=" text-sm">{{ item.name_status }}</p>
                        </div>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <div class="my-3 flex flex-col gap-2">

                            <RouterLink 
                                v-if="select === idJobFinally" 
                                :to="{ name: 'JobFinishDetailsAdmin', params: { id: item.id_job }}" 
                                class="d-flex gap-1 cursor-pointer text-orange-500 hover:text-orange-300"
                                >
                                <EyeIcon class="w-5"/>
                                <p>Detalles</p>
                            </RouterLink>

                            <RouterLink 
                                class="flex gap-1 cursor-pointer text-green-500 hover:text-green-300"
                                :to="{name: 'JobEdit', params: { id: item.id_job }}"
                                >
                                <PencilIcon class="w-5"/>
                                <p>Editar</p>
                            </RouterLink>

                            <button class="flex gap-1 cursor-pointer text-red-500 hover:text-red-300"
                                @click="deletetHandler(item)"
                            >
                                <TrashIcon class="w-5" />
                                <p>Eliminar</p>
                            </button>
                            
                        </div>
                    </template>

                </v-data-table-server>
            </div>
        </div>

    </div>

</template>

<script setup>

import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useStatusJobStore } from '../../../stores/statusJob';
import { useJobStore } from '../../../stores/job'
import { useWorkOrderStore } from '../../../stores/workOrders'
import { itemsOption } from '../../../helpers/utils'
import { TrashIcon, EyeIcon, PencilIcon } from '@heroicons/vue/24/solid'
import Swal from 'sweetalert2'

const statusJobStore = useStatusJobStore()
const { status } = storeToRefs(statusJobStore)

const jobStore = useJobStore()
const { selectedItemsPerPage, jobHistoryData, loadPaginate, total, select, date } = storeToRefs(jobStore)

const workOrderStore = useWorkOrderStore()
const { } = storeToRefs(workOrderStore)

const idJobFinally = 6 //Estado final de trabajo

const dataJob = [
    { key: 'name_job', title: 'Trabajo' },
    { key: 'num_caf', title: 'Número de CAF' },
    { key: 'description', title: 'Descripción' },
    { key: 'start_date', title: 'Fecha ingresada' },
    { key: 'name_client', title: 'Cliente' },
    { key: 'name_establishment', title: 'Local comercial' },
    { key: 'status', title: 'Estado' },
    { key: 'actions', title: 'Opciones' }
]


//Elimina un trabajo
const deletetHandler = (item) => {
    Swal.fire({
    title: 'Eliminar trabajo',
    text: `Se eliminara el trabajo "${item.name_job}", está seguro ?`,
    showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    }).then( (result) => {
        if (result.isConfirmed) {        
            jobStore.deleteJob(item.id_job)    
            
            //saca del vector ref 
            jobHistoryData.value = jobHistoryData.value.filter( job => job.id_job !== item.id_job)
        }
    });
}


</script>
