<template>
    <div class="flex justify-center mt-10 gap-10">

        <CardOptions class="border-b-2 border-gray-500 hover:bg-gray-200 text-gray-700 w-72"
            :class="[option === 1 ? 'bg-gray-200' : 'bg-white']" @click="optionSelect(1)">
            <ClipboardDocumentCheckIcon />
            <template #text>Gestionar</template>
            <template #description>Administre los locales comerciales.</template>
        </CardOptions>

        <CardOptions class="border-b-2 border-blue-500 hover:bg-blue-100 text-gray-700 w-72" 
            :class="[option === 2 ? 'bg-blue-100' : 'bg-white']"
            @click="optionSelect(2)">
            <PlusCircleIcon />
            <template #text>Añadir</template>
            <template #description>Agregue nuevos locales comerciales.</template>
        </CardOptions>

    </div>

    <div v-if="option === 1">

        <div v-if="establishmentStore.load">
            <Spinner />
        </div>

        <div v-else>
            <div class="mt-5 max-w-[95%] lg:max-w-[80%] mx-auto bg-white px-5 py-2 rounded-2xl">
                <div class="mb-10">
                    
                    <p class="text-center text-xl text-yellow-500 font-semibold mb-3">Buscar local</p>
                    <div class="flex flex-col">
                    
                        <p  class=" font-semibold text-gray-600 mb-3">
                            Nombre del Establecimiento
                        </p>
                        
                        <v-text-field prepend-inner-icon="mdi-magnify" v-model="establishmentStore.search" variant="underlined"  density="compact" 
                            placeholder="Buscar local" hide-details label="Buscar" />
                    </div>
                </div>
            </div>

            <div v-if="establishmentStore.filterEstablishments.length !== 0">
                <CardShop 
                    v-for="establishment in establishmentStore.filterEstablishments" 
                    :key="establishment.id_establishment"
                    :establishment="establishment" 
                />
            </div>
            <div v-else>
                <p class="text-xl text-red-500 text-center font-bold mt-10">No hay registros</p>
            </div>
          
        </div>

    </div>

    <div v-if="option === 2" class="mt-5 max-w-[98%] lg:max-w-[75%] mx-auto bg-white p-4 rounded-2xl">
        <p class="text-yellow-500 text-center text-xl font-semibold mb-3">Agregar local</p>
        <div class="max-w-[70%] mx-auto">
            <FormKit id="formEstablishment" type="form" :actions="false" @submit="handleSubmit">
                <FormKit type="text" label="Nombre del local" name="name_establishment" placeholder="Ingrese el nombre"
                    validation="required" :validation-messages="{
                        required: 'Este campo es obligatorio',
                    }" />

                <FormKit type="textarea" label="Descripción" name="description"
                    placeholder="Escriba una descripción detallada" validation="required|length:0,300" :validation-messages="{
                        required: 'Este campo es obligatorio',
                        length: 'Máximo se admiten 300 caracteres'
                    }" />

                <p class="text-lg text-gray-900 font-semibold text-center mt-10">Ubicación</p>
                <div class="flex flex-row gap-2 justify-center items-end mt-3">
                    <div class="w-1/2">
                        <p class="text-gray-400 font-semibold text-xs">Buscar Dirección:</p>
                        <input 
                            type="text" 
                            class="rounded-lg p-1 w-full bg-gray-50 text-gray-600 ring-2 ring-gray-300 focus:outline-none" 
                            v-model="searchQuery" 
                        />

                    </div>
          
                    <div class="w-1/2">
                        <button class="w-full bg-indigo-500 hover:bg-indigo-400 rounded-lg py-1 px-3 text-white"
                            @click.prevent="searchLocation">
                            Buscar
                        </button>
                    </div>
                </div>

                <div class="w-full h-60 mt-3">
                    <LMap v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
                        <LMarker :lat-lng="center" draggable @moveend="pin" />
                        <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></LTileLayer>
                    </LMap>
                </div>

                <FormKit type="submit">
                    Guardar
                </FormKit>
            </FormKit>

        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useEstablishmentStore } from '../../stores/establishment';
import { reset } from '@formkit/core';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import useLocationMap from '../../composables/useLocationMap'
import { PlusCircleIcon, ClipboardDocumentCheckIcon } from "@heroicons/vue/24/solid";
import CardOptions from "../../components/CardOptions.vue";
import CardShop from '../../components/AdminComponents/CardShop.vue'
import Spinner from '../../components/Spinner.vue';

const option = ref(1)

const { zoom, center, searchQuery, pin, searchLocation } = useLocationMap()
const establishmentStore = useEstablishmentStore()

onMounted(() => {
    establishmentStore.getEstablishment()
})

const optionSelect = (select) => {
    option.value = select
}

//Función para almacenar el valor del formulario
const handleSubmit = async (createForm) => {

    createForm.location = center.value //Añadimos el valor de location
    establishmentStore.createEstablishment(createForm)
    reset('formEstablishment') //Reiniciamos el establecimiento
    searchQuery.value = ""
    setTimeout(() => {
        option.value = 1
    }, 2000);
    
}

</script>

