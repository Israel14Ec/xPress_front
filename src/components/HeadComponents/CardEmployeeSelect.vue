<template>
    <div class="flex justify-between items-center bg-gray-100 rounded-lg px-2 py-1 mb-5">
        <div>
            <p class="text-gray-600 font-semibold">
                {{ worker.name + " " + worker.last_name }}</p>
            <p class="text-sm">{{ worker.phone_number }}</p>
            <p class="text-sm">{{ worker.email }}</p>
        </div>

        <XCircleIcon  class="w-5 text-gray-600 cursor-pointer" @click="editOrderStore.workSelectDelete(worker.id_user)"/>
    </div>
</template>

<script setup>

import { XCircleIcon } from '@heroicons/vue/24/solid'
import { useEditWorkOrderStore } from '../../stores/EditWorkOrder';

const editOrderStore = useEditWorkOrderStore()

const props = defineProps({
    worker: {
        type: Object
    }
})
</script>
