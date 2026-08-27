# SPEC 01 — MVP visual de Arcade Vault

> **Status:** Implemented
> **Depends on:** Ninguna
> **Date:** 2026-08-26
> **Objective:** Implementar en Next.js las cinco pantallas visuales de Arcade Vault con navegación App Router, datos ficticios centralizados y comportamiento local mínimo, sin implementar ningún juego.

## Scope

**In:**

- Migrar a Next.js las vistas Biblioteca, Detalle de juego, Reproductor mock, Autenticación y Salón de la Fama descritas en `references/templates/`.
- Usar las rutas `/`, `/games/[id]`, `/games/[id]/play`, `/auth` y `/hall-of-fame`.
- Reutilizar y ampliar `app/lib/arcade-vault-data.ts` como única fuente de datos ficticios para juegos, categorías y rankings.
- Reproducir con alta fidelidad la composición, textos, colores neón, tarjetas, arte CSS, efectos CRT y estados visibles de las plantillas.
- Implementar navegación entre rutas, búsqueda por nombre, filtro por categoría, tabs del Salón de la Fama, apertura/cierre del menú móvil y navegación de los botones principales.
- Implementar una cuenta mock local: acceso, creación de cuenta, modo invitado y cierre de sesión, sin backend ni proveedores OAuth reales.
- Persistir únicamente la sesión mock en `localStorage` mediante la clave `av_user`.
- Mantener rankings y puntuaciones como datos mock deterministas; no generar ni persistir nuevas puntuaciones.
- Usar Tailwind CSS para layout y composición nueva, conservando en `app/globals.css` las variables, tipografías, arte CSS y efectos visuales que Tailwind no exprese de forma directa.
- Cubrir desktop y móvil, incluido el panel de navegación móvil.

**Out of scope (for future specs):**

- Implementación de la mecánica, controles, reglas, colisiones o progreso de cualquier juego.
- Backend, base de datos, API, registro real, autenticación real o integración con Google/GitHub.
- Creación, validación o almacenamiento de puntuaciones reales.
- Multiplayer, perfiles avanzados, inventario, pagos o créditos funcionales.
- Editor de juegos, carga de juegos externos o administración de contenido.

## Data model

`app/lib/arcade-vault-data.ts` será la fuente compartida de datos de presentación.

```ts
export type ArcadeGame = {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
  cover: string;
  color: "cyan" | "magenta" | "green" | "yellow";
  best: number;
  plays: string;
};

export type RankingRow = {
  rank: number;
  name: string;
  score: number;
  date: string;
};

export type MockUser = {
  name: string;
};

export const GAMES: readonly ArcadeGame[] = [];
export const CATS = ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"] as const;
```

- `GAMES` conservará los ocho juegos y valores de las plantillas, incluyendo las descripciones largas necesarias para Detalle.
- Los rankings serán generados o declarados de forma determinista desde el mismo módulo para que Detalle y Salón de la Fama sean reproducibles.
- `localStorage.av_user` contendrá solo un `MockUser` serializado; si no existe, la navegación mostrará el estado visitante.
- No se añadirá una estructura de puntuación persistida porque el Reproductor no produce partidas.

## Implementation plan

1. Actualizar `app/lib/arcade-vault-data.ts` con el modelo completo de `ArcadeGame`, las descripciones largas, categorías y datos deterministas de rankings. Verificar que la aplicación actual siga compilando con la fuente centralizada.
2. Crear `app/components/arcade-vault-shell.tsx` como componente cliente compartido para fondo visual, navegación, menú móvil, estado de usuario desde `localStorage`, cierre de sesión y footer. Envolver el contenido desde `app/layout.tsx` sin duplicar navegación por ruta.
3. Crear `app/components/arcade-vault-library.tsx` y conectar `app/page.tsx` con la Biblioteca. Implementar hero, búsqueda controlada, chips de categorías, tarjetas de juego, estado sin resultados y enlaces hacia Detalle.
4. Crear `app/games/[id]/page.tsx` y `app/components/arcade-vault-game-detail.tsx` para Detalle. Mostrar portada, etiquetas, descripción, estadísticas, acciones de jugar/volver y leaderboard mock; un id inexistente debe renderizar el estado 404 de Next.
5. Crear `app/games/[id]/play/page.tsx` y `app/components/arcade-vault-player-mock.tsx` para el Reproductor. Reproducir HUD, CRT, arena visual, indicadores y modal/estado final de referencia sin timers, puntuación mutable ni mecánica jugable; `SALIR` debe volver al Detalle.
6. Crear `app/auth/page.tsx` y `app/components/arcade-vault-auth.tsx` para login/registro mock, invitado y botones sociales decorativos. Guardar el usuario normalizado en `av_user` y volver a Biblioteca al completar el formulario o entrar como invitado.
7. Crear `app/hall-of-fame/page.tsx` y `app/components/arcade-vault-hall-of-fame.tsx` para tabs por juego, podio, tabla de rankings y fila opcional del usuario conectado. Mantener los datos mock sin mutarlos al recargar.
8. Revisar `app/globals.css` y las clases Tailwind de los componentes para conservar el tema retro, arte CSS de portadas, animaciones, focus states y responsive de la plantilla, eliminando estilos duplicados del componente actual `app/components/arcade-vault-home.tsx` una vez migrada la Biblioteca.

