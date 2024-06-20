<template>
    <div class=" shadow-md p-5">

        <RouterLink :to="{ name: 'ordersAdmin' }">
            <div class="flex flex-row gap-3 items-center mb-4">
                <ChevronLeftIcon class="w-5" />
                <h3 class="text-gray-700 font-bold">Confirmar pedido</h3>
            </div>
        </RouterLink>

        <div v-if="loadMaterialId">
            <Spinner />
        </div>
        <div v-else class="border-t-2 xl:px-40">

            <p class="font-semibold text-yellow-500 text-xl mt-5 text-center">Material solicitado:
                <span class=" font-normal text-gray-700">
                    {{ `${undeliveredMaterialId.name_material} de ${undeliveredMaterialId.magnitude}` }}
                </span>
            </p>

            <div class="flex flex-col md:flex-row gap-5 mt-5 items-center">
                <div class="md:w-1/3 ">
                    <img class="w-full h-40 object-cover"
                        :src="undeliveredMaterialId.image !== null ? undeliveredMaterialId.image : '/materiales.png'"
                        alt="Imagen del material">
                </div>

                <div class="md:w-2/3 space-y-1">
                    <!--MATERIALES-->
                    <div class="text-sm">
                        <div>
                            <p class="font-semibold">Descripción del material: </p>
                            <p>{{ undeliveredMaterialId.material_description }}</p>
                        </div>

                        <p class="font-semibold mb-5">Cantidad solicitada:
                            <span class="font-normal">{{ undeliveredMaterialId.amount }}</span>
                        </p>
                        <FormKit type="number" label="Cantidad entregada" step="1" v-model="deliveredAmount"
                            :help="'Tiene disponible, la cantidad de: ' + undeliveredMaterialId.stock" />

                        <p class="font-semibold">
                            Fecha de solicitud:
                            <span
                                class="font-normal">{{ getCurrentDate(new Date(undeliveredMaterialId.date_order)) }}</span>
                        </p>
                    </div>

                </div>
            </div>
            <!--TRABAJO-->
            <div class="text-sm border-t-2">
                <h3 class="text-yellow-500 font-semibold mt-3 text-base">Se solicita para el trabajo:
                    <span class="text-gray-700 font-normal text-sm">{{ undeliveredMaterialId.name_job }}</span>
                </h3>

                <p class="font-semibold">Número de CAF:
                    <span class="font-normal">{{ undeliveredMaterialId.num_caf }}</span>
                </p>

                <p class="font-semibold">Fecha de inicio:
                    <span class="font-normal">{{ undeliveredMaterialId.assigned_date }}</span>
                </p>

                <p class="font-semibold">Fecha de finalización: <span
                        class="font-normal">{{ undeliveredMaterialId.end_date }}</span>
                </p>
            </div>

            <!--MAPA-->
            <div class="">
                <p class="mt-3 font-semibold text-yellow-500">Dirección de entrega </p>
                <p class="font-semibold">Local: <span class="font-normal">
                        {{ undeliveredMaterialId.name_establishment }} </span></p>
                <div class="flex flex-row gap-2">
                    <div class="w-1/2">
                        <div class="h-60">
                            <LMap v-model:zoom="zoom" :center="JSON.parse(undeliveredMaterialId.location)"
                                :use-global-leaflet="false">
                                <LMarker :lat-lng="JSON.parse(undeliveredMaterialId.location)">
                                    <LPopup>{{ undeliveredMaterialId.name_establishment }}</LPopup>
                                </LMarker>

                                <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
                                </LTileLayer>
                            </LMap>
                        </div>
                    </div>
                    <div class="w-1/2 text-sm">
                        <p class="font-semibold">Dirección:</p>
                        <p>{{ undeliveredMaterialId.establishments_description }}</p>
                    </div>

                </div>
            </div>

            <!--Boton de Aceptar-->
            <div class="flex justify-center mt-5">
                <ButtonBlack class="text-white hover:bg-gray-500 bg-gray-700"
                    @click="materialAssigned.acceptOrders(route.params.id)">
                    <CheckCircleIcon />
                    <template #text>Confirmar entrega</template>
                </buttonBlack>
            </div>
        </div>
    </div>

</template>

<script setup>

import { onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMaterialAssignedStore } from '../../../stores/materialAssigned'
import { getCurrentDate } from '../../../helpers/utils'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import useLocationMap from '../../../composables/useLocationMap'
import "leaflet/dist/leaflet.css";
import Spinner from '../../../components/Spinner.vue'
import ButtonBlack from '../../../components/ButtonBlack.vue'

const route = useRoute()
const materialAssigned = useMaterialAssignedStore()

const { zoom } = useLocationMap()
const { undeliveredMaterialId, loadMaterialId, deliveredAmount } = storeToRefs(materialAssigned)

onMounted(() => {
    materialAssigned.getMaterialAssignedById(route.params.id)
})

</script>
