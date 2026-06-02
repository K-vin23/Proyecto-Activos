# Refactor: Direct API Integration in Catalog Page

## Problema
La página de Catálogo (`app/catalogo/page.tsx`) actualmente utiliza datos mock (`initialCatalog`) y no consume la API real para mostrar los modelos de activos y componentes.

## Solución
Consumir directamente los servicios de la API (`catalogService`) dentro del componente `CatalogoPage` para obtener datos reales, en lugar de utilizar hooks personalizados (dado que esta información no se reutilizará en otros componentes).

## Pasos de Ejecución
1.  Importar `catalogService` en `src/app/catalogo/page.tsx`.
2.  Implementar `useEffect` para llamar a `catalogService` (ej. `getModels`, `getMemories`, `getDisks`, `getProcessors`) al montar el componente.
3.  Actualizar el estado del componente con los datos recibidos de la API.
4.  Implementar el manejo de estados de carga (`isLoading`) y errores (`toast`).
5.  Asegurar que las funciones de creación (`addItem`) y eliminación (`removeItem`) utilicen los métodos del `catalogService` (`createModel`, `createComponents`, etc.) en lugar de manipular el estado local directamente.

## Impacto
La página mostrará datos en tiempo real provenientes de la API, cumpliendo con la funcionalidad requerida para el proyecto de grado.
