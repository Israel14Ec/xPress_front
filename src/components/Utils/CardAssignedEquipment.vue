<template>
    <div class="flex justify-between items-center bg-gray-100 rounded-lg px-2 py-1">
        <div>
            <p class="text-gray-600 font-semibold mb-2"> {{ equipment.name_equipment }}</p>
            <p class="text-gray-600 text-sm"> {{ equipment.description }}</p>
        </div>
    </div>
</template>

<script setup>

defineProps({
    equipment: Object
})
</script>

