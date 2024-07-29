<template>
    <div class="max-w-[95%] mt-4 mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-start mx-auto">

            <div class="w-full md:w-auto gap-3">
                
                <SearchInput v-model:searchValue="search"/>

                <div class="flex flex-row gap-3 mt-4">
                    <div class="flex flex-col text-sm">
                        <label for="selectStatus" class="text-blue-500">Buscar por estado</label>
                        <select id="selectStatus"
                            class="border  rounded-md p-1 bg-white text-blue-500 focus:text-gray-500 mt-1 w-40 focus:outline-none focus:ring-blue-300"
                            v-model="optionSelect.id_status_equipment"
                            @change="selectHandler"
                        >
                            <option value="0" >Todos</option>
                            <option v-for="status in equipmentStore.statusEquipments"
                                :key="status.id_status_equipment"
                                :value="status.id_status_equipment"
                            >
                                {{ status.name_status_equipment }}
                            </option>
                        </select>
                    </div>

                    <div class="flex flex-col text-sm">
                        <label for="selectType" class="text-blue-500">Buscar por tipo</label>
                        <select id="selectType"
                            class="border rounded-md p-1 bg-white text-blue-500 focus:text-gray-500 mt-1 w-40 focus:outline-none focus:ring-blue-300"
                            v-model="optionSelect.id_type_equipment"
                            @change="selectHandler"
                        >
                            <option value="0" >Todos</option>
                            <option v-for="status in equipmentStore.typeEquipments"
                                :key="status.id_type_equipment"
                                :value="status.id_type_equipment"
                            >
                                {{ status.name_type_equipment }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="flex gap-3 mt-3 md:mt-0 w-full md:w-auto ">
                
                <RouterLink :to="{ name: 'StatusEquipment' }">
                    <ButtonBlack class="bg-white hover:bg-gray-500">
                        <PencilSquareIcon />
                        <template #text>Estados</template>
                    </ButtonBlack>
                </RouterLink>

                <RouterLink :to="{ name: 'TypeEquipment' }">
                    <ButtonBlack class="bg-white hover:bg-gray-500">
                        <PencilSquareIcon />
                        <template #text>Tipos de equipo</template>
                    </ButtonBlack>
                </RouterLink>

                <RouterLink :to="{ name: 'EquipmentAdd' }">
                    <ButtonBlack class="bg-gray-900 text-white pointer-events-none">
                        <PlusCircleIcon />
                        <template #text>Nuevo equipo</template>
                    </ButtonBlack>
                </RouterLink>
            </div>
        </div>

        <div class="bg-white px-4 py-2 rounded mt-5 shadow-sm">
            <p class="text-gray-700  font-semibold mb-5">Listado de Equipos</p>
            <div v-if="equipmentStore.load">
                <Spinner/>
            </div>
            <div v-else>

                <div class="rounded-2xl">
                    <v-data-table
                        :headers="headers"
                        :items="equipmentStore.equipments"
                        no-data-text="No hay datos disponibles" 
                        items-per-page-text="Mostrando"
                        :items-per-page-options="itemsOption" 
                        :search="search"
                    >

                        <template v-slot:item.image="{ item }">
                            <v-img v-if="item.image" :src="item.image" cover class="h-24 w-36 my-4"></v-img>
                            <v-img v-else class="h-20 w-20" src="/equipamiento.png"></v-img>
                        </template>

                        <template v-slot:item.unit_value="{ item }">
                            {{ formatCurrency( item.unit_value) }}
                        </template>

                        <template v-slot:item.name_status_equipment="{ item }">
                            <div class="flex flex-col items-center">
                                <div :style="{ backgroundColor: item.color }" class="w-4 h-4 rounded-full border border-gray-200"></div>
                                <span class="text-sm mt-2">{{ item.name_status_equipment }}</span>
                            </div>
                        </template>


                        <template v-slot:item.actions="{ item }">
                            <div class="my-3 flex flex-col gap-2">
                               
                                <RouterLink
                                    :to="{name: 'EquipmentEdit', params: { id: item.id_construction_equipment }}"
                                    class="text-green-500 hover:text-green-400 flex gap-1"
                                >
                                    <PencilIcon class="w-5 cursor-pointer "/>
                                    <p>Editar</p>
                                </RouterLink>
                                
                                <button
                                    @click="deleteHandler(item)"
                                    class="text-red-500 hover:text-red-400 flex gap-1"
                                >
                                    <TrashIcon class="w-5 cursor-pointer "/>
                                    <p>Eliminar</p>
                                </button>
                             
                  
                            </div>
                        </template>

                    </v-data-table>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>

import { ref } from 'vue'
import { RouterLink } from 'vue-router';
import { useEquipmentStore } from '../../../stores/equipment'
import { PencilSquareIcon, PlusCircleIcon, TrashIcon, PencilIcon } from '@heroicons/vue/24/solid'
import { formatCurrency } from '../../../helpers/utils'
import Swal from 'sweetalert2'
import ButtonBlack from '../../../components/ButtonBlack.vue';
import Spinner from '../../../components/Spinner.vue';
import SearchInput from '../../../components/SearchInput.vue';

const optionSelect = ref({
    id_status_equipment: 0,
    id_type_equipment: 0
})

const search = ref()
const equipmentStore = useEquipmentStore()

const headers = [
    { key: 'image', title: 'Imagen' },
    { key: 'name_equipment', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
    { key: 'unit_value', title: 'Valor unitario' },
    { key: 'name_status_equipment', title: 'Estado', align: 'center'},
    { key: 'name_type_equipment', title: 'Tipo' },
    { key: 'actions', title: 'Acciones' }
];

const itemsOption = [
    5, 10, 15, -1
]

const selectHandler = () => {
    equipmentStore.getEquipmentsByParams(optionSelect.value.id_status_equipment, optionSelect.value.id_type_equipment)
}
const deleteHandler = async (item) => {
    const result = await Swal.fire({
        title: 'Eliminar estado',
        text: ` Se eliminara el equipo "${item.name_equipment}", en algunos casos la eliminación no es posible`,
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        equipmentStore.deleteEquipment(item)
    }
    }


</script>
