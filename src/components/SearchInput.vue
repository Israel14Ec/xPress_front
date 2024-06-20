<template>
    <div class="relative mt-2 w-full rounded-lg border-2 border-gray-300">
        <input 
            id="searchInput"
            type="text"
            placeholder="Buscar ..."
            class="w-full bg-white rounded-lg pl-10 focus:outline-none text-gray-900 text-sm py-2"   
            :value="searchValue"
            @input="$emit('update:searchValue', $event.target.value)"
        >
        <div class="absolute inset-y-0 left-0 flex items-center">
            <MagnifyingGlassIcon class="h-5 mx-3" />
        </div>
    </div>
</template>

<script setup>
    import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

    // Definir el prop
    const props = defineProps({
        searchValue: String,
    });
</script>


