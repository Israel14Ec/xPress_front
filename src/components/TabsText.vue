<template>
    <div 
        :class="['flex flex-col items-center px-3 py-1', selected ? 
            'bg-gray-800 text-white font-semibold' : 
            'bg-gray-200 hover:bg-gray-400 text-black']">

        <div class="w-5">
            <slot name="icon"></slot>
        </div>

        <slot name="text"></slot>

    </div>
</template>

<script setup>

const props = defineProps({
    selected: {
        type: Boolean,
        default: false
    }
})
</script>
