<template>
  <div>
    <h3 class="text-lg mb-2 text-gray-700 ">
      En la tabla se visualiza el historial de pedidos de 
      <span class="text-yellow-500 font-bold text-xl">
        {{ select === 1 ? 'Material' : 'Equipos' }}
      </span>
    </h3>
    <div class="mb-10">
      <div class="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10">
        <div class="w-full md:w-1/2">
          <v-text-field prepend-inner-icon="mdi-magnify" v-model="search" variant="underlined" density="compact"
            placeholder="Nombre del material, trabajo o numero de CAF" hide-details label="Buscar" 
          />
        </div>
        <div class="w-full md:w-1/2">
          <v-select

            v-model="select"
            density="compact"
            label="Seleccione el historial"
            variant="underlined" 
            hide-details
            :items="itemsSelect"
            item-title="label"
            item-value="key"
          />
        </div>
      </div>
    </div>

    <!--HISTORIAL MATERIALES -------------------------------------------------->
    <div v-if="select === 1" class=" rounded-2xl">
      <v-data-table-server 
        :items-per-page-options="itemsPerPage" 
        :items-length="total"
        :items="materialAssigned.filteredData" 
        :loading="loading" 
        :headers="headerMaterials"
        no-data-text="No hay datos disponibles" 
        items-per-page-text="Mostrando" 
        item-value="id_material_assigned"
        v-model:items-per-page="selectedItemsPerPage" 
        @update:options="materialAssigned.handlePaginationUpdate"
        >

        <template v-slot:item.date_order="{ item }">
          <p>{{ getCurrentDate(new Date(item.date_order)) }}</p>
        </template>

        <template v-slot:item.caf="{ item }">
          <div v-if="item.num_caf">
            <p>{{ item.num_caf }}</p>
          </div>
          <div v-else>
            <p class="text-red-500">No se proporciono el número de CAF</p>
          </div>
        </template>

        <template v-slot:item.actions="{ item }">

          <div class="flex justify-center items-center gap-1 cursor-pointer" @click="popUpModalData(item)">
            <EyeIcon class="w-5 text-green-500/80 hover:text-green-600" />
            <p class="text-xs text-green-500 font-semibold">Detalles</p>
          </div>

        </template>

      </v-data-table-server>

      <!--Modal para material-->
      <v-dialog width="600" v-model="dialog">
        <v-card prepend-icon="mdi-chevron-down" title="Detalles del pedido">

          <v-card-text>

            <!--MATERIAL-->
            <div class="flex flex-row gap-3">
              <div class="w-1/2 shadow-md mb-2">
                <img :src="dataModalMaterial.image ? dataModalMaterial.image : '/materiales.png'" 
                  :alt="`Foto del material ${ dataModalMaterial.name_material}`"
                  class=" object-cover"
                >
              </div>
              <div class="w-1/2">
                <div class="text-sm border-t-2 space-y-1 mb-2">
                  <h3 class="text-yellow-500 font-semibold mt-3">Material:
                    <span class="text-gray-700 font-normal">{{ dataModalMaterial.name_material }}</span>
                  </h3>
                  <div>
                    <p class="font-semibold">Descripción: </p>
                    <p class="font-normal">{{ dataModalMaterial.material_description }}</p>
                  </div>
          
                  <p class="font-semibold">Cantidad solicitada: <span
                    class="font-normal">{{ dataModalMaterial.amount }}</span>
                  </p>
                  
                  <p class="font-semibold">Cantidad entregada: <span
                    class="font-normal">{{ dataModalMaterial.delivered_amount }}</span>
                  </p>
                </div>
              </div>
            </div>
     

            <!--TRABAJO-->
            <div class="text-sm border-t-2 space-y-1 ">
              <h3 class="text-yellow-500 font-semibold mt-3">Se utilizo en el trabajo:
                <span class="text-gray-700 font-normal">{{ dataModalMaterial.name_job }}</span>
              </h3>
              <p class="font-semibold">Número de CAF: <span class="font-normal">{{ dataModalMaterial.num_caf }}</span>
              </p>
              <p class="font-semibold">Fecha de inicio: <span
                  class="font-normal">{{ dataModalMaterial.assigned_date }}</span>
              </p>
              <p class="font-semibold">Fecha de finalización: <span
                  class="font-normal">{{ dataModalMaterial.end_date }}</span>
              </p>
            </div>

            <!--MAPA-->
            <div class="text-sm border-t-2 space-y-1">
              <p class="mt-3 font-semibold text-yellow-500">Dirección entregada: </p>
              <p class="font-semibold">Local: 
                <span class="font-normal">{{ dataModalMaterial.name_establishment }} </span>
              </p>
              <div>
                <p class="font-semibold">Dirección:</p>
                <p>{{ dataModalMaterial.establishments_description }}</p>
              </div>
            </div>

          </v-card-text>

          <template v-slot:actions>
            <v-spacer></v-spacer>
            <button class="bg-gray-800 px-2 py-1 text-white rounded-lg" @click="dialog = false">
              Cerrar
            </button>
          </template>

        </v-card>
      </v-dialog>

    </div>

     <!--HISTORIAL EQUIPOS -------------------------------------------------------------------------->
     <div v-else class="rounded-2xl">

      <v-data-table-server
        :items-per-page-options="equipmentAssigned.itemsPerPage" 
        :items-length="equipmentAssigned.total"
        :items="equipmentAssigned.dataEquipmentOrders" 
        :loading="equipmentAssigned.loading" 
        v-model:items-per-page="equipmentAssigned.selectedItemsPerPage" 
        no-data-text="No hay datos disponibles" 
        items-per-page-text="Mostrando" 
        @update:options="equipmentAssigned.handlePaginationUpdate"
        item-value="id_equipment_assigned"
        :headers="headerEquipments"
      >

        <template v-slot:item.date_order="{ item }">
          <p>{{ getCurrentDate(new Date(item.date_order)) }}</p>
        </template>

        <template v-slot:item.actions="{item}">
          <div class="flex justify-center items-center gap-1 cursor-pointer" @click="popUpModalDataEquip(item)">
            <EyeIcon class="w-5 text-green-500/80 hover:text-green-600" />
            <p class="text-xs text-green-500 font-semibold">Detalles</p>
          </div>
        </template>
      </v-data-table-server>
      
      <!--Modal para equipo-->
      <v-dialog width="600" v-model="dialogEquipment">
        <v-card   >
          <v-card-text>

            <!--Equipo-->
            <div class="flex flex-row gap-3">
              <div class="w-1/2 shadow-md mb-2">
                <img :src="dataModalEquipment.image ? dataModalEquipment.image : '/equipamiento.png'" 
                  :alt="`Foto del material ${ dataModalEquipment.name_equipment}`"
                  class=" object-cover"
                >
              </div>
              <div class="w-1/2">
                <div class="text-sm border-t-2 space-y-1 mb-2">
                  <h3 class="text-yellow-500 font-semibold mt-3">Material:
                    <span class="text-gray-700 font-normal">{{ dataModalEquipment.name_equipment }}</span>
                  </h3>
                  <div>
                    <p class="font-semibold">Descripción: </p>
                    <p class="font-normal">{{ dataModalEquipment.equipment_description }}</p>
                  </div>
          
                  <p class="font-semibold">Fecha de pedido: <span
                    class="font-normal">{{ getCurrentDate(new Date(dataModalEquipment.date_order))  }}</span>
                  </p>
                  
                </div>
              </div>
            </div>

            <!--TRABAJO-->
            <div class="text-sm border-t-2 space-y-1 ">
              <h3 class="text-yellow-500 font-semibold mt-3">Se utilizo en el trabajo:
                <span class="text-gray-700 font-normal">{{ dataModalEquipment.name_job }}</span>
              </h3>
              <p class="font-semibold">Número de CAF: <span class="font-normal">{{ dataModalEquipment.num_caf }}</span>
              </p>
              <p class="font-semibold">Fecha de inicio: <span
                  class="font-normal">{{ dataModalEquipment.assigned_date }}</span>
              </p>
              <p class="font-semibold">Fecha de finalización: <span
                  class="font-normal">{{ dataModalEquipment.end_date }}</span>
              </p>
            </div>

            <!--MAPA-->
            <div class="text-sm border-t-2 space-y-1">
              <p class="mt-3 font-semibold text-yellow-500">Dirección entregada: </p>
              <p class="font-semibold">Local: 
                <span class="font-normal">{{ dataModalEquipment.name_establishment }} </span>
              </p>
              <div>
                <p class="font-semibold">Dirección:</p>
                <p>{{ dataModalEquipment.establishments_description }}</p>
              </div>
            </div>
          </v-card-text>

          <template v-slot:actions>
            <v-spacer></v-spacer>
            <button class="bg-gray-800 px-2 py-1 text-white rounded-lg" 
              @click="dialogEquipment = false">
              Cerrar
            </button>
          </template>
        </v-card>
      </v-dialog>
    </div>

  </div>

