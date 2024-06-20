<script setup>
  import {RouterView} from 'vue-router'
</script>

<template>
  <div class="font-inter">
    <RouterView/>
  </div>
  
</template>

<style>
  @import 'datatables.net-dt';
  .v-data-table__th--sortable {
    @apply text-gray-600 font-semibold text-center bg-gray-100
  }


/*Barra de scroll */
::-webkit-scrollbar {
  width: 5px; /* Ancho de la barra de desplazamiento */
}

::-webkit-scrollbar-track {
  background: #FFF; /* Color de fondo del track */
}

/* Estilo para el handle de la barra de desplazamiento */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Estilo para el handle de la barra de desplazamiento al pasar el mouse */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>



