<template>
    <div class="px-2 w-full">
        <div class="flex flex-row items-center bg-gray-100 rounded-lg px-2 py-1 mb-5">
            <div>
                <p class="text-gray-600 font-semibold">
                    {{ worker.name + " " + worker.last_name }}
                </p>
                <p class="text-sm">{{ worker.phone_number }}</p>
                <p class="text-sm">{{ worker.email }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    worker: {
        type: Object
    }
})
</script>
