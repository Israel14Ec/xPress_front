<template>
 <div class="p-2 flex flex-col md:flex-row gap-10">

    <div class="md:w-1/2">
        
        <div class="flex items-center justify-center border-l-2 border-gray-700">
            
            <div class="mr-3 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <p class="p-1 text-white font-semibold">{{ materialAssigned.totalOrders }}</p>
            </div>

            <p class="text-gray-700 font-semibold text-center text-lg ">
                Pedidos de materiales
            </p>

        </div>

        
        <div v-if="loadundeliveredMaterials">
            <Spinner/>
        </div>
        <div v-else class="mt-7">

            <div v-if="undeliveredMaterials.length > 0">
                <CardOrdersMaterial
                    v-for="order in undeliveredMaterials"
                    :key="order.id_material_assigned"
                    :material-order="order"
                />
            </div>
            <div v-else>
                <p class="text-center">No hay pedidos de materiales recientes</p>
            </div>
  
        </div>

    </div>

    <div class="md:w-1/2">
        <div class="flex items-center justify-center border-l-2 border-gray-700">
            
            <div class="mr-3 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <p class="p-1 text-white font-semibold">{{ equipmentAssigned.totalOrders }}</p>
            </div>

            <p class="text-gray-700 font-semibold text-center text-lg ">
                Pedidos de equipos
            </p>

        </div>
        <div v-if="loadUndeliveredEquipment">
            <Spinner/>
        </div>
        <div v-else class="mt-7">
            <div v-if="undeliveredEquipments.length > 0">
                <CardOrdersEquipment
                    v-for="equipments in undeliveredEquipments"
                    :key="equipments.id_equipment_assigned"
                    :equipment-order="equipments"
                />
            </div>
            <div v-else>
                <p class="text-center">No hay pedidos de equipos recientes</p>
            </div>
        </div>
    </div>
    
 </div>
</template>

<script setup>

import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMaterialAssignedStore } from '../../../stores/materialAssigned'
import { useEquipmentAssigned } from '../../../stores/equipmentAssigned'
import CardOrdersMaterial from '../../../components/AdminComponents/CardOrdersMaterial.vue'
import CardOrdersEquipment from '../../../components/AdminComponents/CardOrdersEquipment.vue'
import Spinner from '../../../components/Spinner.vue';

const materialAssigned = useMaterialAssignedStore()
const equipmentAssigned = useEquipmentAssigned()

const { undeliveredMaterials, loadundeliveredMaterials } = storeToRefs(materialAssigned)
const { loadUndeliveredEquipment, undeliveredEquipments } = storeToRefs(equipmentAssigned)

onMounted( () => {
    materialAssigned.getUndeliveredMaterials()
    equipmentAssigned.getUndeliveredEquipment()
})

</script>

