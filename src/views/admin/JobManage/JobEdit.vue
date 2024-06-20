<template>
    <div class="max-w-[95%] mt-4 mx-auto">

        <div class=" flex flex-row justify-between">
            <div class="flex flex-row gap-2 mb-3 text-yellow-500">
                <div class="w-6 my-auto">
                    <PencilSquareIcon />
                </div>
                <p class=" text-lg">Editar trabajo</p>
            </div>
            <div>
                <RouterLink
                        :to="{name: 'JobHome'}"
                    >
                        <ButtonBlack class="bg-gray-50 hover:bg-gray-200">
                            <ArrowUturnLeftIcon/>
                            <template #text>
                                Regresar
                            </template>
                        </ButtonBlack>
                    </RouterLink>
            </div>
        </div>


        <div class="flex flex-col xl:flex-row gap-4">
            <div class="lg:w-4/12 w-full mx-auto">
                <div class="bg-white p-5 border-t-4 border-yellow-500 shadow-m">
                    <div v-if="jobStore.load">
                        <Spinner/>
                    </div>
                    <div v-else>
                        <img :src="selectedImage || '/trabajo.png'" alt="Imagen del trabajo" class="w-full h-auto max-h-full">
                    </div>
                </div>
                
            </div>

            <div class="w-full rounded-lg">
                <div class="bg-white border-t-4 p-y-1 border-yellow-500">
                    <p class="text-yellow-500 uppercase font-semibold ml-5 my-5 text-sm">Detalles del trabajo</p>

                    <div class="max-w-[90%] md:max-w-[75%] mx-auto mt-5">

                        <div v-if="load">
                            <Spinner />
                        </div>

                        <div v-else>

                            <FormKit id="jobForm" type="form" :actions="false"
                                incomplete-message="Revise los mensajes de los campos" 
                                v-model="formJob"
                                @submit="editHandler"
                            >

                                <div class="flex flex-col md:flex-row gap-5">
                                    <div class="w-full md:w-1/2">
                                        <FormKit type="text" label="Nombre: " name="name_job"
                                            placeholder="Nombre del trabajo" validation="required" :validation-messages="{
                                                required: 'El nombre es obligatorio'
                                            }" />
                                    </div>
                                    <div class="w-full md:w-1/2">
                                        <FormKit type="text" label="Numero de CAF: " name="num_caf"
                                            placeholder="Caso del trabajo" />
                                    </div>
                                </div>

                                <FormKit type="textarea" name="description" label="Descripción"
                                    placeholder="Añada una descripción del trabajo" validation="required"
                                    :validation-messages="{
                                        required: 'La descripción es obligatoria'
                                    }" />

                                <div class="flex md:flex-row gap-5">
                                    <div class="w-full md:w-1/2">
                                        <FormKit type="file" label="Imagen" name="before_picture" accept=".jpg,.png,.jpeg"
                                            fileRemoveIcon="close" fileItemIcon="fileImage" noFilesIcon="fileImage"
                                            @change="handleImageChange"
                                           />
                                    </div>

                                    <div class="w-full md:w-1/2">
                                         <FormKit type="date" label="Fecha del trabajo" name="start_date" 
                                            help="Modifique la fecha" 
                                         />
                                    </div>
                  
                                </div>

                                <div class="flex flex-col md:flex-row gap-5">
                                    <div class="w-full md:w-1/2">
                                        <FormKit type="select" label="Medio de comunicación" name="id_communication_type"
                                            placeholder="Ej: correo, email, etc" selectIcon="down" validation="required"
                                            :options="communicationsOption"
                                            :validation-messages="{
                                                required: 'No se selecciono un valor'
                                            }" />
                                        
                                        <FormKit type="select" label="Tipo de mantenimiento" name="id_type_maintenance"
                                            placeholder="Seleccione" selectIcon="down" validation="required"
                                            :options="maintenanceOption"
                                            :validation-messages="{
                                                required: 'No se selecciono un valor'
                                        }" />

                                        <FormKit type="select" label="Estado" name="id_job_status"
                                            placeholder="Seleccione" selectIcon="down" validation="required"
                                            :options="statusOption"
                                            :validation-messages="{
                                            required: 'No se selecciono un valor'
                                        }" />

                                    </div>

                                    <div class="w-full md:w-1/2">
                                        <FormKit type="select" label="Prioridad" name="id_job_priority"
                                            placeholder="Ej: desarrollo normal, emergente, etc" selectIcon="down" validation="required"
                                            :options="prioritiesOption"
                                            :validation-messages="{
                                                required: 'No se selecciono un valor'
                                            }" />

                                        <FormKit type="select" label="Local" name="id_establishment"
                                            placeholder="Seleccione un local" selectIcon="down" validation="required"
                                            :options="establishmentOption"
                                            :validation-messages="{
                                                required: 'No se selecciono un valor'
                                            }" />
                                            
                                        <FormKit type="select" label="Cliente" name="id_client"
                                            placeholder="Seleccione un cliente" selectIcon="down" validation="required"
                                            :options="clientsOption"
                                            :validation-messages="{
                                                required: 'No se selecciono un valor'
                                            }" />
                                    </div>
                                </div>

                            
                                <FormKit type="submit">
                                    Guardar
                                </FormKit>
                            </FormKit>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useJobStore } from '../../../stores/job'
import { useOptionJobStore } from '../../../stores/optionsJob'
import { PencilSquareIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
import { isBlobUrl } from '../../../helpers/utils'
import useImage from '../../../composables/useImage';
import Spinner from '../../../components/Spinner.vue'
import ButtonBlack from '../../../components/ButtonBlack.vue'

const { showImage, selectedImage, deleteImage, uploadImage, url} = useImage()

const route = useRoute()
const jobStore = useJobStore()
const jobOption = useOptionJobStore()
const imageOrigin = ref("")

const { formJob, load } = storeToRefs(jobStore)
const { clientsOption, 
    prioritiesOption, 
    establishmentOption, 
    communicationsOption, 
    maintenanceOption,
    statusOption } = storeToRefs(jobOption)

//Obtiene los datos en función del id
onMounted(async () => {
    formJob.value = await jobStore.getById(route.params.id)
    selectedImage.value = formJob.value.before_picture
    imageOrigin.value = formJob.value.before_picture
})

//Se ejecuta cuando se carga una imagen
const handleImageChange = (event) => {
    const file = event.target.files[0];
    showImage(file)
};

//Reestablece la foto a su valor original
watch(() => formJob.value.before_picture, (newValue, oldValue) => {

if(formJob.value.before_picture) {
    if (newValue.length === 0) {
      selectedImage.value = imageOrigin.value
   }
} 
});

const editHandler = async () => {
    
    if(selectedImage.value) {

        if(isBlobUrl(selectedImage.value)){ // Imagen nueva
            const file = formJob.value.before_picture[0].file

            if(imageOrigin.value) {
                await deleteImage(imageOrigin.value) //Eliminamos foto anterior
            }
            await uploadImage(jobStore.nameDocument, file) //Cargamos
            formJob.value.before_picture = url.value

        } else {
            formJob.value.before_picture = imageOrigin.value //Imagen Original
        }
    } else {
        formJob.value.before_picture = ''
    }
    jobStore.update(formJob.value)
    
}

//Limpiar el formulario
onUnmounted(() => {
    jobStore.formJob = {}
})
</script>
