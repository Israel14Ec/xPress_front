<template>
    <div class="flex justify-between items-center bg-gray-100 rounded-lg px-5 py-1 mb-5">
        <div class="w-96">
            <p class="text-gray-600 font-semibold"> {{ equipment.name_equipment }}</p>
            <div class="text-sm">
                <p class="text-gray-600 "> {{ equipment.description}}</p>
            </div>
            <p v-if="equipment.pivot.is_delivered" class=" mt-5 text-sm text-red-500">No se puede eliminar el pédido del equipo por que ya fue entrgado</p>
        </div>
        <div v-if="!equipment.pivot.is_delivered">
            <XCircleIcon 
                class="w-5 text-gray-600 hover:text-gray-400 cursor-pointer"
                @click="editOrderStore.equipmentAssignedDelete(equipment)"
            />
        </div>
    </div>
    
</template>

<script setup>

import { XCircleIcon } from '@heroicons/vue/24/solid';
import { useEditWorkOrderStore } from '../../stores/EditWorkOrder'

const editOrderStore = useEditWorkOrderStore()

const props = defineProps({
    equipment: {
        type: Object
    }
})

</script>
