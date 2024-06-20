<template>
    <div class="max-w-[97%] mx-auto">
        <div class="flex gap-5 mb-10">
            <TextLink
                v-for="option in optionRoute"
                :key="option.route"
                :to="option.route"
            >
                {{ option.label }}
            </TextLink>
        </div>
        <RouterView 
        />
    </div>

</template>

<script setup>
import { RouterView } from 'vue-router'
import TextLink from '../../../components/TextLink.vue';

const optionRoute = [

    { route: 'JobInProgressHead', label: 'Órdenes de trabajo'},
    { route: 'ReportJob', label: 'Historial de órdenes de trabajo completadas'}
]


</script>
