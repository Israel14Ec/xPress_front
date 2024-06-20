<template>
    <div class="flex justify-between items-center bg-gray-100 rounded-lg px-2 py-1 mb-3">
        <div class="text-sm">
            <p class="text-gray-700 font-semibold "> {{ material.name_material }}</p>
            <div class="text-gray-600 mt-2">
                <p class="font-semibold">Cantidad entregada: <span class="font-normal">{{ material.delivered_amount }}</span></p>
                <p class="font-semibold">Descripción: <span class="font-normal"> {{ material.description }} </span></p>
            </div>

        </div>
    </div>
</template>

<script setup>

defineProps({
    material: Object
})

</script>

