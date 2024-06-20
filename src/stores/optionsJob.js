import { defineStore, storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import ClientApi from '../api/ClientApi'
import PrioritiesApi from '../api/PrioritiesApi'
import EstablishmentApi from '../api/EstablishmentApi'
import CommunicationApi from '../api/CommunicationApi'
import MaintananceApi from '../api/MaintananceApi'
import StatusJobApi from '../api/StatusJobApi'
import { useClientStore } from './client'
import { useJobPrioritiesStore } from './jobPriorities'
import { useEstablishmentStore } from './establishment'
import { useCommunicationStore } from './communication'
import { useMaintenanceStore } from './maintenance'
import { useStatusJobStore} from './statusJob'

export const useOptionJobStore = defineStore('options', () => {
    
    const isLoaded = ref(false)
    
    const clientStore = useClientStore()
    const prioritiesStore = useJobPrioritiesStore()
    const establishmentStore = useEstablishmentStore()
    const communicationStore = useCommunicationStore()
    const maintenanceStore = useMaintenanceStore()
    const statusStore = useStatusJobStore()

    const { clientsOption } = storeToRefs(clientStore)
    const { prioritiesOption } = storeToRefs(prioritiesStore)
    const { establishmentOption } = storeToRefs(establishmentStore)
    const { communicationsOption } = storeToRefs(communicationStore)
    const { maintenanceOption } = storeToRefs(maintenanceStore)
    const { statusOption } = storeToRefs(statusStore)

    
    const loadData = async () => {

        if (isLoaded.value) return;

        try {
            const [
                { data: dataClient },
                { data: dataPrioritie },
                { data: dataEstablishment },
                { data: dataCommunication },
                { data: dataMaintenance },
                { data: dataStatus }
            ] = await Promise.all([
                ClientApi.get(),
                PrioritiesApi.get(),
                EstablishmentApi.get(),
                CommunicationApi.get(),
                MaintananceApi.get(),
                StatusJobApi.get()
            ]);

            clientsOption.value = dataClient.map(option => ({
                label: option.name_client,
                value: option.id_client
            }));
            
            prioritiesOption.value = dataPrioritie.map(option => ({
                label: option.name,
                value: option.id_job_priority
            }));
            
            establishmentOption.value = dataEstablishment.map(option => ({
                label: option.name_establishment,
                value: option.id_establishment
            }));
            
            communicationsOption.value = dataCommunication.map(option => ({
                label: option.name_communication,
                value: option.id_communication_type
            }));

            maintenanceOption.value = dataMaintenance.map(option => ({
                label: option.name,
                value: option.id_type_maintenance
            }));

            statusOption.value = dataStatus.map(option => ({
                label: option.name,
                value: option.id_job_status
            }));

        } catch (error) {
            console.error(error);
        } finally {
            isLoaded.value = true;
        }
    };

    onMounted( () => {
        loadData()
    });

    return {
        clientsOption,
        prioritiesOption,
        establishmentOption,
        communicationsOption,
        maintenanceOption,
        statusOption

    };
});