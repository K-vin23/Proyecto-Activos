# Fix: Header Overlap on Mobile

## Problema
Al hacer scroll en dispositivos móviles, el `Header` se sobrepone incorrectamente a elementos del layout o la sidebar, debido a una configuración de `z-index` y `sticky` que no está bien aislada del contenido.

## Solución Propuesta
Ajustar las clases de Tailwind en `src/components/dashboard/header.tsx` para asegurar que el `Header` se comporte correctamente en dispositivos móviles al hacer scroll y no se superponga indebidamente.

## Pasos de Implementación
1. Revisar las clases del `<header>` en `src/components/dashboard/header.tsx`.
2. Asegurar que el `z-index` y el contexto de apilamiento sean adecuados.
3. Posiblemente ajustar el `z-index` de la sidebar si es necesario.

## Impacto
Eliminación del solapamiento visual en móviles.
