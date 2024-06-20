<template>
    <div class="mt-5 max-w-[95%] lg:max-w-[80%] mx-auto bg-white p-2 rounded-2xl">
        <div class="my-3 px-10">

            <div class="flex flex-col md:flex-row gap-5">
                
                <div class="w-1/2">
                    <p class="text-gray-600 font-semibold text-lg">Nombre: </p>
                    <p class="font-normal text-sm mb-3"> 
                        {{ establishment.name_establishment }}
                    </p> 
                    <p class="text-gray-600 font-semibold text-lg">Descripcion: </p>
                    <p class="text-sm mb-3">
                        {{ establishment.description }} 
                    </p>
                </div>

                <div class="w-full">
                    <div class="h-60">
                        <LMap 
                            v-model:zoom="zoom" 
                            :center="establishment.location" 
                            :use-global-leaflet="false" 
                        >
                        <LMarker
                            :lat-lng="establishment.location"
                        >
                            <LPopup>{{ establishment.name_establishment }}</LPopup>
                        </LMarker>
                        
                        <LTileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ></LTileLayer>
                        </LMap>
                     </div> 
                     <p class="text-sm  text-center text-gray-600 font-bold"> Ubicación</p>
                </div>
            </div>
        </div>

        <div class="flex justify-center gap-5">
            <ButtonIcon class="bg-green-400"
                @click="establishmentStore.editEstablishment(establishment)"
            >
                <PencilSquareIcon />
                <template #text>Editar</template>
            </ButtonIcon>

            <ButtonIcon class="bg-red-400"
                @click="establishmentStore.deleteEstablishment(establishment)"
            >
                <TrashIcon />
                <template #text>Eliminar</template>
            </ButtonIcon>
        </div>
        
    </div>

</template>

<script setup>

    import {useEstablishmentStore} from '../../stores/establishment'
    import "leaflet/dist/leaflet.css";
    import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
    import useLocationMap from "../../composables/useLocationMap";
    import ButtonIcon from "../ButtonIcon.vue";
    import { PencilSquareIcon, TrashIcon} from "@heroicons/vue/24/solid";
    
    const {zoom} = useLocationMap()
    const establishmentStore = useEstablishmentStore()

    defineProps({
        establishment: {
            type: Object
        }
    })

</script>

