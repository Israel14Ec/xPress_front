import {defineStore} from 'pinia'
import {inject, ref, computed} from 'vue'
import Swal from 'sweetalert2'
import EstablishmentApi from '../api/EstablishmentApi'
import useLocationMap from '../composables/useLocationMap'

export const useEstablishmentStore = defineStore('establishments', () => {

    const {searchLocation, searchQuery, center, zoom} = useLocationMap()
    const toast = inject('toast')
    const load = ref()
    const establishments = ref([])
    const establishmentOption = ref([])
    const search = ref("")
    

    //Obtiene un establecimiento

    async function getEstablishment () {
        try {
            load.value = true
            const {data} = await EstablishmentApi.get()
            establishments.value = data
            establishmentOption.value = data.map(option => ({
                label: option.name_establishment,
                value: option.id_establishment
            }));

        } catch (error) {
            console.log(error)
        } finally {
            load.value = false
        }

    }

    //Crea un establecimiento
    async function createEstablishment (dataForm) {

        try {
            const {data} = await EstablishmentApi.create(dataForm)
            toast.open({
                message: data.msg,
                type: 'success'
            })

            getEstablishment()

        } catch (error) {
            console.log(error)
        }
    }

    //Edita un establecimiento  
    async function editEstablishment(dataForm) {

        center.value = dataForm.location

        await Swal.fire({
            title: "Editar establecimiento",
            html: `
            <div class="flex flex-col items-start">
            <div class="flex items-center gap-2">
                <p class="text-blue-500">Nombre: </p>
                <input 
                    id="swal-input1" 
                    type="text" 
                    class="w-80 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    value="${dataForm.name_establishment}" 
                />
            </div>
      
            <p class="text-blue-500 mt-4 mb-1">Descripción: </p>
            <textarea 
                id="swal-input2" 
                class="w-full h-28 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
            >${dataForm.description}</textarea>
            <p class="text-blue-500 mt-4 mb-1 text-center">Ubicación </p>
                <div class="mb-4">
                    <input 
                        type="text" 
                        id="swal-input3" 
                        class="rounded-lg bg-gray-100 p-1 border border-gray-50 text-gray-500 focus:outline-none focus:bg-white"  
                    />
                    <button 
                        class="ml-0 md:ml-5 bg-blue-400 rounded-lg py-1 px-3 text-white" 
                        id="searchButton">
                        Buscar
                    </button>
                </div>
            </div>
            <div id="mapContainer" class="w-full h-60"></div>
            `, 
            showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar',
            didOpen: async () => {
                const mapContainer = document.getElementById("mapContainer");
                window.map = L.map(mapContainer).setView(center.value, zoom.value);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(window.map);
            
                window.marker = L.marker(center.value, { draggable: true }).addTo(window.map);
                document.getElementById('searchButton').addEventListener('click', async () => {
                    searchQuery.value = document.getElementById('swal-input3').value;
                    await searchLocation();
            
                    // Actualiza el mapa y la posicion del marcador
                    window.map.setView(center.value, zoom.value);
                    window.marker.setLatLng(center.value);
                });
            },
            preConfirm: async () => {
                
                try {
                    //Obtengo los valores
                    dataForm.name_establishment = document.getElementById('swal-input1').value
                    dataForm.description = document.getElementById('swal-input2').value
                    dataForm.location = window.marker.getLatLng()

                    const {data} = await EstablishmentApi.update(dataForm,dataForm.id_establishment )
                    toast.open({
                        message: data.msg,
                        type: 'success'
                    })
               
                } catch (error) {
                    console.log(error)
                }    
            },
            
            
        });
        
    }


    
    //Elimina un establecimiento
    async function deleteEstablishment(dataForm) {
        try {

            const result = await Swal.fire({
                title: 'Eliminar establecimiento',
                text: `Se eliminara el establecimiento ${dataForm.name_establishment}`,
                showDenyButton: true,
                confirmButtonText: 'Aceptar',
                denyButtonText: 'Cancelar',
            }); 

            if (result.isConfirmed) {
                const {data} = await EstablishmentApi.delete(dataForm.id_establishment)
                establishments.value = establishments.value.filter(est => est.id_establishment !== dataForm.id_establishment);
                toast.open({
                    message: data.msg,
                    type: 'success'
                })
            }

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    
    //Watch para filtrar por el nombre
    const filterEstablishments = computed(() => {
        const searchTerm = search.value.toLowerCase().trim();
      
        if (!searchTerm) {
          return establishments.value;
        }
      
        return establishments.value.filter((establishment) => {
          const establishmentName = establishment.name_establishment.toLowerCase();
          return establishmentName.includes(searchTerm);
        });
      });
      
    return {
        establishments,
        load,
        search,
        establishmentOption,
        getEstablishment,
        createEstablishment,
        editEstablishment,
        deleteEstablishment,
        filterEstablishments
    }
})