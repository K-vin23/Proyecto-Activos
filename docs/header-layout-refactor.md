# Refactor: Move Header to DashboardLayout

## Problema
El componente `Header` se renderiza manualmente dentro de cada página, lo que causa problemas de posicionamiento (solapamiento) y scroll inconsistente respecto a la `Sidebar`.

## Solución
Mover el componente `Header` al `DashboardLayout`, específicamente dentro de `SidebarInset`, para centralizarlo y asegurar que el scroll y el z-index sean consistentes.

## Pasos de Ejecución
1.  Modificar `src/components/dashboard-layout.tsx` para importar y renderizar `<Header />` dentro de `<SidebarInset>`.
2.  Eliminar las importaciones y el uso de `<Header />` en las páginas:
    *   `src/app/dashboard/page.tsx`
    *   `src/app/empresas/page.tsx`
    *   `src/app/users/page.tsx`
    *   `src/app/assets/page.tsx`
3.  Verificar que el layout se comporte correctamente en todos los dispositivos.

## Impacto
Estructura de layout más limpia, corrección del problema de sobreposición en scroll móvil, y mayor mantenibilidad.
