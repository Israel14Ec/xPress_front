<template>
    <div class="max-w-[95%] mt-4 mx-auto">
        
        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm">
            <div class="flex flex-row justify-between items-center mb-5">
                <h2 class="text-gray-700 font-semibold text-lg">Magnitud para materiales</h2>
                <RouterLink :to="{name: 'MaterialAdd'}">
                    <ButtonBlack class="bg-gray-50 hover:bg-gray-200">
                        <ArrowUturnLeftIcon/>
                        <template #text>
                            Regresar
                        </template>
                    </ButtonBlack>
                </RouterLink>

            </div>
            
            <p class="text-gray-500">En esta sección, puedes agregar diferentes magnitudes para tus materiales, 
                    como kilogramos, metros, litros, etc, con su respectivo valor
            </p>

            <div v-if="magnitudeStore.load">
                <Spinner />
            </div>

            <div v-else>
                <div class="border-t-2 border-gray-500 mt-5 py-2">
                    <h3 class="text-yellow-500 font-semibold mb-5">Valores de las magnitudes</h3>
                    <div class="flex flex-col md:flex-row justify-between items-end mx-auto mb-3">
                        <div class="w-full md:w-auto">
                            <SearchInput v-model:searchValue="searchValues"/>
                        </div>
                        <div class="w-full md:w-auto">
                            <ButtonBlack class="bg-gray-500 hover:bg-gray-400 text-white"
                                @click="addMagnitudeValue()"
                            >
                                <PlusCircleIcon />
                                <template #text>
                                    Añadir valor
                                </template>
                            </ButtonBlack>
                        </div>
                    </div>
                    <div>
                        <v-data-table
                            :headers="headersValue" 
                            :items="magnitudeStore.magnitudeValues" 
                            no-data-text="No hay datos disponibles" 
                            items-per-page-text="Mostrando"
                            :items-per-page-options="itemsOption" 
                            :search="searchValues"

                        >
                            <template v-slot:item.magnitude.symbol="{ item }">
                                <div class=" bg-blue-100 inline-block px-2 rounded-2xl">
                                    <p class="font-semibold text-blue-500">{{ item.magnitude.symbol }} </p>
                                </div>
                            </template>

                            <template v-slot:item.actions="{item}">
                                <div class="flex gap-2 cursor-pointer" >
                                    <PencilIcon 
                                        @click="editMagnitudeValue(item)"
                                        class="w-5 text-green-500/80 hover:text-green-600"    
                                    />

                                    <TrashIcon 
                                        @click="magnitudeStore.deleteMagnitudeValue(item.id_magnitude_value)" 
                                        class="w-5 text-red-500/80 hover:text-red-600"
                                    />
                                </div>
                            </template>
                        </v-data-table>
                    </div>
                </div>

                <div class=" border-t-2 border-gray-500 mt-2 py-2">
                    <h3 class="text-yellow-500 font-semibold mb-5">Magnitudes</h3>
                    <div class="flex flex-col md:flex-row justify-between items-end mx-auto mb-3">
                        <div class="w-full md:w-auto">
                            <SearchInput v-model:searchValue="search"/>
                        </div>
                        <div class="w-full md:w-auto">
    
                            <ButtonBlack class="bg-gray-500 hover:bg-gray-400 text-white"
                                @click="addMagnitude()"
                            >
                                <PlusCircleIcon />
                                <template #text>
                                    Añadir magnitud
                                </template>
                            </ButtonBlack>
                        </div>
                    </div>
            
                    <div class="rounded-2xl">
                        <v-data-table
                            :headers="headers" 
                            :items="magnitudeStore.magnitudes" 
                            no-data-text="No hay datos disponibles" 
                            items-per-page-text="Mostrando"
                            :items-per-page-options="itemsOption" 
                            :search="search"
                        >
                            <template v-slot:item.symbol="{ item }">
                                <div class=" bg-blue-100 inline-block px-2 rounded-2xl">
                                    <p class="font-semibold text-blue-500">{{ item.symbol }} </p>
                                </div>
                            </template>

                            <template v-slot:item.actions="{ item }">
                                <div class="flex gap-2 cursor-pointer" >
                                    <PencilIcon @click="editMagnitude(item)" class="w-5 text-green-500/80 hover:text-green-600"/>
                                    <TrashIcon @click="magnitudeStore.deleteMagnitude(item.id_magnitude)" class="w-5 text-red-500/80 hover:text-red-600"/>
                                </div>
                            </template>

                        </v-data-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useMagnitudeStore } from '../../../stores/magnitude'
import { ArrowUturnLeftIcon, TrashIcon, PencilIcon, PlusCircleIcon } from '@heroicons/vue/24/solid'
import Swal from 'sweetalert2'
import SearchInput from '../../../components/SearchInput.vue';
import ButtonBlack from '../../../components/ButtonBlack.vue';
import { itemsOption } from '../../../helpers/utils'
import Spinner from '../../../components/Spinner.vue'


const magnitudeStore = useMagnitudeStore()
const search = ref('')
const searchValues = ref('')

//Opciones para el encabezado
const headersValue = [
    { key: 'value', title: 'Valor magnitud'},
    { key: 'magnitude.name', title: 'Nombre'},
    { key: 'magnitude.symbol', title: 'Simbolo'},
    { key: 'actions', title: 'Acciones'}
]