</template>

<script setup>

import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMaterialAssignedStore } from '@/stores/materialAssigned'
import { useEquipmentAssigned } from '../../../stores/equipmentAssigned'
import { EyeIcon } from '@heroicons/vue/24/solid'
import { getCurrentDate } from '../../../helpers/utils'


const materialAssigned = useMaterialAssignedStore()
const { total, loading, itemsPerPage, selectedItemsPerPage, search } = storeToRefs(materialAssigned)

const equipmentAssigned = useEquipmentAssigned()

const dialog = ref(false) //dialog para Material
const dataModalMaterial = ref({})

const dialogEquipment = ref(false) //dialog para equipo
const dataModalEquipment = ref({})

const select = ref(1)
const itemsSelect = [
  { key: 1, label: 'Material' },
  { key: 2, label: 'Equipo' },
];


const headerMaterials = [
  { key: 'name_material', title: 'Material' },
  { key: 'name_job', title: 'Trabajo' },
  { key: 'caf', title: 'Número de CAF' },
  { key: 'date_order', title: 'Fecha de pedido' },
  {
    title: 'Cantidades de material',
    align: 'center',
    children: [
      { key: 'amount', title: 'Pedido', align: 'center' },
      { key: 'delivered_amount', title: 'Entregado', align: 'center' }
    ]
  },
  { key: 'actions', title: 'Acciones' }
]

const headerEquipments = [
  {key: 'name_equipment', title: 'Equipo'},
  {key: 'name_job', title: 'Trabajo'},
  {key: 'num_caf', title: 'Número de CAF'},
  {key: 'date_order', title: 'Fecha de pedido'},
  {key: 'actions', title: 'Acciones'}
]

//Llena el modal de material con los datos
const popUpModalData = (item) => {
  dialog.value = true
  dataModalMaterial.value = item
}

//Llena el modal de equipo con los datos
const popUpModalDataEquip = (item) => {
  dialogEquipment.value = true
  dataModalEquipment.value = item
}


</script>
