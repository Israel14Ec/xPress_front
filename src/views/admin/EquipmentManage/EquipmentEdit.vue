<template>
    <div class="max-w-[95%] mt-4 mx-auto">

        <div class=" flex justify-between items-center mb-5">

            <div class="flex flex-row gap-2 mb-3 text-yellow-500">
                <div class="w-6 my-auto">
                    <PencilSquareIcon/>
                </div>
                <p class="text-lg">Editar equipo</p>
            </div>

            <RouterLink
                :to="{name: 'EquipmentHome'}"
                >
                <ButtonBlack>
                    <ArrowUturnLeftIcon/>
                    <template #text>Regresar</template>
                </ButtonBlack>
            </RouterLink>
        </div>


        <div class="flex flex-col xl:flex-row gap-4">
            <div class="lg:w-4/12 w-1/2 mx-auto">
                <div class="bg-white p-2 border-t-4 border-yellow-500 rounded-lg shadow-md">
                    <div>
                        <div v-if="equipmentStore.load">
                           <Spinner/>
                        </div>
                        <div v-else class="my-auto">
                            <div class="">
                               <img :src="selectedImage || '/equipamiento.png'" alt="Imagen del material" class="w-full h-auto max-h-full">
                            </div>
                       </div>
                    </div>
                </div>
            </div>

            <div class="w-full rounded-sm">
                <div class="bg-white border-t-4 py-1 rounded-lg border-yellow-500">
                    <p class="text-yellow-500 font-semibold ml-5 my-5 text-sm uppercase">Detalles del equipo a editar</p>
                    <div class="max-w-[90%] md:max-w-[75%] mx-auto">
                        <FormKit
                            id="equipmentForm"
                            v-model="formEquipment"
                            type="form"
                            :actions="false"
                            @submit="editHandler"
                            incomplete-message="Complete todos los campos"
                        >

                            <div class="flex flex-col">
                                <div class="flex flex-row gap-5">
                                    <div class="w-1/2">
                                        <FormKit
                                            type="text"
                                            label="Nombre: "
                                            name="name_equipment"
                                            placeholder="Ingrese el nombre"
                                            validation="required"
                                            :validation-messages = "{
                                                required: 'El nombre es obligatorio'
                                            }"
                                        />
                                    </div>

                                    <div class="w-1/2">
                                        <FormKit
                                            type="file"
                                            label="Imagen"
                                            name="image"
                                            help="Seleccione una imagen (jpg, png, jpeg)"
                                            accept=".jpg,.png,.jpeg"
                                            @change="handleImageChange"
                                            fileRemoveIcon="close"
                                            fileItemIcon="fileImage"
                                            noFilesIcon="fileImage"

                                        />
                                    </div>

                                </div>
                                <div class="">
                                    <FormKit
                                        type="textarea"
                                        name="description"
                                        label="Descripción"
                                        placeholder="Añada una descripción del material"
                                        validation="length:1,300"
                                        :validation-messages="{
                                            length: 'Se admiten máximo 300 caracteres',
                                        }"
                                        
                                    />
                                </div>

                                <div class="flex flex-row gap-5">
                                    <div class="w-1/2">
                                        <FormKit
                                            type="select"
                                            label="Estado del material"
                                            name="id_status_equipment"
                                            placeholder="Seleccione un estado"
                                            :options="equipmentStore.statusOptions"
                                            selectIcon="down"
                                            validation="required"
                                            :validation-messages="{
                                                required: 'No se selecciono un estado'
                                            }"
                                        />
                                  
                                    </div>
                                    <div class="w-1/2">
                                        <FormKit
                                            type="select"
                                            label="Tipo de equipamiento"
                                            name="id_type_equipment"
                                            placeholder="Seleccione el tipo"
                                            :options="equipmentStore.typeOptions"
                                            selectIcon="down"
                                            validation="required"
                                            :validation-messages="{
                                                required: 'No se selecciono un estado'
                                            }"
                                            @change="handleImageChange"
                                        />

    
                                    </div>
                                </div>
                                <FormKit
                                    type="number"
                                    label="Precio"
                                    name="unit_value"
                                    number
                                    placeholder="$$"
                                    validation="required|min:1"
                                        :validation-messages="{
                                        required: 'El precio es obligatorio',
                                        min: 'El precio debe ser mayor que 0',
                                    }"
                                    step="0.01"
                                />
                            </div>
                            <FormKit
                                type="submit"
                            >
                                Guardar
                            </FormKit>
                        </FormKit>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup>

    import { ref, onMounted, onUnmounted, watch } from "vue";
    import { RouterLink, useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia';
    import { PencilSquareIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
    import { useEquipmentStore } from '../../../stores/equipment'
    import { isBlobUrl } from '../../../helpers/utils'
    import useImage from '../../../composables/useImage';
    import ButtonBlack from "../../../components/ButtonBlack.vue";
    import Spinner from "../../../components/Spinner.vue";

    const equipmentStore = useEquipmentStore()
    const { showImage, selectedImage, uploadImage, url, deleteImage} = useImage()
    const { formEquipment } = storeToRefs(equipmentStore);
    const route = useRoute()
    const imageOrigin = ref("")
    
    //Carga los datos
    onMounted(async() => {
        formEquipment.value = await equipmentStore.getEquipmentById(route.params.id)
        selectedImage.value = formEquipment.value.image
        imageOrigin.value = formEquipment.value.image
    })

    onUnmounted(() => {
        formEquipment.value = {}
    })

    const handleImageChange = (event) => {
       const file = event.target.files[0];
       showImage(file)
    };

    const editHandler = async () => {

        try {               
            if(selectedImage.value) {
            
                if(isBlobUrl(selectedImage.value)) { //La imagen es nueva
                    const file = formEquipment.value.image[0].file 

                    if(imageOrigin.value) {
                        await deleteImage(imageOrigin.value) //Eliminamos foto anterior
                    }
                    await uploadImage(equipmentStore.nameDocument, file) //Cargamos la imagen
                    formEquipment.value.image = url.value

                    // Limpieza de la URL de blob después de la carga
                    URL.revokeObjectURL(selectedImage.value);

                } else { //Es la imagen que se guardo en la DB
                    formEquipment.value.image = imageOrigin.value //Imagen original
                }
            } else {
                formEquipment.value.image = ''
            }

            equipmentStore.updateEquipment(formEquipment.value)

        } catch (error) {
            console.log(error)
        }
      

        
    }

    //Reestablece la foto a su valor original 
    watch(() => formEquipment.value.image, (newValue, oldValue) => {
            if(formEquipment.value.image) {
                if (newValue.length === 0) {
                selectedImage.value = imageOrigin.value
            }
        } 
    });
    


</script>

