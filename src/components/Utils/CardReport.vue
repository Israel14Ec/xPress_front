<template>
    <div class="bg-white px-5 py-2 rounded-lg">
        <div class="flex flex-row justify-between ">
            <div class="">
                <p class="text-sm text-gray-500 font-semibold">
                    <slot name="title"></slot>
                </p>
                <p class="text-gray-700 font-bold text-lg">
                    <slot name="text"></slot>
                </p>
            </div>

            <div class="ml-10">
                <div class="bg-yellow-500 p-2 w-14 shadow-lg rounded-lg flex items-center justify-center text-white">
                    <slot name="icon"></slot>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>

defineProps({
    value: {
        type: Number
    }
})
</script>

