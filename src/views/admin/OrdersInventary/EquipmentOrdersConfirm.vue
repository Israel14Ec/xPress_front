<template>
    <div class=" shadow-md p-5">
        <RouterLink :to="{name: 'ordersAdmin'}">    
            <div class="flex flex-row gap-3 items-center mb-4">
                <ChevronLeftIcon class="w-5"/>
                <h3 class="text-gray-700 font-bold">Confirmar pedido</h3>
            </div>
        </RouterLink>

        <div v-if="loadEquipmentId">
            <Spinner />
        </div>

        <div v-else class="border-t-2 xl:px-40" >
            <p class="font-semibold text-yellow-500 text-xl mt-5 text-center">Material solicitado:
                <span class=" font-normal text-gray-700">
                    {{ undeliveredEquipmentId.name_equipment }}
                </span>
            </p>

            <div class="flex flex-col md:flex-row gap-5 mt-5 items-center">

                <div class="md:w-1/3">
                    <img class="w-full h-40 object-cover"
                        :src="undeliveredEquipmentId.image !== null ? undeliveredEquipmentId.image : '/equipamiento.png'"
                        alt="Imagen del equipo"
                    >
                </div>
                <div class="md:w-2/3">
                    <!--EQUIPOS-->
                    <div class="text-sm space-y-2">
                        <div>
                            <p class="font-semibold">Descripción del equipo: </p>
                            <p>{{ undeliveredEquipmentId.equipment_description }}</p>
                        </div>

                        <p class="font-semibold">
                            Fecha de solicitud:
                            <span
                                class="font-normal">{{ getCurrentDate(new Date(undeliveredEquipmentId.date_order)) }}</span>
                        </p>
                    </div>
                </div>
            </div>
            <!--TRABAJO-->
            <div class="text-sm border-t-2">
                <h3 class="text-yellow-500 font-semibold mt-3 text-base">Se solicita para el trabajo:
                    <span class="text-gray-700 font-normal text-sm">{{ undeliveredEquipmentId.name_job }}</span>
                </h3>

                <p class="font-semibold">Número de CAF:
                    <span class="font-normal">{{ undeliveredEquipmentId.num_caf }}</span>
                </p>

                <p class="font-semibold">Fecha de inicio:
                    <span class="font-normal">{{ undeliveredEquipmentId.assigned_date }}</span>
                </p>

                <p class="font-semibold">Fecha de finalización: <span
                        class="font-normal">{{ undeliveredEquipmentId.end_date }}</span>
                </p>
            </div>

            <!--MAPA-->
            <div class="">
                <p class="mt-3 font-semibold text-yellow-500">Dirección de entrega </p>
                <p class="font-semibold">Local: <span class="font-normal">
                        {{ undeliveredEquipmentId.name_establishment }} </span></p>
                <div class="flex flex-row gap-2">
                    <div class="w-1/2">
                        <div class="h-60">
                            <LMap v-model:zoom="zoom" :center="JSON.parse(undeliveredEquipmentId.location)"
                                :use-global-leaflet="false">
                                <LMarker :lat-lng="JSON.parse(undeliveredEquipmentId.location)">
                                    <LPopup>{{ undeliveredEquipmentId.name_establishment }}</LPopup>
                                </LMarker>

                                <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
                                </LTileLayer>
                            </LMap>
                        </div>
                    </div>
                    <div class="w-1/2 text-sm">
                        <p class="font-semibold ">Dirección:</p>
                        <p>{{ undeliveredEquipmentId.establishments_description }}</p>
                    </div>
                </div>
            </div>

            <!--BOTON PARA ACEPTAR-->
            <div class=" flex justify-center mt-5">
                <ButtonBlack class="text-white hover:bg-gray-500 bg-gray-700"
                    @click="equipmentAssigned.acceptOrderEquipment(undeliveredEquipmentId.id_equipment_assigned)"
                    >
                    <CheckCircleIcon />
                    <template #text>Confirmar entrega</template>
                </ButtonBlack>
            </div>
        </div>
    </div>
</template>

<script setup>

import { onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEquipmentAssigned } from '../../../stores/equipmentAssigned';
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { getCurrentDate } from '../../../helpers/utils';
import useLocationMap from '../../../composables/useLocationMap';
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import Spinner from '../../../components/Spinner.vue';
import ButtonBlack from '../../../components/ButtonBlack.vue';

const route = useRoute()
const equipmentAssigned = useEquipmentAssigned()

const { zoom } = useLocationMap()
const {undeliveredEquipmentId, loadEquipmentId} = storeToRefs(equipmentAssigned)

onMounted(() => {
    equipmentAssigned.getEquipmentAssignedById(route.params.id)
})

</script>

