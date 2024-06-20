<template>
    <div class="mt-5 mx-auto max-w-[95%]  md:max-w-[90%]">
        <div class="flex flex-row text-xl gap-5 text-black items-center">
            <RouterLink :to="{ name: 'WorkHistoryEmployee' }">
                <ChevronLeftIcon class="w-5" />
            </RouterLink>

            <p class="font-semibold text-yellow-500">Trabajo: <span class="font-normal ml-3 text-gray-700">
                    {{ nameJobWork }} </span> </p>
        </div>

        <div v-if="loadWorkOrderId">
            <Spinner />
        </div>
        <div v-else>
            <p class="text-gray-700 tracking-wide text-lg font-semibold my-5">Finalización de trabajo</p>
            <div>
                <p class="text-gray-600">Fotos subidas</p>
                <div class="flex flex-wrap">
                    <div v-for="image in dataWorkOrderId.after_picture" :key="image">
                        <CardPictureFinishJob :imageUrl="image" :idWorkOrder="route.params.id" />
                    </div>
                </div>
            </div>
            <div class="border-t-2 border-gray-400 mt-5">
                <div class="flex flex-row gap-5">
                    <div class="w-1/3">
                        <div class="h-56 shadow-xl rounded-lg p-2">
                            <img :src="selectedImage ?
                                selectedImage : '/trabajo_completado.png'"
                                class="h-full w-full object-contain rounded-md" alt="Imagen de trabajo">
                        </div>
                    </div>
                    <div class="w-1/2">
                        <div class="mb-5">
                            <p class="text-gray-500 text-sm mb-2">Agrega una nueva foto</p>

                            <FormKit v-model="image" type="file" name="image" help="Seleccione una imagen (jpg, png, jpeg)"
                                accept=".jpg,.png,.jpeg" fileRemoveIcon="close" fileItemIcon="fileImage"
                                noFilesIcon="fileImage" validation="required" :validation-messages="{
                                    required: 'Se debe ingresar una imagen',
                                }" @change="handleImageChange" />
                        </div>

                        <div class="mb-10">
                            <p class="text-gray-500 text-sm mb-2">Total de horas trabajadas</p>

                            <FormKit v-model="hourJob" type="number" validation="required|min:0" :validation-messages="{
                                required: 'El valor es obligatorio',
                                min: 'El valor debe ser mayor o igual a 0',
                            }" step="0.01" help="Horas" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="mx-auto flex justify-center">
                <ButtonBlack class="bg-gray-900 hover:bg-gray-700 text-white"
                    @click="workStore.editfinishWorkOrder()"
                >
                    <CheckCircleIcon />
                        <template #text>Guardar cambios</template>
                </ButtonBlack>
            </div>
 
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, RouterLink } from 'vue-router'
import { useWorkOrderStore } from '../../../stores/workOrders'
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import useImage from '../../../composables/useImage'
import Spinner from '../../../components/Spinner.vue'
import CardPictureFinishJob from '../../../components/Utils/CardPictureFinishJob.vue'
import ButtonBlack from '../../../components/ButtonBlack.vue'

const idWorkOrder = ref()
const workStore = useWorkOrderStore()
const { dataWorkOrderId, loadWorkOrderId, nameJobWork, image, hourJob } = storeToRefs(workStore)
const { showImage, selectedImage } = useImage()

const route = useRoute()
onMounted(async () => {
    idWorkOrder.value = route.params.id
    workStore.getWorkOrderById(idWorkOrder.value).then(() => {
        hourJob.value = dataWorkOrderId.value.hour_job
    })
})

//Se ejecuta cuando se carga una imagen
const handleImageChange = (event) => {
    const file = event.target.files[0];
    showImage(file)
};

//Cambia la imagen
watch(() => image.value, (newValue, oldValue) => {
    if (newValue.length === 0) {
        selectedImage.value = ''
    }
})

onUnmounted(() => {
    hourJob.value = ''
    image.value = ''
})

</script>
