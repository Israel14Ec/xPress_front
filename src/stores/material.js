import {inject, computed, ref, onMounted  } from 'vue'
import {useRouter} from 'vue-router'
import {defineStore} from 'pinia'
import {formatCurrency} from '../helpers/utils'
import MaterialApi from '../api/MaterialApi'
import AddMaterialApi from '../api/AddMaterialApi'
import useImage from '../composables/useImage'; 

export const useMaterialStore = defineStore('materials', ()=>{

    const {uploadImage, url, deleteImage} = useImage()
    
    const load = ref(true)
    const formData = ref({})

    const materials = ref([]) 
    const historyStock = ref([])
    const loadHistory = ref(true)
    const router = useRouter()
    const toast = inject('toast')
    const nameDocument = 'material'

    //Obtiene los materiales de la db
    onMounted(async ()=> {
        try {

            const {data} = await MaterialApi.get()
            materials.value = data

        } catch (error) {
            console.log(error)
        } finally {
            load.value = false
        }   
    })

    async function getMaterial() {
        try {
            load.value = true
            const {data} = await MaterialApi.get()
            materials.value = data
        } catch (error) {
            console.log()
        } finally {
            load.value = false
        }
    }
    
    //Guarda en la db los datos
    async function createMaterial() {
        try {
            if (formData.value.image.length > 0) {//Existe una imagen cargada
                const file = formData.value.image[0].file;
                await uploadImage(nameDocument ,file) //Carga la imagen en storage
                formData.value.image = url.value //Obtiene la url
            } else {
                formData.value.image = ''
            }
            
            const {data} = await MaterialApi.create(formData.value)
            materials.value.push(data.data) //actualiza
     
            toast.open({
                message: data.msg,
                type: 'success'
            })
            router.push({name: 'MaterialHome'}) //Lo redirige
            formData.value = {} //Reinicia el formulario
            
        } catch (error) {
            console.log(error);
        }
    }

    //Obtiene un material en partícular
    async function getMaterialById(id){
        load.value = true
        try {
            const {data} = await MaterialApi.getById(id)
            return data.msg

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
            router.push({name: 'MaterialHome'})
            
        } finally {
            load.value = false
        }
    }

    //Actualiza un material
    async function updateMaterial({id_material, ...values}) {
        try {
    
            const {data} = await MaterialApi.update(id_material, values)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            getMaterial()
            router.push({name: 'MaterialHome'})
    
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }

    async function deleteMaterial(dataMaterial) {
        try {
            const urlImage = dataMaterial.image;
            console.log(urlImage)
            
            if (urlImage) {
                deleteImage(urlImage); // Borra imagen de storage
            }
    
            const { data } = await MaterialApi.delete(dataMaterial.id_material);
            materials.value = materials.value.filter(item => item.id_material !== dataMaterial.id_material)
            
            toast.open({
                message: data.msg,
                type: 'success'
            });
    
        } catch (error) {
            console.log(error);
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    } 
    
     //Computed para calcular el precio total
     const calcTotal = computed(() => {
        const unit_value = parseFloat(formData.value.unit_value);
        const stock = parseFloat(formData.value.stock);
      
        // Verificamos si son números válidos
        if (!isNaN(unit_value) && !isNaN(stock)) {

          const decimalRegex = /^\d+(\.\d{1,2})?$/; //Validamos hasta dos decimales
      
          // Verificamos que unitValue y stock cumplan con la expresión regular
          if (decimalRegex.test(unit_value.toString()) ) {
            const total = (unit_value * stock);
            formData.value.total_value = total
            return formatCurrency(total);

          } else {
            return "El valor unitario solo puede tener hasta dos decimales"
          }
        }
        return '$ 0';
    });

    //------------------ Add_material ----------------
    //Addmaterial - Agregar
    async function materialAdd(dataMaterialAdd) {

       try {
            const {data} = await AddMaterialApi.createAddMaterial(dataMaterialAdd)
            getMaterial()
             toast.open({
                message: data.msg,
                type: 'success'
            });

        } catch (error) {
            console.log(error)
            toast.open({
                message: 'No se pudo añadir el stock, intentelo de nuevo',
                type: 'error'
            });
        }
    }

    //AddMaterial - Obtener x id Material
    async function getAddmaterialBymaterialId(id) {
        try {
            loadHistory.value = true
            const { data } = await AddMaterialApi.getAddByMaterialId(id)
            historyStock.value = data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
            router.push({name: 'MaterialHome'})
        } finally { loadHistory.value = false }
    }

    //Actualizar 
    async function updateAddMaterial({id_add_material, ...values}) {
        try {
            const { data } = await AddMaterialApi.updateAddMaterial(id_add_material, values)
            const dataMaterial = data.data
            
            toast.open({
                message: data.msg,
                type: 'success'
            })

            //Actualiza los datos de historyStock
            const index = historyStock.value.findIndex(history => history.id_add_material === id_add_material)
            if (index !== -1) {
                const newValue = {
                    ...historyStock.value[index],
                    stock: values.stock,
                    description: values.description
                };
                historyStock.value[index] = newValue;
            }

            //Actualiza los datos de material
            const indexMaterial = materials.value.findIndex(material => material.id_material === dataMaterial.id_material)
            if(index !== -1) {
                const newValuesMaterial = {
                    ...materials.value[indexMaterial],
                    stock: dataMaterial.stock,
                    total_value: dataMaterial.total_value
                }
                materials.value[indexMaterial] = newValuesMaterial
            }
            
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Manda notificación de un material que se necesita para un trabajo 
    async function notiMaterialUnavailable(item) {
        try {
            
            const { data } = await MaterialApi.notiMaterialUnavailable(item)
            toast.open({
                message: data.msg,
                type: 'success'
            })
        
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
        
    }

    return {
        formData,
        materials,
        load,
        nameDocument,
        calcTotal,
        loadHistory,
        historyStock,
        createMaterial,
        getMaterialById,
        updateMaterial,
        deleteMaterial,
        materialAdd,
        getAddmaterialBymaterialId,
        updateAddMaterial,
        notiMaterialUnavailable
    }
})