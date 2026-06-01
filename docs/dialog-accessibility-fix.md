# Fix: Dialog Accessibility Warnings

## Problema
Se están reportando advertencias en la consola relacionadas con accesibilidad en el componente `Dialog` del `Header`:
1. `DialogContent` requiere un `DialogTitle` para usuarios de lectores de pantalla.
2. Falta una descripción (`DialogDescription`) o `aria-describedby` explícita.

## Solución Propuesta
Asegurar que `DialogContent` en `src/components/dashboard/header.tsx` contenga correctamente `DialogTitle` y `DialogDescription` dentro de `DialogHeader`, y verificar que no se estén omitiendo.

## Pasos de Implementación
1. Revisar `src/components/dashboard/header.tsx`.
2. Confirmar la estructura dentro de `DialogContent`. Aunque ya existen, parece haber un conflicto con cómo Radix detecta los subcomponentes o su visibilidad.
3. Asegurar el uso correcto de las etiquetas `DialogTitle` y `DialogDescription`.

## Impacto
Eliminación de advertencias en consola y mejora de accesibilidad.
