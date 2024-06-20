import {defineStore} from 'pinia'
import {ref, onMounted, computed, inject } from 'vue'
import Swal from 'sweetalert2'
import DepartmentApi from '../api/DepartmentApi'


export const useDepartmentStore = defineStore('departments', ()=> {

    const departments = ref([])
    const departmentUsers = ref([])
    const departmentWithoutAdmin = ref([])
    const toast = inject('toast')
    const load = ref()
    const search = ref("")

    onMounted(async () => {
        try {
            load.value = true
            const {data} = await DepartmentApi.get() //Obtengo el valor de la API para departamentos
            departments.value = data 
            const {data: dataDepartment} = await DepartmentApi.getDepartmentUsers() //Departamento x usuario
            departmentUsers.value = dataDepartment 

        } catch (error) {
            console.log(error)
        } finally {
            load.value = false
        }
    })

    //Obtiene el departamento x cantidad de usuarios menos el de administración
    async function getDepartment() {
        try {
            const { data } = await DepartmentApi.getDepartment()
            departmentWithoutAdmin.value = data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Obtengo el valor del item.id_department e item.name_department en un JSON, para usar en el select
    const departmentOptionsObject = computed(() => {
        return departments.value.reduce((acc, item) => {
            acc[item.id_department] = item.name_department;
            return acc;
        }, {});
    });
    
    //Creación de un nuevo departamento
    async function createDepartment(dataForm) {
        try {
            const {data} = await DepartmentApi.createDepartment(dataForm)
            console.log(data)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            departmentUsers.value.push(data.data)
            
            //departmentUsers.value = departmentByUsers();
        } catch (error) {
            console.log(error)
        }
    }

    //Eliminar un departamento (Solo si no les ha asigando personal)
    async function deleteDepartment ({id_department}) {
        try {
            const result = await Swal.fire({
                title: 'Eliminar departamento',
                text: 'Se eliminara el departamento',
                showDenyButton: true,
                confirmButtonText: 'Aceptar',
                denyButtonText: 'Cancelar',
            });
    
            if (result.isConfirmed) {
                const { data } = await DepartmentApi.deleteDepartment(id_department);
                departmentUsers.value = departmentUsers.value.filter(dept => dept.id_department !== id_department);
                toast.open({
                    message: data.msg,
                    type: 'success'
                });
                
            }
        } catch (error) {
            console.log(error);
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            });
        }
    }

    //Editar el departamento seleccionado
    async function editDepartment(formData) {
        
        const { value: formValues } = await Swal.fire({
            title: "Editar departamento",
            html: `<form class="flex flex-col items-start">
                    <div class="flex items-center gap-2">
                      <label class="text-blue-500" for="name_department">Nombre: </label>
                      <input 
                        id="name_department" 
                        type="text" 
                        class=" bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                        value="${formData.name_department}" />
                    </div>
                  
                    <label class="text-blue-500 mt-4 mb-1" for="description">Descripción: </label>
                    <textarea 
                        id="description" 
                        class="w-full h-32 bg-gray-100 p-1 border border-gray-50 text-gray-500 rounded-md focus:outline-none focus:bg-white" 
                    >${formData.description}</textarea>
                    <div id="descriptionCounter" class="text-sm text-gray-600">0/300</div> 
                  </form>`,
            
            showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar',
            customClass: {
                popup: 'rounded-2xl'
            },
            didOpen: () => {
                const descriptionTextarea = document.getElementById('description');
                const descriptionCounter = document.getElementById('descriptionCounter');
                const maxChars = 300; // Límite de caracteres

                // Establece el contador con la longitud actual de la descripción
                descriptionCounter.textContent = `${descriptionTextarea.value.length}/${maxChars}`;

                descriptionTextarea.addEventListener('input', () => {
                    let textLength = descriptionTextarea.value.length;
                    if (textLength > maxChars) { 
                        descriptionTextarea.value = descriptionTextarea.value.substring(0, maxChars);
                        textLength = maxChars; 
                    }
                    descriptionCounter.textContent = `${textLength}/${maxChars}`;
                });
            },
        });
        //Confirmar editar
        if (formValues) {

            const updateValues = {
                name_department: document.getElementById('name_department').value,
                description: document.getElementById('description').value
            }
            
            try {
                const {data} = await DepartmentApi.updateDepartment(formData.id_department, updateValues )
                toast.open({
                    message: data.msg,
                    type: 'success'
                })
                
                const index = departmentUsers.value.findIndex(c => c.id_department === formData.id_department);
                if (index !== -1) {
                    departmentUsers.value[index] = {...departmentUsers.value[index], ...data.data};
                }

            } catch (error) {
                console.log(error)
            }
        } 
    }

    //Computed para filtrar por el nombre
    const filterDepartment = computed(() => {
        const searchTerm = search.value.toLowerCase().trim(); 
        
        if (!searchTerm) {
            return departmentUsers.value;
        }

        return departmentUsers.value.filter((department) => {
            const departments = department.name_department.toLowerCase();
            return departments.includes(searchTerm);
        });
    })

    return {
        departments,
        departmentOptionsObject,
        departmentUsers,
        load,
        search,
        departmentWithoutAdmin,
        createDepartment,
        deleteDepartment,
        editDepartment,
        getDepartment,
        filterDepartment
    }
})