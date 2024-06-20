<template>
    <div class="max-w-[95%] mt-4 mx-auto">
        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm">
            <p class="text-gray-700 text-lg">Historial del stock del material: 
                <span class="text-xl text-yellow-500 font-semibold">{{ material.name_material }}</span>
            </p>
            
            <p class="text-gray-500 mb-5">Aquí se mostrará el historial del stock del material</p>
            <div class="rounded-2xl">
                <div v-if="loadHistory">
                    <Spinner />
                </div>
                <div v-else>
                    <div class="flex flex-col md:flex-row justify-between items-end mx-auto mb-5">
                        <div class="w-full md:w-auto">
                            <SearchInput v-model:searchValue="search"/>
                        </div>
                        <div>
                            <RouterLink
                                :to="{name: 'MaterialHome'}"
                            >    
                                    <ButtonBlack>
                                        <ArrowUturnLeftIcon/>
                                        <template #text>
                                            Regresar
                                        </template>
                                    </ButtonBlack>
                            </RouterLink>
                        </div>
                    </div>

                    <v-data-table
                        :headers="headers" 
                        :items="historyStock" 
                        no-data-text="No hay datos disponibles" 
                        items-per-page-text="Mostrando"
                        :items-per-page-options="itemsOption" 
                        :search="search"
                        >

                        <template  v-slot:item.created_at="{ item }">
                            {{ getCurrentDate(new Date(item?.created_at)) }}
                        </template>

                        <template v-slot:item.actions="{ item }">
                            <div class="flex flex-row gap-5">
                                <PencilIcon
                                    @click="update(item)"
                                    class="w-5 cursor-pointer text-green-500/80 hover:text-green-600"
                                />
                            </div>
                        </template>

                    </v-data-table>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMaterialStore } from '../../../stores/material'
import { itemsOption, getCurrentDate } from '../../../helpers/utils'
import Spinner from '../../../components/Spinner.vue'
import { PencilIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
import SearchInput from '../../../components/SearchInput.vue'
import ButtonBlack from '../../../components/ButtonBlack.vue'
import Swal from 'sweetalert2'

const route = useRoute()
const materialStore = useMaterialStore()
const material = ref({})
const search = ref('')

const { historyStock, loadHistory } = storeToRefs(materialStore)

onMounted( async () => {
    materialStore.getAddmaterialBymaterialId(route.params.id)
    const data = await materialStore.getMaterialById(route.params.id)
    material.value = data
})

//Opciones para el encabezado
const headers = [
    {key: 'stock', title: 'Cantidad'},
    {key: 'description', title: 'Descripción'},
    {key: 'created_at', title: 'Fecha de adición de stock'},
    {key: 'actions', title: 'Acciones'}
];

//Update 
const update = (item) => {

    Swal.fire({
        title: 'Actualizar historial del stock',
        html: `
            <h3>Va a actualizar el registro del stock ingresado en la fecha: 
                <span class="font-semibold text-yellow-400">${getCurrentDate(new Date(item.created_at))}</span>
            </h3>
            
            <div class="flex flex-col items-start justify-start">

                <label class="text-blue-500 mt-4 mb-1" for="description">Descripción: </label>
                    <textarea 
                        id="description" 
                        class="w-full h-32 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    >${item.description}</textarea>
                    <div class="mt-4 flex flex-row gap-3">
                        <label class="text-blue-500 mt-4 mb-1" for="stock">Stock: </label>
                        <input 
                            id="stock" 
                            type="number"
                            value="${item.stock}" 
                            class=" bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        />
                    </div>
            </div>
        `,
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: 'Cancelar',
        customClass: {
            popup: 'rounded-2xl'
        },
        preConfirm: () => {
            const description = document.getElementById('description').value
            const stock = document.getElementById('stock').value
    
            // Comprueba si todos los campos requeridos están llenos
            if (!description || !stock) {
                Swal.showValidationMessage('Todos los campos son obligatorios');
                return false;
            }
            if (stock <= 0) {
                Swal.showValidationMessage('El stock debe de ser mayor a 0');
                return false;
            }

            return {
                description,
                stock
            }
        }
    }).then((result) => {
        if(result.isConfirmed == true) {
            const data = result.value
            data.id_add_material = item.id_add_material

            materialStore.updateAddMaterial(data)
        }
    })
}

</script>


