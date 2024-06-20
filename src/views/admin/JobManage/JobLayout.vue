<template>

    <div class="max-w-[95%] mx-auto">
        <div class=" flex gap-5 mb-5">
            <TextLink v-for="option in optionRoute"
                :key="option.route"
                :to="option.route"
            >
                {{ option.label }}
            </TextLink>
        </div>
        
        <div class="bg-gray-50 px-5 py-2">
            <RouterView>
            </RouterView>
        </div>
  
    </div>




</template>

<script setup>

import { RouterView } from 'vue-router'
import TextLink from '../../../components/TextLink.vue'

const optionRoute = [
    { route: 'JobHome', label: 'Organizar trabajos'},
    { route: 'AllJobAdmin', label: 'Historial' }
]

</script>
