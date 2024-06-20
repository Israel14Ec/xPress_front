<template>
    <div class="max-w-[97%] mt-5 mx-auto">
        <div class="mx-auto w-full bg-white rounded-sm">
            <div class="px-5 py-3">
                <div v-if="load">
                    <Spinner />
                    <p class="text-center text-red-500 text-lg">Cargando trabajos</p>
                </div>

                <div v-else>
                    <div class="mb-5">
                        <p class="text-gray-900 text-xl font-semibold">
                            Tienes <span class="text-yellow-500"> {{ assignedStore.calcWorksUser }}
                            </span> trabajos asignados
                        </p>
                        <p>Detalles de los trabajos</p>
                    </div>

                    <div class="md:max-w-[80%] mx-auto">
                        <CardJobEmployee 
                            v-for="workOrders in worksUser"
                            :key="workOrders.id_work_order"
                            :work-orders="workOrders"
                        />
                    </div>
       

                </div>
          
            </div>

        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import CardJobEmployee from '../../components/EmployeeComponents/CardJobEmployee.vue';
import { useAssignedWorkerStore } from '../../stores/assignedWorker';
import Spinner from '../../components/Spinner.vue';

const assignedStore = useAssignedWorkerStore()
const statusJob = ref(1) //Estado asignado recursos

const { load, worksUser } = storeToRefs(assignedStore)

onMounted(async () => {
    worksUser.value = await assignedStore.workOrdersUser(statusJob.value)
})

</script>

