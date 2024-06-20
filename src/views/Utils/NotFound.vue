<template>

    <div class="flex items-center bg-white  justify-center h-screen mx-auto">
        <div class="rounded-lg mt-5 p-2">
            <div class="p-5 shadow-slate-100 shadow-xl">
                <div class="flex flex-col md:flex-row items-center">
                    <div class="">
                        <p class="text-gray-700 text-3xl font-bold">Ooops...</p>
                        <p class="text-gray-700 text-4xl mt-3">Página no encontrada</p>
                        <div class="mt-16">
                            <RouterLink :to="{name: 'login'}">
                                <div class="flex flex-row justify-center w-60 items-center gap-3 bg-yellow-500 p-3 rounded-lg text-white 
                                    cursor-pointer">
                                    <p class="font-semibold text-xl">Regresar</p>
                                    <ArrowLongRightIcon 
                                        class="w-7 font"    
                                    />
                                </div>
                            </RouterLink>
                        </div>
                    </div>
                    <div class="mt-5">
                        <div class="cloud-container rounded-lg">
                            <img src="/error404.png" alt="Error 404" />
                        </div>
                    </div>
             
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>

import { RouterLink } from 'vue-router'
import { ArrowLongRightIcon } from '@heroicons/vue/24/solid'

</script>

<style scoped>
.cloud-container {
  width: 500px; /* Ajusta el ancho según sea necesario */
  height: 300px; /* Ajusta la altura según sea necesario */
  background-color: #EAB308; /* Color de fondo de la nube */
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cloud-container::before {
  content: '';
  position: absolute;
  top: -50px; /* Ajusta la posición vertical */
  left: -50px; /* Ajusta la posición horizontal */
  width: 100px; /* Ajusta el ancho del círculo */
  height: 300px; /* Ajusta la altura del círculo */
  background-color: white; /* Color del círculo */
  border-radius: 50%;
}

.cloud-container::after {
  content: '';
  position: absolute;
  top: -30px; /* Ajusta la posición vertical */
  right: -30px; /* Ajusta la posición horizontal */
  width: 80px; /* Ajusta el ancho del círculo */
  height: 80px; /* Ajusta la altura del círculo */
  background-color: white; /* Color del círculo */
  border-radius: 50%;
}

img {
  max-width: 100%; /* La imagen se ajustará automáticamente dentro del contenedor */
}
</style>