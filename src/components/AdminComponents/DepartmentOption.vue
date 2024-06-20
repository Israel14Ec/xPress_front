<template>
    <div class="mb-3">
        <div class="bg-gray-600 px-5 py-2 hover:bg-gray-500 cursor-pointer" 
            @click="jobStore.departmentSelect(department)"
        >
            <p class="text-yellow-400 font-semibold text-base md:text-lg">Departamento: <span class="font-normal ml-3">
                    {{ department.name_department }}</span></p>

            <div class="flex flex-row gap-1 mt-1 text-sm">
                <p class="text-yellow-50">Cantidad de usuarios: </p>
                <p class="text-white text-sm"> {{ department.users_quantity }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>

import { useJobStore } from '../../stores/job'

const jobStore = useJobStore()

const props = defineProps({
    department: {
        type: Object
    },
    idJob: {
        type: Number
    }
})
</script>

