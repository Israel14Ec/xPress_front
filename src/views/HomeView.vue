<script setup>
  import {RouterView} from 'vue-router'

</script>

<template>
    <div class="flex flex-col md:flex-row bg-gray-900">
        <div class="w-full md:w-1/4 md:h-screen flex justify-center items-center">
          <img src="../assets/img/LogoWhite.png" alt="imagen de centro comercial" class="w-1/2">
      </div>
      <main class="w-full md:w-3/4 h-screen flex justify-center items-center bg-white rounded-l-full">
        <RouterView/>  
      </main>
    </div>

</template>


<style scoped>
  
    @media(min-width: 1200px) {
      .custom-container{
        max-width: 95%;
      }
    }
  

</style>