## Acceptance criteria

- [x] `npm run build` termina correctamente sin errores de TypeScript ni de compilación de rutas.
- [x] `/` muestra Biblioteca con hero, ocho tarjetas, búsqueda, categorías y estado sin resultados.
- [x] Escribir un nombre filtra tarjetas por título sin distinguir mayúsculas y minúsculas.
- [x] Seleccionar una categoría actualiza las tarjetas visibles y la categoría activa.
- [x] Una tarjeta o su acción `JUGAR` navega a `/games/[id]` con el juego correcto.
- [x] Detalle muestra portada, descripción larga, estadísticas, acciones y leaderboard del juego seleccionado.
- [x] `JUGAR AHORA` navega a `/games/[id]/play` y `SALIR` vuelve al detalle.
- [x] El Reproductor mock muestra CRT, HUD, arena, indicadores y controles visuales sin ejecutar mecánica ni cambiar la puntuación automáticamente.
- [x] `/auth` permite alternar entre iniciar sesión y crear cuenta, conserva el campo de usuario y vuelve a Biblioteca al enviar.
- [x] El usuario enviado se normaliza a mayúsculas, se limita a 10 caracteres y se recupera desde `localStorage.av_user` al recargar.
- [x] El modo invitado vuelve a Biblioteca sin crear una sesión persistida.
- [x] Los botones Google y GitHub no realizan autenticación ni navegación externa.
- [x] La navegación muestra estado de usuario y permite cerrar sesión eliminando `av_user`.
- [x] Salón de la Fama permite cambiar de juego, muestra podio y tabla mock, y añade la fila del usuario solo cuando existe sesión.
- [x] Recargar cualquier ruta no cambia los rankings mock ni crea puntuaciones nuevas.
- [x] En viewport móvil aparece el menú lateral y las vistas no generan scroll horizontal.
- [x] Los estados de foco de inputs, botones y enlaces son perceptibles con teclado.
- [x] La consola del navegador no muestra errores al recorrer las cinco rutas y sus acciones principales.

## Decisions

- **Sí:** segmentos App Router separados. Dan URLs compartibles y reflejan las cinco pantallas sin conservar el enrutamiento por hash de la plantilla original.
- **No:** una única pantalla con estado de ruta. Se descarta porque oculta las vistas detrás de un componente monolítico y no aprovecha el App Router existente.
- **Sí:** `app/lib/arcade-vault-data.ts` como fuente única de mock data. Deja preparada la sustitución futura por una base de datos sin acoplarla a los componentes visuales.
- **Sí:** `localStorage` solo para `av_user`. Es suficiente para demostrar estados de cuenta sin simular un servidor.
- **No:** persistencia de puntuaciones. El reproductor no implementa juegos y no puede producir resultados reales.
- **Sí:** componentes cliente únicamente donde haya estado, eventos o APIs del navegador. El resto de las rutas puede permanecer como Server Components.
- **Sí:** Tailwind para layout y estilos nuevos, con `app/globals.css` para tokens, fuentes, portadas CSS, efectos CRT y animaciones específicas de Arcade Vault.
- **No:** OAuth, API o contratos de backend en este MVP. Se difieren hasta que exista la especificación de integración correspondiente.

## Risks

| Risk | Mitigation |
| --- | --- |
| `localStorage` no está disponible en ciertos modos privados o entornos sin navegador | Leerlo solo en el cliente y mantener el estado visitante si falla; la UI sigue siendo navegable. |
| Los efectos CRT, ruido y arte CSS pueden afectar legibilidad o rendimiento en móvil | Respetar `prefers-reduced-motion`, limitar animaciones a efectos decorativos y validar la composición en viewport móvil. |
| El contenido de rankings mock puede divergir entre pantallas | Generar rankings mediante una función determinista centralizada en `app/lib/arcade-vault-data.ts`. |

## What is **not** in this spec

- Ningún juego funcional ni mecánica de juego.
- Ningún backend, API, base de datos o autenticación real.
- Ninguna puntuación nueva generada o persistida.
- Ninguna integración OAuth con Google o GitHub.
- Multiplayer, perfiles avanzados, pagos, créditos funcionales o editor de juegos.

Cada elemento excluido requiere su propia especificación futura.
