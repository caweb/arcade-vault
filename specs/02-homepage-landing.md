# SPEC 02 — Homepage landing de Arcade Vault

> **Status:** Implemented
> **Depends on:** SPEC 01
> **Date:** 2026-08-27
> **Objective:** Convertir `/` en el landing visual de Arcade Vault y mover la Biblioteca a `/games`, conservando la navegación, los datos mock y las interacciones locales definidas por la plantilla `references/templates/home-about/`.

## Scope

**In:**

- Reemplazar la Biblioteca actual de `/` por el landing definido en `references/templates/home-about/home.jsx`.
- Crear la ruta `/games` para conservar la Biblioteca implementada en SPEC 01.
- Mantener operativas las rutas `/games/[id]`, `/games/[id]/play`, `/auth` y `/hall-of-fame`.
- Implementar todas las secciones del landing: hero, beneficios, juegos disponibles, estadísticas, actividad en vivo, precios/FAQ y CTA final.
- Conservar los textos, cifras, nombres de juegos, listas y composición visible de `home.jsx`.
- Reutilizar `GAMES`, la sesión mock `av_user`, el shell compartido y los componentes existentes de SPEC 01.
- Centralizar en `app/lib/arcade-vault-data.ts` los datos mock de juegos, estadísticas, actividad y ranking usados por el landing.
- Hacer funcionales los CTAs del hero, tarjetas de juegos, enlace al Salón de la Fama, CTA de precios y CTA final.
- Implementar reveals al hacer scroll, estados hover/focus, animaciones decorativas y menú móvil dentro de los límites de la plantilla.
- Mantener visible “Acerca de” en la navegación como elemento visual sin acción ni cambio de ruta; su contenido y formulario quedan diferidos.
- Cubrir desktop y móvil sin scroll horizontal, respetando los estados de foco y `prefers-reduced-motion`.

**Out of scope (for future specs):**

- Formulario de contacto, sección informativa o ruta `/about` funcional.
- Backend, API, autenticación real, pagos, publicidad o persistencia nueva.
- Actividad en vivo, rankings, estadísticas o precios conectados a datos reales.
- Contadores o ticker que cambien automáticamente; el contenido seguirá siendo mock determinista.
- Mecánica de juegos, generación de puntuaciones o cambios al modelo de partidas de SPEC 01.
- Rediseño de las pantallas Detalle, Reproductor, Autenticación o Salón de la Fama más allá de actualizar sus enlaces de navegación.

## Data model

El landing reutilizará `ArcadeGame`, `ArcadeAccent` y los rankings existentes de `app/lib/arcade-vault-data.ts` y añadirá estructuras para que el contenido mock no quede declarado dentro del componente.

```ts
export type HomeFeature = {
  icon: "GAMEPAD" | "FREE" | "TROPHY" | "ROCKET";
  title: string;
  description: string;
  accent: ArcadeAccent;
};

export type HomeStat = {
  value: string;
  unit: string;
  summary: string;
};

export type HomeActivityRow = {
  player: string;
  game: string;
  score: number;
  timeLabel: string;
  accent: ArcadeAccent;
};

export type HomeTopPlayer = {
  rank: number;
  player: string;
  score: number;
};

export const HOME_FEATURES: readonly HomeFeature[] = [];
export const HOME_STATS: readonly HomeStat[] = [];
export const HOME_ACTIVITY: readonly HomeActivityRow[] = [];
export const HOME_TOP_PLAYERS: readonly HomeTopPlayer[] = [];
```

- Las constantes conservarán los valores y textos de `home.jsx`, incluidos los seis primeros juegos mostrados mediante `GAMES.slice(0, 6)`.
- Los importes, beneficios, preguntas frecuentes y textos de CTA serán constantes de presentación; no representarán un sistema de pagos.
- No se creará una estructura de persistencia para el landing. La única persistencia seguirá siendo `localStorage.av_user`, según SPEC 01.

## Implementation plan

1. Extender `app/lib/arcade-vault-data.ts` con los tipos y constantes mock del landing, conservando intactos `GAMES`, `CATS` y las funciones deterministas de rankings. Verificar que las rutas existentes sigan compilando.
2. Crear `app/components/arcade-vault-home.tsx` como componente cliente para el landing. Migrar la composición de `home.jsx`, sus iconos pixelados y las acciones de navegación a enlaces o botones compatibles con App Router.
3. Añadir `app/games/page.tsx` para renderizar `ArcadeVaultLibrary` en `/games` y cambiar `app/page.tsx` para renderizar `ArcadeVaultHome` en `/`.
4. Actualizar `app/components/arcade-vault-shell.tsx` y los componentes de navegación relacionados para que “Inicio” apunte a `/`, “Biblioteca” a `/games`, los enlaces de juego conserven `/games/[id]`, y “Acerca de” permanezca visible sin acción. Mantener el estado de usuario, cierre de sesión y menú móvil de SPEC 01.
5. Ajustar `app/components/arcade-vault-library.tsx` y cualquier enlace interno que todavía asuma que la Biblioteca vive en `/`, sin cambiar su búsqueda, filtros, datos ni comportamiento definido en SPEC 01.
6. Integrar en `app/globals.css` los estilos del landing de `styles.css`, evitando duplicar tokens, reglas del shell o arte CSS ya existente. Añadir responsive, focus states y reducción de movimiento para las animaciones de reveal, hover y decorativas.
7. Revisar manualmente `/`, `/games`, una ruta `/games/[id]`, `/auth` y `/hall-of-fame` en desktop y móvil; confirmar navegación, menú móvil, ausencia de errores de consola y ausencia de scroll horizontal antes de cerrar la implementación.

