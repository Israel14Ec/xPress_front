import { ref} from 'vue'
import { OpenStreetMapProvider } from "leaflet-geosearch";
import Swal from 'sweetalert2'

export default function useLocationMap(){

    const zoom = ref(15)
    const center = ref([-0.183054, -78.483988]) //Direción Inicial
    const searchQuery = ref(""); //Consulta de dirección

    //Configuación para la busqueda
    const provider = new OpenStreetMapProvider({
        params: {
          viewbox: "-79.647,-0.593,-78.170,-0.014", //Delimitar 
          bounded: 1, // Limitar resultados
        },
    });

    const searchLocation = async () => {
        const results = await provider.search({ query: searchQuery.value });
        if (results.length > 0) {
          const { x, y } = results[0];
          center.value = [y, x];
        } else {
            Swal.fire("No hay resultados")
        }
    }
 

    function pin(e){
        const marker = e.target.getLatLng()
        center.value = [marker.lat, marker.lng]
    }

    return {
        zoom,
        center,
        searchQuery,
        pin,
        searchLocation
    }
}