# Fix: Mobile Sidebar Navigation

## Problema
En dispositivos móviles, el menú lateral (sidebar) se oculta automáticamente, pero no existe un mecanismo (botón de "hamburguesa") para que el usuario pueda volver a abrirlo, dejándolo estancado en la página actual.

## Solución Propuesta
Integrar el componente `SidebarTrigger` proporcionado por `@/components/ui/sidebar` dentro del componente `Header`.

## Pasos de Implementación
1. Modificar `src/components/dashboard/header.tsx`:
    - Importar `SidebarTrigger` desde `@/components/ui/sidebar`.
    - Insertar el componente `<SidebarTrigger />` dentro del `<header>`, preferiblemente al inicio, junto al título o antes del saludo.
2. Verificar el comportamiento en diferentes resoluciones.

## Impacto
Permitirá la navegación completa en dispositivos móviles.
