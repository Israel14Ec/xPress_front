<template>
    <div class="max-w-[97%] mt-4 mx-auto">
        <h3 class="font-semibold text-xl">Pedidos de inventario</h3>
        <p>
            En esta sección, encontrarás información detallada sobre los pedidos de materiales y equipos requeridos para completar los trabajos asignados. Además, se visualizara los desalojos de inventario.
        </p>
        <div class="mt-5">
            <div class="bg-white p-5 mt-2 rounded-lg">
                <div class="flex flex-row gap-5">
                    <TextLink
                        v-for="option in optionRoute"
                        :key="option.route"
                        :to="option.route"
                    >
                        {{ option.label }}
                    </TextLink>
                </div>
 
                <div class="mt-7">
                    <RouterView />
                </div>
            </div>
        </div>
    </div>
    
</template>

<script setup>

import { RouterView } from 'vue-router'
import TextLink from '../../../components/TextLink.vue'

const optionRoute = [
    {route: 'ordersAdmin', label: 'Pedidos'},
    {route: 'historyOrdersAdmin', label: 'Historial de pedidos'},
    { route: 'SurplusIneventory', label: 'Desalojo de inventario'}
]
</script>