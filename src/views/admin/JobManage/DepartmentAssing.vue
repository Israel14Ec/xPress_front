<template>
    <div class="max-w-[95%] mt-4 mx-auto">
        <div class="flex flex-row text-xl gap-5 text-black">
            <RouterLink
                :to="{name: 'JobHome'}"
            >
                <ChevronLeftIcon class="w-5"/>
            </RouterLink>
            
            <p class="font-semibold text-yellow-500">Trabajo: <span class="font-normal ml-3 text-gray-700"> {{ jobData.name_job }}</span> </p>
        </div>

        <div class="bg-white px-16 py-2 border-t-2 border-gray-400">
            <h3 class="mb-3 text-sm text-gray-900">Detalles del trabajo</h3>          
            <div v-if="load">
                <Spinner/>
            </div>

            <div v-else>
                <div class="flex flex-col gap-6 md:flex-row">
                    <div class="w-full md:w-1/3 h-64">
                        <img 
                        :src="jobData.before_picture || '/trabajo.png'"
                        class="h-full w-full object-cover rounded-md" 
                        alt="Imagen de trabajo">
                    </div>

                    <div class="w-full space-y-4">

                        <div>
                            <h4 class="title">Número de CAF: </h4>
                            <p :class="{ 'text': jobData.num_caf, 'text-red-500 text-sm': !jobData.num_caf }">
                                {{ jobData.num_caf || 'No dispone de número de CAF' }}
                            </p>

                        </div>
   
                        <div>
                            <h4 class="title">Prioridad: </h4>
                            <p class="text"> {{ jobData.name_priority}}</p>
                        </div>


                        <div>
                            <h4 class="text-gray-900 font-semibold">Descripción: </h4>
                            <p class="text"> {{ jobData.description }}</p>
                        </div>

                        <div class="flex flex-row gap-5">
                            <div class="w-1/2 space-y-3">
                                <div>
                                    <h4 class="title">Cliente</h4>
                                    <p class="text"> {{ jobData.name_client}}</p>
                                </div>

                                <div>
                                    <h4 class="title">Medio de comunicación</h4>
                                    <p class="text"> {{ jobData.name_communication}}</p>
                                </div>

                                <div>
                                    <h4 class="title">Local: </h4>
                                    <p class="text"> {{ jobData.name_establishment}}</p>
                                </div>
                            </div>
                            <div class="w-1/2 space-y-3">
                                
                                <div>
                                    <h4 class="title">Tipo de mantenimiento: </h4>
                                    <p class="text"> {{ jobData.name_maintenance}}</p>
                                </div>
    
                                <div>
                                    <h4 class="title">Fecha de asignación: </h4>
                                    <p class="text"> {{ jobData.start_date}}</p>
                                </div>
                            </div>
                        </div>       
                    </div>
                </div>

                <div class="border-t-2 border-gray-400 mt-4">
                    <h4 class="text-lg font-bold my-4 text-center text-yellow-500">Escoja el departamento</h4>
                        <div class="flex flex-col sm:flex-row gap-2">
                            
                            <div class="md:w-1/2">
                                <DepartmentOption
                                    :id-job="jobData.id_job"
                                    v-for="option in departmentWithoutAdmin"
                                    :key="option.id_department"
                                    :department="option"
                                    
                                />
                            </div>

                            <div class="md:w-1/2 border-l-2 border-gray-400">

                                <p class="text-gray-700 font-semibold text-center">Departamentos seleccionados</p>
                                <div class=" p-5">
                                    <div v-if="depDataSelect.length === 0">
                                        <p class="text-sm text-red-500 text-center">No se ha seleccionado un departamento</p>
                                    </div>
                                    <div v-else>
                                        <div class="md:px-16">
                                             <div v-for="department in depDataSelect" 
                                                :key="department.id_department"
                                            >
                                                <div class="flex justify-between">
                                                    <p class="text-gray-600"> {{ department.name_department }}</p>
                                                    <XCircleIcon
                                                        @click="jobStore.depDelete(department.id_department)" 
                                                        class="w-5 text-gray-600 cursor-pointer"
                                                    />
                                                </div>
                                        
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>
                                
                                <div v-if="depDataSelect.length > 0">
                                    <div class="mx-auto flex justify-center"
                                        @click="jobStore.assignDepartment(route.params.id)"
                                    >
                                        <ButtonBlack class="bg-gray-900 text-white">
                                            <CheckCircleIcon/>
                                            <template #text>
                                                Aceptar
                                            </template>
                                        </ButtonBlack>
                                    </div>
                                </div>
                       
                            </div>
                        </div>
                  
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>

import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'
import { useJobStore } from '../../../stores/job'
import { useDepartmentStore } from '../../../stores/department'
import { ChevronLeftIcon, XCircleIcon, CheckCircleIcon} from '@heroicons/vue/24/solid'
import Spinner from '../../../components/Spinner.vue'
import DepartmentOption from '../../../components/AdminComponents/DepartmentOption.vue'
import ButtonBlack from '../../../components/ButtonBlack.vue'

const route = useRoute()
const jobStore = useJobStore()
const departmentStore = useDepartmentStore()

const {  departmentWithoutAdmin } = storeToRefs(departmentStore)
const { jobData, load, depDataSelect } = storeToRefs(jobStore)


onMounted(async ()=> {
    jobData.value = await jobStore.getJobByIdJoin(route.params.id)
    departmentStore.getDepartment()
}) 

onUnmounted(() => {
    jobData.value = {}
    depDataSelect.value = [] //Vacio
})
</script>

<style scoped>
.title { 
    @apply text-gray-900 font-semibold inline-block mr-2
}
.text {
    @apply text-sm inline-block
}
</style>
