import axios from 'axios'

const api = axios.create({
    //Me conecto a la API
    baseURL: import.meta.env.VITE_API_URL //Uso la variable de entorno
})

//Usamos un interceptor para agregar la cabecera HTTP con el token
api.interceptors.request.use((config)=> {

    const token = localStorage.getItem('AUTH_TOKEN')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api;
