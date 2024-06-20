<template>
    <p class="mb-5 text-gray-700">En esta sección se puede visualizar los trabajos asignados que actualmente están en progreso</p>
    <div v-if="load">
        <Spinner />
    </div>
    <div v-else>
        <div class="md:max-w-[80%] mx-auto">
            <div v-if="workInProgress.length > 0">
                <CardJobInProgress v-for="work in workInProgress" :key="work.id_job" :-work-in-progress="work" />
            </div>
            <div v-else>
                <p class="text-red-500 text-sm font-bold text-center">No hay trabajos en progreso, revisa la página de
                    inicio</p>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAssignedWorkerStore } from '../../../stores/assignedWorker'
import CardJobInProgress from '../../../components/EmployeeComponents/CardJobInProgress.vue';
import Spinner from '../../../components/Spinner.vue';

const statusJob = ref(2) //Orden de trabajo en progreso


const assignStore = useAssignedWorkerStore()
const { workInProgress, load } = storeToRefs(assignStore)

onMounted(async () => {
    workInProgress.value = await assignStore.workOrdersUser(statusJob.value)
})

</script>

