<template>
    <div class=" shadow-md p-5 rounded-s-xl border-2 border-gray-20 mb-5">
        <div class="flex flex-row justify-between items-center border-b-2 border-gray-500 relative">

            <p class="text-gray-700 font-semibold">Material solicitado: 
                <span
                    class=" font-normal">
                    {{ `${materialOrder.name_material} de ${materialOrder.magnitude}` }}
                </span> 
            </p>
            <div class="w-6 cursor-pointer hover:text-yellow-500">
                <EllipsisVerticalIcon ref="ellipsis" @click="popModal()" />
            </div>

            <div v-if="selectOption" class="p-5 absolute right-0 top-7 py-2 w-48 bg-gray-700 rounded-md shadow-xl z-10">
                
                <v-dialog max-width="500">
                    <template v-slot:activator="{ props: activatorProps }">
                        <button class="text-left px-4 py-2 text-sm text-white hover:bg-gray-500" v-bind="activatorProps"
                            color="surface-variant" text="Open Dialog" variant="flat">
                            Ver detalles
                        </button>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <v-card title="Detalles" prepend-icon="mdi-chevron-down"  @click.stop>
                            
                            <v-card-text>

                                <div class="text-sm border-t-2">
                                    <h3 class="text-yellow-500 font-semibold mt-3">Se solicita para el trabajo:
                                        <span class="text-gray-700 font-normal">{{ materialOrder.name_job }}</span>
                                    </h3>
                                    <p class="font-semibold">Número de CAF: <span
                                            class="font-normal">{{ materialOrder.num_caf }}</span>
                                    </p>
                                    <p class="font-semibold">Fecha de inicio: <span
                                        class="font-normal">{{ materialOrder.assigned_date }}</span>
                                    </p>
                                    <p class="font-semibold">Fecha de finalización: <span
                                        class="font-normal">{{ materialOrder.end_date }}</span>
                                    </p>
                                </div>
                                 <!--MAPA-->
                                <div class="border-t-2 text-sm">
                                    <p class="mt-3 font-semibold text-yellow-500">Dirección de entrega </p>
                                    <p class="font-semibold">Local: <span class="font-normal">
                                            {{ materialOrder.name_establishment }} </span></p>
                                    <div class="flex flex-row gap-2">
                                        <div class="w-1/2">
                                            <div class="h-60">
                                                <LMap v-model:zoom="zoom" :center="JSON.parse(materialOrder.location)"
                                                    :use-global-leaflet="false">
                                                    <LMarker :lat-lng="JSON.parse(materialOrder.location)">
                                                        <LPopup>{{ materialOrder.name_establishment }}</LPopup>
                                                    </LMarker>

                                                    <LTileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
                                                    </LTileLayer>
                                                </LMap>
                                            </div>
                                        </div>
                                        <div class="w-1/2">
                                            <p class="font-semibold">Dirección:</p>
                                           <p>{{ materialOrder.establishments_description }}</p>
                                        </div>

                                    </div>
                                </div>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <button
                                    class="bg-gray-800 px-2 py-1 text-white rounded-lg"
                                    @click="isActive.value = false"
                                    >
                                    Cerrar
                                </button>
             
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>

                <RouterLink
                    :to="{name: 'confirmMaterialOrder', params: {id: materialOrder.id_material_assigned}}"
                    >
                    <button class="text-left px-4 py-2 text-sm text-white hover:bg-gray-500">
                        Confirmar pedido
                    </button>
                </RouterLink>

            </div>

        </div>

        <!-- MATERIALES -->
        <div class="text-sm mt-5 mb-2">
            <div class="flex flex-row items-center gap-5">
                <div class="w-1/2" >
                    <img 
                        class="w-full h-36 object-cover" 
                        :src="materialOrder.image !== null ? materialOrder.image : '/materiales.png'" 
                        alt="Imagen del material"
                    >
                </div>
                <div class="w-1/2 space-y-1">
                    <div class="mb-2">
                        <p class="font-semibold">Descripción del material: </p>
                        <p>{{ materialOrder.material_description }}</p>
                    </div>

                    <p class="font-semibold">Cantidad solicitada: 
                        <span class="font-normal">{{ materialOrder.amount }}</span>
                    </p>
                    <p class="font-semibold">
                        Fecha de solicitud:
                        <span class="font-normal">{{  getCurrentDate(new Date(materialOrder.date_order))}}</span>
                    </p>
                    <p class="font-semibold">
                        Unidad:
                        <span class="font-normal">{{  materialOrder.magnitude}}</span>
                    </p>

                </div>
            </div>

        </div>


    </div>
</template>

<script setup>

import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { EllipsisVerticalIcon } from '@heroicons/vue/24/solid'
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { getCurrentDate  } from '../../helpers/utils'
import useLocationMap from '../../composables/useLocationMap'

const { zoom } = useLocationMap()
const selectOption = ref(false)
const ellipsis = ref(null);

const popModal = () => {
    selectOption.value = !selectOption.value
}

defineProps({
    materialOrder: {
        type: Object
    }
})

//Cierra el modal si hace click en otra parte del código
const closeMenu = (e) => {
    if (ellipsis.value && !ellipsis.value.contains(e.target) && selectOption.value) {
        selectOption.value = false;
    }
};

//Agrega el manejador de eventos
onMounted(() => {
    document.addEventListener('click', closeMenu);
});

//Elimina el manejador de eventos
onUnmounted(() => {
    document.removeEventListener('click', closeMenu);
});

</script>
