<template>
    <div class="max-w-[95%] mt-4 mx-auto">
        <div class="flex lg:flex-row flex-col items-center justify-center gap-10">
            
            <CardOptions 
                class="border-b-2 border-blue-500 hover:bg-blue-100 text-gray-700 w-72"
                :class="[option === 1 ? 'bg-blue-100' : 'bg-white']"
                @click="optionSelect(1)"
            >
                <PlusCircleIcon />
                <template #text>Otorgar acceso</template> 
                <template #description>Agregue a los empleados del departamento.</template>
            </CardOptions>

            <CardOptions 
                class="border-b-2 border-gray-500 hover:bg-gray-100 text-gray-700 w-72"
                :class="[option === 2 ? 'bg-gray-200' : 'bg-white']"
                @click="optionSelect(2)"
            >
                <PlusCircleIcon />
                <template #text>Quitar acceso</template> 
                <template #description>Quite el acceso a los empleados del departamento.</template>
            </CardOptions>
        </div>

        <div class="mt-10">
            <div v-if="option === 1">
                <AddWorker/>
            </div>
            <div v-if="option === 2">
                <EditWorker />
            </div>
        </div>
        
    </div>
</template>

<script setup>

import { ref } from 'vue'
import {PlusCircleIcon} from "@heroicons/vue/24/solid";
import CardOptions from '../../components/CardOptions.vue'
import AddWorker from "../../components/HeadComponents/AddWorker.vue";
import EditWorker from '../../components/HeadComponents/EditWorker.vue'

const option = ref(1)

const optionSelect = (select)=> {
  option.value = select
}

</script>
