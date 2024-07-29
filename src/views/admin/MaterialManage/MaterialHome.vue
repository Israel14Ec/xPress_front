<template>
    <div class="max-w-[95%] mt-4 mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mx-auto">
            <div class="w-full md:w-auto">
                <SearchInput v-model:searchValue="search"/>
            </div>
            
            <div class="flex gap-3 mt-3 md:mt-0 w-full md:w-auto ">

                <button @click="addMaterialHandler">
                    <ButtonBlack class="bg-gray-50 hover:bg-gray-200">
                        <PlusCircleIcon />
                        <template #text>
                        Añadir Stock
                        </template>
                    </ButtonBlack>
                </button>
                 
                <RouterLink :to="{ name: 'MaterialAdd' }">
                    <ButtonBlack class="bg-gray-900 text-white pointer-events-none">
                        <PlusCircleIcon />
                        <template #text>
                        Nuevo material
                        </template>
                    </ButtonBlack>
                </RouterLink>

            </div>
        </div>

        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm">
            <p class="text-gray-700  font-semibold mb-5">Listado de Materiales</p>
            <div>
                <div v-if="materialStore.load">
                    <Spinner />
                </div>
                <div v-else>

                    <div class="rounded-2xl">
                        <v-data-table 
                            :headers="headers" 
                            :items="materialStore.materials" 
                            no-data-text="No hay datos disponibles" 
                            items-per-page-text="Mostrando"
                            :items-per-page-options="itemsOption" 
                            :search="search"
                        >

                            <template v-slot:item.image="{ item }">
                                <v-img v-if="item.image" :src="item.image" cover class="h-24 w-36 my-4"></v-img>
                                <v-img v-else cover class="h-20 w-20" src="/materiales.png"></v-img>
                            </template>

                            <template v-slot:item.unit_value="{ item }">
                                <span>{{ formatCurrency(item.unit_value )}}</span>
                            </template>

                            <template v-slot:item.total_value="{ item }">
                                <span>{{ formatCurrency(item.total_value) }}</span>
                            </template>

                            <template v-slot:item.magnitude="{ item }">
                                <span>{{ `${item.value} ${item.symbol}`}}</span>
                            </template>


                            <template v-slot:item.actions="{ item }">
                                <div class="my-3 flex flex-col gap-2">
                                    <RouterLink :to="{ name: 'MaterialEdit', params: { id: item.id_material } }"
                                        class="flex gap-1 text-green-500 hover:text-green-300"
                                        >
                                        <PencilIcon
                                            class="w-5 cursor-pointer"
                                        />
                                        <p>Editar</p>
                                    </RouterLink>

                                    <button class="flex gap-1 cursor-pointer text-red-500 hover:text-red-300"
                                        @click="deleteItem(item)"
                                        >
                                        <TrashIcon
                                            class="w-5"
                                        />
                                        <p>Eliminar</p>
                                    </button>
                             

                                    <RouterLink :to="{name: 'StockHistory', params: {id: item.id_material}}"
                                        class="flex gap-1 text-orange-500 hover:text-orange-300"
                                    >
                                        <EyeIcon 
                                            class="w-5 cursor-pointer "
                                        />
                                        <p>Historial Stock</p>                                    
                                    </RouterLink>
                
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
import { PlusCircleIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { useMaterialStore } from '../../../stores/material'
import { formatCurrency } from '../../../helpers/utils'  
import Swal from 'sweetalert2'
import Spinner from '../../../components/Spinner.vue';
import ButtonBlack from '../../../components/ButtonBlack.vue'
import SearchInput from '../../../components/SearchInput.vue'

const materialStore = useMaterialStore()

const itemsOption = [
    5, 10, 15, -1
]

const search = ref()

//Opciones para el encabezado
const headers = [
    { key: 'image', title: 'Imagen' },
    { key: 'name_material', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
    {
        title: 'Detalles',
        align: 'center',
        children: [
            { key: 'unit_value', title: 'Valor unitario', align: 'center' },
            { key: 'stock', title: 'Stock', align: 'center' },
            { key: 'total_value', title: 'Valor total', align: 'center' },
            { key: 'magnitude', title: 'Magnitud', align: 'center' },
        ]
    },
    { key: 'actions', title: 'Acciones' }
];

//Acciones del boton

const deleteItem = async (item) => {
    const result = await Swal.fire({
        title: 'Eliminar material',
        text: ` Se eliminara el material ${item.name_material}`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        materialStore.deleteMaterial(item)
    }
}

//Añadir stock
const addMaterialHandler = () => {
    Swal.fire({
        title: 'Agregar Stock',
        html: `
            <div class="flex flex-col items-start">

                    <label class="text-blue-500 mt-4 mb-1" for="id_material">Nombre: </label>
                    <select id="id_material" class="px-5">
                        <option value="" disabled selected>Seleccione un material</option>
                    </select>

                    <label class="text-blue-500 mt-4 mb-1" for="description">Descripción: </label>
                    <textarea 
                        id="description" 
                        class="w-full h-32 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    ></textarea>
                    <div class="mt-4 flex flex-row gap-3">
                        <label class="text-blue-500 mt-4 mb-1" for="stock">Stock: </label>
                        <input 
                            id="stock" 
                            type="number" 
                            class=" bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        />
                    </div>
                    <p class="mt-16 text-gray-500 font-semibold">Fecha: <span class="text-sm font-normal" id="dateNow"></span> </p>
                    
                </div>
            `,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-2xl'
        },

        didOpen: () => {
            // Añadir opciones al select
            const selectElement = document.getElementById('id_material');
            materialStore.materials.forEach(material => {
                const option = new Option(material.name_material, material.id_material);
                selectElement.append(option);
            });

            // Inicializa Select2 y especifica el dropdownParent
            $('#id_material').select2({
                placeholder: 'Seleccione un material',
                dropdownParent: $('#swal2-html-container'),
                language: {
                    noResults: function () {
                        return "No hay resultados";
                    },
                    searching: function () {
                        return "Escriba para buscar";
                    }
                },
                containerCssClass: 'mi-clase-contenedor',
                dropdownCssClass: 'mi-clase-dropdown',
            })
            $('#id_material').on('select2:open', function () {
                // Placeholder el input
                $('.select2-search--dropdown .select2-search__field').attr('placeholder', 'Escriba para buscar');
            });

            const fechaActual = new Date();
            const fechaFormateada = fechaActual.toLocaleDateString('es', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Coloca la fecha formateada en el elemento con id 'dateNow'
            document.getElementById('dateNow').textContent = fechaFormateada;

        },

        preConfirm: () => {
            const id_material = $('#id_material').val(); // Con jQuery, si Select2 está aplicado
            const description = document.getElementById('description').value;
            const stock = document.getElementById('stock').value;

            // Comprueba si todos los campos requeridos están llenos
            if (!id_material || !description || !stock) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
            if (stock <= 0) {
                Swal.showValidationMessage('El stock debe de ser mayor a 0');
                return false;
            }
            const dataMaterialAdd = {
                id_material,
                description,
                stock
            }

            materialStore.materialAdd(dataMaterialAdd)

        }
    })
}

</script>


<style>

/* Ejemplo de estilos personalizados para Select2 con Tailwind CSS */
.select2-container .select2-selection {
    @apply bg-gray-100 border border-gray-50 text-gray-500 rounded-md;
}

.select2-container--default .select2-selection--single {
    @apply h-8 leading-10;
    /* Ajusta la altura y la alineación del texto */
}

.select2-dropdown {
    @apply bg-white border border-gray-50;
    /* Estilos para el dropdown */
}

.select2-results__option {
    @apply text-base text-gray-600 text-left;
    /* Estilos para las opciones */
}

.select2-container--default .select2-results__option--highlighted[aria-selected] {
    @apply bg-blue-200 text-blue-500;
    /* Estilo para la opción destacada */
}

.select2-container--default .select2-selection--single .select2-selection__rendered {
    @apply text-gray-500 text-left;
    /* Estilos para el elemento seleccionado en Select2 */
}

</style>