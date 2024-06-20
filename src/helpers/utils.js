// Configuración de la tabla
export const optionsTable = {
    responsive: true,
    autoWidth: false,
    select: true,
    language: {
      lengthMenu: "Mostrando _MENU_",
      search: "Buscar",
      zeroRecords: "No hay registros",
      infoEmpty: "",
      info: "Mostrando _START_ de _END_ , Total: _TOTAL_ ",
      infoFiltered: "",
      paginate: {
        first: "Primero ",
        previous: " Anterior ",
        next: " Siguiente ",
        last: " Último",
      },
      select: {
        rows: ""
      }, 
    },
    lengthMenu: [5, 10, 15],  
};

//Compara con el formato Blob
export const isBlobUrl = (url) => {
  const blobPattern = /^blob:(http:\/\/|https:\/\/)?/;
  return blobPattern.test(url);
}

// Comprueba si el valor es un Blob
export const isBlob = (value) => {
  return value instanceof Blob;
}

//Formatea el precio
export const formatCurrency = price => {
  return Number(price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
  });
}

//Configuracion tabla
export const dataTableConfig = {
  'no-data-text': "No hay datos disponibles",
  'items-per-page-text': "Mostrando",
};

export const itemsOption = [
  5, 10, 15, -1
]


//Formatear VueTailwindDataPicker
export const formatter = {
  date: 'DD/MM/YYYY',
  month: 'MMMM'
}

export function formatterDayMonthYear (date) {

  const parts = date.split("-");
  const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
  return formattedDate;
}


//Formatear la Fecha a DD/MM/YYYY
export function getCurrentDate(date) {
  let day = date.getDate().toString().padStart(2, '0');
  let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses comienzan desde 0
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

//Deshabilitar fechas posteriores a la actual
export const disableDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Establece la hora a medianoche
  return date < today; // Usa < en lugar de <= para permitir la fecha actual
}

//Convierte al formato: YYYY/MMM/DD
export function convertDateToISO(dateString) {
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}