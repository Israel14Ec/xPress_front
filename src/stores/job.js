import { defineStore, storeToRefs } from 'pinia' 
import { ref, computed, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './auth';
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getCurrentDate } from '../helpers/utils'
import useImage from '../composables/useImage';
import JobApi from '../api/JobApi'


export const useJobStore = defineStore('jobs', () => {
    
    const dateValue = ref(getCurrentDate(new Date())) //Valor de la fecha
    const formJob = ref({})
    const toast = inject('toast')
    const load = ref()
    const router = useRouter()
    const jobData = ref({}) //Carga el Job para mostrar
    const jobDataAssign = ref([]) //Datos para el trabajo x Departamento 
    const depDataSelect = ref([])
    const nameDocument = 'trabajos'
    const authStore = useAuthStore()
    
    const { uploadImage, url, deleteImage } = useImage()
    const { userData } = storeToRefs(authStore)

    //---------------- Datos para la tabla paginada
    const currentPage = ref(1); // Página actual
    const jobHistoryData = ref([]) //Datos traidos 
    const total = ref(0)
    const loadPaginate = ref(true)
    const selectedItemsPerPage = ref(5) //item seleccionado
    const select = ref()
    const date = ref()
    const search = ref('')

    //Crea un trabajo
    async function createJob() {
        try {
          
            if( formJob.value.before_picture.length > 0) { //Hay Imagen
                const file = formJob.value.before_picture[0].file;
                await uploadImage(nameDocument ,file) //Carga la imagen
                formJob.value.before_picture = url.value //Agrega el valor del url al objeto
               
            } else { //No hay imagen
                formJob.value.before_picture = ''
            }

            formJob.value.start_date = dateValue.value //Agrega la fecha
            const { data } = await JobApi.create(formJob.value)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            router.push({name: 'JobHome'})
            
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
            
        }
    }

    //Obtiene segun la fecha (start_date) y status, el id es el estado
    async function getByDate(id) {
        try {
            const { data } = await JobApi.getByDate(dateValue.value, id)
            return data
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        } 
    }

    //Obtiene el trabajo en función de la fecha o el id estado, paginado ----------------
    async function getJobByStatusOrDate() {
        try {
            loadPaginate.value = true
            const { data } = await JobApi.getJobByStatusOrDate(
                selectedItemsPerPage.value, 
                currentPage.value, 
                date.value,
                select.value
            )
               
            jobHistoryData.value = data.data
            total.value = data.total

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        } finally {
            loadPaginate.value = false
        }
    }

    //Función para cambiar la página de la tabla --
    function paginationUpdateHandler(options) {
        if (currentPage.value !== options.page) {
          currentPage.value = options.page;
          getJobByStatusOrDate();
        }
      }
      

    //watch para cambiar el select
    watch([date, select], () => {
        getJobByStatusOrDate();
    });

    //Obtiene el trabajo segun el id
    async function getById(id) {
        
        try {
            load.value = true
            const { data } = await JobApi.getById(id)
            return data
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
            router.push({name: 'JobHome'})
        }  finally {
            load.value = false
        }
    }


    //Obtiene los datos de trabajo con los joins x ID
    async function getJobByIdJoin(id) {
        try {
            load.value = true
            const { data } = await JobApi.getByIdJoin(id, userData.value.id_department)
            return data

        } catch (error) {
            router.push({name: 'JobHome'})
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        } finally {
            load.value = false
        }
    }

    //Actualiza el trabajo
    async function update({id_job, ...values}) {
        try {
            const { data } = await JobApi.updateJob(id_job, values)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            router.push({name: 'JobHome'})

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Elimina un trabajo
    async function deleteJob(id) {
        try {
            const { data } = await JobApi.deleteLogicJob(id)
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

    //--------------------------------------- ASINAR TRABAJOS --------------------------------------------

    //Selecciona un departamento
    function departmentSelect(data) {
        try {

            const existIndex = depDataSelect.value.findIndex(department => department.id_department === data.id_department);
            // Si no existe, agregarlo al array
            if (existIndex === -1) {
                depDataSelect.value.push(data);
            } 
        } catch (error) {
            console.log(error);
        }
    }
    

    //Quita un departamento seleccionado 
    function depDelete(id) {
        try {
            const index = depDataSelect.value.findIndex(dep => dep.id_department === id);
            if (index !== -1) {
                depDataSelect.value.splice(index, 1);
            }
        } catch (error) {
            console.log(error)
        }
    }

    //Asignar departamento
    async function assignDepartment (id_job) {
        try {
            const id_departments = depDataSelect.value.map(department => department.id_department);
            const requestData = {
                id_job,
                id_departments
            };
            const { data } = await JobApi.assignDepartment(requestData)
            router.push({name: 'JobHome'})
            toast.open({
                message: data.msg,
                type: 'success'
            })

            updateStatusjob(id_job)

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Actualizar estado del trabajo
    async function updateStatusjob(id) {
        try {
            const { data } = await JobApi.updateStatus(id)

            setTimeout(() => {
                toast.open({
                    message: data.msg,
                    type: 'info'
                })
            }, 2000);
        
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //Revertir el estado de trabajo
    async function reserveStatusJob(idJob) {
        try {
            const { data } = await JobApi.reverseStatusJob(idJob)
            toast.open({
                message: data.msg,
                type: 'info'
            })
        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

    //--------------------- Jefe de departamento ---------------

    //Obtiene los trabajos en función de Departamento x Fecha x Estado
    async function getJobDepartmentByDate (id_department, id_status ) {
        
        try {
            load.value = true
            const { data } = await JobApi.getJobDepartmentDate(dateValue.value, id_department, id_status)
            jobDataAssign.value = data

        } catch (error) {
            console.log(error)
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        } finally {
            load.value = false
        }
    }

    //Formatea a texto la fecha
    const formattedDate = computed( () => {
        const parsedDate = parse(dateValue.value, 'dd/MM/yyyy', new Date());
        const dateText = format(parsedDate, 'EEEE, d \'de\' MMMM', { locale: es });
        return dateText.charAt(0).toUpperCase() + dateText.slice(1);
    });

    //Calcula el valor de longitud para jobDataAssign
    const calcjobDataAssign = computed (() => {
        return jobDataAssign.value.length
    })

    return {
        dateValue,
        formattedDate,
        formJob,
        load,
        nameDocument,
        jobData,
        depDataSelect,
        jobDataAssign,
        calcjobDataAssign,
        selectedItemsPerPage,
        jobHistoryData,
        loadPaginate,
        total,
        select,
        date,
        createJob,
        getByDate,
        getJobByStatusOrDate,
        paginationUpdateHandler,
        getById,
        getJobByIdJoin,
        update,
        deleteJob,
        departmentSelect,
        depDelete,
        assignDepartment,
        updateStatusjob,
        getJobDepartmentByDate,
        reserveStatusJob
        
    }
}) 