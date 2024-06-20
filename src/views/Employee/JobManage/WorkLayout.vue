<template>
    <div class="max-w-[97%] mt-5 mx-auto">
        <div class="mx-auto w-full bg-white rounded-sm">
            <div class="px-5 py-3">
                <div class="mb-5">
                    <p class="text-gray-900 text-xl font-bold">
                        Trabajos
                    </p>
                    <div class="mt-5 flex justify-start gap-5 text-gray-400 cursor-pointer">
                        <RouterLink :to="{name: 'WorkProgressEmployee'}">
                            <p  :class="[route.name == 'WorkProgressEmployee' ? 'text-yellow-500' : '']">En progreso</p>
                        </RouterLink>

                        <RouterLink :to="{name: 'WorkHistoryEmployee'}">
                            <p :class="[route.name== 'WorkHistoryEmployee' ? 'text-yellow-500' : '']">Historial</p>
                        </RouterLink>   
                    </div>
                </div>
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup>

import { useRoute } from 'vue-router'
import { RouterLink, RouterView } from 'vue-router'

const route = useRoute()

route.name
</script>