## Acceptance criteria

- [ ] `/` muestra el landing y no la Biblioteca.
- [ ] El landing contiene hero, beneficios, juegos disponibles, estadísticas, actividad en vivo, precios/FAQ y CTA final.
- [ ] El contenido visible conserva los textos, cifras, nombres y listas de la plantilla `home.jsx`.
- [ ] `/games` muestra la Biblioteca de SPEC 01 con búsqueda, filtros, tarjetas y estado sin resultados.
- [ ] La navegación “Inicio” lleva a `/` y “Biblioteca” lleva a `/games` desde desktop y menú móvil.
- [ ] “Acerca de” permanece visible, pero activarlo no cambia la ruta ni ejecuta una acción.
- [ ] “EXPLORAR JUEGOS”, “VER TODOS LOS JUEGOS”, “EMPEZAR GRATIS” e “INSERTAR MONEDA” navegan a la ruta definida por su propósito.
- [ ] Las seis tarjetas del rail navegan al detalle correcto en `/games/[id]`.
- [ ] “VER SALÓN” navega a `/hall-of-fame`.
- [ ] El landing usa `app/lib/arcade-vault-data.ts` para juegos, estadísticas, actividad y ranking, sin duplicar esos mocks en el componente.
- [ ] El estado de sesión `av_user`, el botón de usuario y el cierre de sesión siguen funcionando al navegar desde el landing.
- [ ] El formulario de contacto y una ruta `/about` no se implementan.
- [ ] Los reveals, hover/focus y animaciones decorativas funcionan sin modificar puntuaciones ni datos persistidos.
- [ ] Con `prefers-reduced-motion: reduce`, las animaciones no impiden leer ni usar el landing.
- [ ] En viewport móvil aparece el menú lateral y ninguna de las rutas genera scroll horizontal.
- [ ] Inputs, botones, enlaces y el elemento “Acerca de” tienen estados de foco perceptibles.
- [ ] `npm run lint`, `npx tsc --noEmit` y `npm run build` terminan correctamente.
- [ ] La consola del navegador no muestra errores al recorrer las rutas y acciones principales.

## Decisions

- **Sí:** convertir `/` en landing. Es la separación natural entre la presentación del producto y el acceso directo al catálogo.
- **Sí:** mover la Biblioteca a `/games`. Conserva la funcionalidad de SPEC 01 sin competir con el nuevo propósito de la homepage.
- **No:** eliminar la Biblioteca o dejarla únicamente como componente sin ruta. La Biblioteca sigue siendo una pantalla pública y navegable.
- **Sí:** implementar todas las secciones de `home.jsx`. La plantilla entregada representa el alcance visual solicitado, no una referencia parcial.
- **Sí:** mantener fidelidad a los textos y cifras de la plantilla. Evita inventar contenido durante la migración y permite validar visualmente contra la referencia.
- **Sí:** centralizar los mocks del landing en `app/lib/arcade-vault-data.ts`. Mantiene una fuente única para juegos, actividad, ranking y estadísticas.
- **No:** crear actividad o rankings en tiempo real. Eso requiere backend y pertenece a otra especificación.
- **Sí:** conservar “Acerca de” como elemento visual sin acción. El usuario pidió mantener el enlace visible, pero aplazar su implementación.
- **No:** implementar el formulario, una ruta placeholder o un formulario simulado de contacto. La funcionalidad fue excluida explícitamente.
- **Sí:** reutilizar shell, sesión mock y persistencia `av_user` de SPEC 01. El landing no necesita un modelo de sesión diferente.
- **No:** añadir persistencia para favoritos, actividad, métricas o precios. El contenido es presentación mock y no tiene estado mutable.
- **Sí:** mantener enlaces funcionales a las rutas existentes. La homepage debe servir como entrada real al producto, no como una maqueta aislada.

## Risks

| Risk | Mitigation |
| --- | --- |
| La nueva ruta `/games` puede confundirse con el segmento dinámico `/games/[id]` | Declarar `app/games/page.tsx` como índice estático y validar `/games`, `/games/example` y un id inexistente por separado. |
| Los cambios de navegación pueden romper enlaces que asumían que `/` era la Biblioteca | Revisar shell, tarjetas, CTAs y rutas existentes; comprobar cada destino en el smoke test manual. |
| El landing largo y sus efectos visuales pueden degradar legibilidad o rendimiento móvil | Mantener efectos decorativos, aplicar responsive, respetar `prefers-reduced-motion` y comprobar viewport móvil. |
| Los datos mock del landing pueden divergir de los nombres de `GAMES` o de rankings existentes | Derivar el rail desde `GAMES` y declarar actividad/ranking/estadísticas en el módulo centralizado de datos. |
| Un elemento “Acerca de” sin acción puede parecer roto | Presentarlo con tratamiento visual de elemento pendiente y sin usar un `href` falso o una ruta inexistente. |

## What is **not** in this spec

- Formulario, contenido funcional o ruta `/about`.
- Biblioteca en `/`; queda en `/games`.
- Backend, API, autenticación real, pagos o datos en tiempo real.
- Animación de puntuaciones, ticker cambiante o persistencia nueva.
- Mecánica de juegos, puntuaciones reales o cambios al reproductor.
- Rediseño de las pantallas existentes fuera de los enlaces necesarios.

Cada elemento excluido requiere su propia especificación futura.
