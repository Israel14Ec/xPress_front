<template>
  <div 
    class="mt-1 rounded-lg p-1 mx-3 hover:bg-gray-500"
    :class="isRouteActive ? 'bg-blue-100 border-blue-500' : ''"
  >
    <RouterLink :to="{ name: to }">
      <div class="text-gray-50">
        <div class="flex flex-row"
          :class="isRouteActive ? 'text-blue-500 hover:text-gray-50' : ''">
        
          <div class="ml-2 w-5">
            <slot></slot>
          </div>
          <p class="ml-3 text-sm">
            <slot name="text"></slot>
          </p>
        </div>
      </div>
    </RouterLink>
  </div>
</template>

  
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
  to: {
    type: String,
  },
  parentRouteName: {
    type: String,
    default: null,
  },
  parent: {
    type: String,
    default: null,
  },
});

const getParentRouteName = () => {
  const parentRoute = route.matched[route.matched.length - 2];
  return parentRoute ? parentRoute.name : null;
};

//Comprueba si la ruta esta activada
const isRouteActive = computed(() => {
  const routeParent = getParentRouteName();
  if (props.parent && routeParent === props.parent) {
    return true;
  } else if (routeParent === props.parentRouteName) {
    return route.name === props.to;
  } else {
    return routeParent === props.to;
  }
});

</script>
  