const headers = [
    { key: 'name', title: 'Nombre'},
    { key: 'symbol', title: 'Simbolo'},
    { key: 'actions', title: 'Acciones'}
]

const addMagnitude = () => {
    Swal.fire({
        title: 'Añadir magnitud',
        html: `
            <form class="flex flex-col gap-5">
                <div class="flex flex-row justify-start gap-5 w-full">
                    <label class="text-blue-500 mt-4 mb-1" for="name">Nombre: </label>
                    <input class="bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        type="text" 
                        id="name"
                    />
                </div>
                
                <div class="flex flex-row justify-start gap-5 w-full">
                    <label class="text-blue-500 mt-4 mb-1" for="symbol">Simbolo: </label>
                    <input class="bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        type="text" 
                        id="symbol"
                    />
                </div>
            
            </form>
        `,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-2xl'
        },
        preConfirm: () => {
            const name = document.getElementById('name').value
            const symbol = document.getElementById('symbol').value

            if(!name || !symbol){
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }

            return { name, symbol };
        }
    }).then((result) => {
        if(result.isConfirmed) {
            magnitudeStore.addMagnitude(result.value)
        } 
    })
}

const editMagnitude = (item) => {
    Swal.fire({
        title: 'Editar magnitud',
        html: `
            <form class="flex flex-col gap-5">
                <div class="flex flex-row justify-start gap-5 w-full">
                    <label class="text-blue-500 mt-4 mb-1" for="name">Nombre: </label>
                    <input class="bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        type="text" 
                        id="name"
                        value="${item.name}"
                    />
                </div>
                
                <div class="flex flex-row justify-start gap-5 w-full">
                    <label class="text-blue-500 mt-4 mb-1" for="symbol">Simbolo: </label>
                    <input class="bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        type="text" 
                        id="symbol"
                        value="${item.symbol}"
                    />
                </div>
            
            </form>
        `,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-2xl'
        },
        preConfirm: () => {
            const name = document.getElementById('name').value
            const symbol = document.getElementById('symbol').value

            if(!name || !symbol){
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }

            return { name, symbol, id_magnitude: item.id_magnitude };
        }
    }).then((result) => {
        if(result.isConfirmed) {
            magnitudeStore.updateMagnitude(result.value)
        }
    }) 
}

const addMagnitudeValue = () => {
    
    Swal.fire({
        title: 'Añadir valor de la magnitud',
        html: `
            <form class="flex flex-col items-start gap-5">
                
                <div>
                    <label class="text-blue-500 mt-4 mb-1" for="id_magnitude">Magnitud: </label>
                    <select id="id_magnitude" 
                        class="px-5 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white"
                    >
                        <option value="" disabled selected>Seleccione una magnitud</option>
                    </select>
                </div>

                <div>
                    <label class="text-blue-500 mt-4 mb-1" for="value">Valor de la magnitud: </label>
                    <input class="bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        type="text" 
                        id="value"
                    />
                </div>
         

            </form>
        `,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-2xl'
        },
        didOpen: () => {
            // Añadir opciones al select
            const selectElement = document.getElementById('id_magnitude')
            magnitudeStore.magnitudes.forEach( magnitud => {
                const option = new Option(magnitud.symbol, magnitud.id_magnitude);
                selectElement.append(option)
            })
        },
        preConfirm: () => {
            const id_magnitude = document.getElementById('id_magnitude').value
            const value = document.getElementById('value').value

            if(!id_magnitude || !value) {
                Swal.showValidationMessage('Debe llenar todos los campos');
                return false;
            }

            return { id_magnitude, value }
        }
    }).then((result) => {
        if(result.isConfirmed) {
           magnitudeStore.createMagnitudeValues(result.value)
        }
    })
}

const editMagnitudeValue = (item) => {
 
    Swal.fire({
        title: 'Editar valor de la magnitud',
        html: `
        <form class="flex flex-col items-start gap-5">
                
            <div>
                <label class="text-blue-500 mt-4 mb-1" for="id_magnitude">Nombre: </label>
                <select id="id_magnitude" 
                    class="px-5 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white"
                >
                <option value="" disabled selected>Seleccione una magnitud</option>
                </select>
            </div>

            <div>
                <label class="text-blue-500 mt-4 mb-1" for="value">Valor de la magnitud: </label>
                <input class="bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    type="text" 
                    id="value"
                    value="${item.value}"
                />
            </div>
         
        </form>
        `,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-2xl'
        },
        didOpen: () => {
            // Añadir opciones al select
            const selectElement = document.getElementById('id_magnitude')
            magnitudeStore.magnitudes.forEach(magnitud => {
                const option = new Option(magnitud.symbol, magnitud.id_magnitude);
                if (magnitud.id_magnitude === item.id_magnitude) {
                    option.selected = true;
                }
                selectElement.append(option);
            });
        },
        preConfirm: () => {
            const id_magnitude = document.getElementById('id_magnitude').value
            const value = document.getElementById('value').value

            if(!id_magnitude || !value) {
                Swal.showValidationMessage('Debe llenar todos los campos');
                return false;
            }

            return { id_magnitude, value, id_magnitude_value: item.id_magnitude_value }
        }
    }).then((result) => {
        if(result.isConfirmed){
            magnitudeStore.updateMagnitudeValue(result.value)
        }
    })
}
</script>

