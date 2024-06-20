<template>
    <RouterLink :to="{ name: to }">
        <p 
            :class="[
                'text-sm hover:border-b-2 hover:border-blue-500 inline-block',
                isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
            ]"
        >
            <slot></slot>
        </p>

    </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import {RouterLink, useRoute} from 'vue-router'

const route = useRoute();

const props = defineProps({
    to: {
        type: String,
        required: true
    }
});

const isActive = computed(() => route.name === props.to);

</script>


