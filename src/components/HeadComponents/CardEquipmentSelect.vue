<template>
    
    <div class="flex justify-between mt-4 items-center bg-gray-100 rounded-lg px-2 py-1 mb-5">
        <div >
            <p class="text-gray-600 font-semibold"> {{ equipment.name_equipment }}</p>
            <p class="text-gray-600 "> {{ equipment.description }}</p>
        </div>
        <div>
            <XCircleIcon class="w-5 text-gray-600 cursor-pointer" 
                @click="editOrderStore.deleteEquipmentSelect(equipment.id_construction_equipment)"
            />
        </div>
    </div>
</template>

<script setup>

import { XCircleIcon } from '@heroicons/vue/24/solid'
import { useEditWorkOrderStore } from '../../stores/EditWorkOrder';

const editOrderStore = useEditWorkOrderStore()

const props = defineProps({
    equipment: {
        type: Object
    }
})

</script>
