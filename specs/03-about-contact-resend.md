# SPEC 03 — About y contacto con Resend

> **Status:** Approved
> **Depends on:** SPEC 02
> **Date:** 2026-08-27
> **Objective:** Implementar la página `/about` de Arcade Vault con fidelidad visual a la plantilla `references/templates/home-about/about.jsx` y enviar su formulario de contacto mediante Resend a través de un endpoint server-side.

## Scope

**In:**

- Crear la ruta pública `/about` y convertir “Acerca de” en un enlace funcional y activo en la navegación desktop y móvil.
- Reproducir la composición, textos, iconos pixelados, colores, estados hover/focus, reveals, divisor animado, responsive y terminal de éxito definidos por `references/templates/home-about/about.jsx` y sus estilos correspondientes en `references/templates/home-about/styles.css`.
- Mostrar las secciones “ACERCA DE”, misión, tres destacados, divisor visual y “CONTACTO” con sus tres mensajes informativos.
- Implementar el formulario con los campos visibles NOMBRE, CORREO ELECTRÓNICO y MENSAJE, además de un campo honeypot no visible para protección básica contra bots.
- Validar nombre, email y mensaje en cliente y servidor: los tres son obligatorios; nombre máximo 80 caracteres, email máximo 254 y mensaje máximo 5.000; el email debe tener formato válido.
- Crear `POST /api/contact` como Route Handler server-side para recibir `{ name, email, message, website }`.
- Enviar el correo con el paquete `resend`, usando `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL` desde variables de entorno; el remitente debe pertenecer a un dominio verificado en Resend.
- Enviar un correo plain-text con asunto `[Arcade Vault] Nuevo mensaje de contacto`, nombre, email y mensaje del visitante, configurando el email del visitante como reply-to.
- Devolver `{ ok: true }` con HTTP 200 cuando el mensaje sea aceptado; devolver `{ ok: false, error: string }` con HTTP 400 para datos inválidos y HTTP 503 para configuración ausente o fallo de Resend.
- Cuando el honeypot contenga texto no vacío, no llamar a Resend y responder con éxito genérico `{ ok: true }`, sin revelar la detección al cliente.
- Mostrar la terminal de éxito del template únicamente después de una respuesta 200 real; conservar el nombre normalizado para el saludo y permitir “ENVIAR OTRO MENSAJE”.
- Mostrar un error inline accesible, conservar los datos introducidos y permitir reintentar cuando la validación o el envío fallen.
- Añadir `.env.template` con los nombres de las variables requeridas y valores vacíos o de ejemplo no secretos.
- Añadir Vitest y pruebas automatizadas para el Route Handler, con mocks del SDK de Resend para no enviar correos durante los tests.
- Mantener la aplicación usable en desktop y móvil, sin scroll horizontal, con estados de foco perceptibles y respeto a `prefers-reduced-motion`.

**Out of scope (for future specs):**

- Autenticación, autorización o personalización del formulario según el usuario conectado.
- Base de datos, persistencia de mensajes, historial de contactos o panel administrativo.
- CAPTCHA, rate limiting persistente, moderación automática o protección anti-spam avanzada.
- Adjuntos, múltiples destinatarios configurables desde la UI, newsletters o respuestas automáticas al visitante.
- Plantillas HTML de correo, tracking, analytics o integración con otro proveedor de email.
- Cambios al contenido de la homepage, Biblioteca, Detalle, Reproductor o Salón de la Fama fuera de los enlaces de navegación necesarios.
- Implementación de juegos, puntuaciones reales, créditos, pagos o cualquier backend no relacionado con el contacto.

## Data model

No se añade persistencia. Se define un contrato de transporte para el formulario y un contrato de configuración de entorno.

```ts
export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website?: string;
};

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string };
```

- `website` es el honeypot: los navegadores normales lo mantienen vacío y un valor no vacío se descarta silenciosamente sin llamar a Resend.
- El servidor normalizará los campos de texto antes de validar y usar sus valores en el correo.
- Las variables requeridas son `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL`. No se incluirán secretos en `.env.template`, Git ni código cliente.
- La respuesta de error usará mensajes seguros y estables para la UI; nunca devolverá la API key, detalles internos de Resend ni trazas.

## Implementation plan

1. Revisar la guía específica de Next.js 16 disponible en `node_modules/next/dist/docs/` para Route Handlers, metadata y límites de Server/Client Components antes de modificar código.
2. Añadir `resend` como dependencia de producción, Vitest como dependencia de desarrollo y los scripts mínimos para ejecutar las pruebas del endpoint; actualizar el lockfile sin introducir dependencias no relacionadas.
3. Crear `.env.template` con `RESEND_API_KEY=`, `CONTACT_TO_EMAIL=` y `CONTACT_FROM_EMAIL=`, aclarando mediante nombres y valores vacíos que los valores reales deben configurarse fuera del repositorio.
4. Crear el módulo de validación compartido para `ContactPayload`, normalización, límites 80/254/5000 y formato de email, de forma que las reglas del cliente y del servidor sean iguales.
5. Crear `app/api/contact/route.ts` como Route Handler `POST`: parsear el JSON, validar el payload, aplicar el honeypot antes de enviar, comprobar configuración, llamar a Resend con el asunto/cuerpo/reply-to definidos y devolver los estados JSON 200/400/503 establecidos.
6. Crear `app/components/arcade-vault-about.tsx` como componente cliente. Migrar la estructura de `about.jsx`, sus iconos y estados visuales; conectar el formulario con `/api/contact`, incluir estado de envío, error inline, respuesta exitosa y reinicio de “ENVIAR OTRO MENSAJE” sin modificar la composición normal de la plantilla.
7. Crear `app/about/page.tsx` para renderizar el componente About y añadir metadata específica de la ruta sin duplicar el shell compartido.
8. Actualizar `app/components/arcade-vault-shell.tsx` para que “Acerca de” apunte a `/about`, marque el enlace activo en desktop y móvil y cierre el menú móvil al navegar; conservar intactas las rutas y el estado de sesión existentes.
9. Integrar en `app/globals.css` los estilos del bloque About/contact de `styles.css`, reutilizando tokens, botones, fuentes y animaciones existentes; añadir solo reglas necesarias para validación, estado de envío, error accesible y reducción de movimiento.
10. Crear pruebas Vitest para éxito y payload enviado a Resend, campos ausentes, email inválido, límites excedidos, honeypot, JSON inválido, variables ausentes y fallo del SDK; comprobar que los casos que no deben enviar no invocan Resend.
11. Ejecutar `npm test`, `npm run lint`, `npx tsc --noEmit` y `npm run build`. Con variables de Resend configuradas en un entorno de prueba, revisar manualmente `/about` en desktop y móvil, enviar un mensaje a un buzón de prueba, comprobar la terminal de éxito, reintento, error de red/configuración, navegación y ausencia de errores de consola o scroll horizontal.

## Acceptance criteria

- [ ] `/about` existe y carga dentro del shell compartido de Arcade Vault.
- [ ] “Acerca de” navega a `/about` desde la navegación desktop y móvil, aparece activo en esa ruta y cierra el menú móvil al seleccionarlo.
- [ ] `/about` conserva los textos, jerarquía, tres destacados, iconos, divisor, animaciones y composición visual de `about.jsx`.
- [ ] El formulario muestra NOMBRE, CORREO ELECTRÓNICO, MENSAJE y el botón `▶ ENVIAR MENSAJE` con la apariencia del template.
- [ ] Nombre, email y mensaje son obligatorios; el cliente y el servidor rechazan nombre >80, email >254, mensaje >5.000 o un email con formato inválido.
- [ ] El payload normalizado usa `{ name, email, message, website }` y el honeypot no es visible para un usuario normal.
- [ ] Un payload válido produce `POST /api/contact`, HTTP 200 y `{ ok: true }` después de que Resend acepte el envío.
- [ ] Resend recibe el destinatario y remitente configurados, el asunto exacto, un cuerpo plain-text con nombre/email/mensaje y reply-to igual al email del visitante.
- [ ] La API key y las variables de entorno solo se leen en servidor y no aparecen en el bundle o respuestas del navegador.
- [ ] Datos inválidos producen HTTP 400 y `{ ok: false, error: string }` sin llamar a Resend.
- [ ] Un honeypot no vacío produce HTTP 200 genérico sin llamar a Resend ni mostrar al cliente que fue detectado.
- [ ] Variables de Resend ausentes o un fallo del SDK producen HTTP 503 y un error seguro; el formulario conserva sus datos y permite reintentar.
- [ ] La terminal de éxito del template aparece solo después del éxito real, saluda con el nombre enviado y `ENVIAR OTRO MENSAJE` restablece el formulario.
- [ ] Errores de validación o envío aparecen inline con una relación accesible al formulario y no borran los campos.
- [ ] La ruta es usable con teclado, tiene foco perceptible, labels asociados y respeta `prefers-reduced-motion`.
- [ ] Desktop y móvil no generan scroll horizontal y el layout pasa a una columna en el breakpoint definido por el template.
- [ ] Las pruebas Vitest cubren éxito, validación, límites, honeypot, configuración ausente y fallo de Resend, incluyendo la ausencia de llamadas indebidas al SDK.
- [ ] `npm test`, `npm run lint`, `npx tsc --noEmit` y `npm run build` terminan correctamente.
- [ ] Con un entorno Resend de prueba configurado, el mensaje llega al buzón de prueba y la consola del navegador no muestra errores al recorrer la ruta y sus estados principales.

## Decisions

- **Sí:** crear `/about` como segmento App Router. Es la URL pública coherente con el enlace “Acerca de” que SPEC 02 dejó pendiente.
- **No:** conservar “Acerca de” como elemento visual sin acción. La nueva spec implementa explícitamente la ruta y su contenido.
- **Sí:** mantener la plantilla visual y textual como fuente de verdad. Solo se añadirán estados técnicos necesarios para envío, accesibilidad y errores sin alterar la apariencia del camino exitoso.
- **Sí:** usar `POST /api/contact` en un Route Handler server-side. Evita exponer la API key y separa la UI del proveedor de correo.
- **No:** llamar a Resend desde el navegador. El secreto y la integración quedan restringidos al servidor.
- **Sí:** usar `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL` como variables de entorno. Permite cambiar destinos por entorno y exige un remitente verificable en Resend.
- **Sí:** crear `.env.template` en lugar de un archivo con secretos. Hace explícita la configuración necesaria sin registrar credenciales.
- **Sí:** enviar plain-text con reply-to del visitante. Es suficiente para contacto humano, reduce superficie de HTML y facilita responder desde el correo recibido.
- **Sí:** usar `{ name, email, message, website }` como payload. Los nombres son semánticos y `website` deja claro el propósito del honeypot.
- **Sí:** devolver éxito genérico para el honeypot. Evita enseñar a bots qué condición bloqueó el envío; no pretende sustituir un sistema anti-spam completo.
- **Sí:** mostrar la terminal de éxito solo después de la confirmación del endpoint. Evita comunicar al visitante que un mensaje fue enviado cuando Resend falló.
- **No:** usar éxito optimista o limpiar el formulario antes de recibir respuesta. Podría perder el contenido y ocultar fallos operativos.
- **Sí:** adoptar Vitest con mocks de Resend. El repositorio no tiene runner y Vitest permite probar el contrato del endpoint sin correos reales.
- **No:** añadir base de datos, CAPTCHA o rate limit persistente. Son necesidades de operación futura que ampliarían el alcance de esta spec.

## Risks

| Risk | Mitigation |
| --- | --- |
| Un remitente no verificado o una variable ausente impide enviar correos en producción | Comprobar configuración antes de llamar a Resend, devolver 503 seguro y documentar las tres variables en `.env.template`; validar manualmente con un dominio verificado. |
| La API key podría filtrarse al cliente durante la integración | Importar Resend solo en el Route Handler server-side, no usar variables `NEXT_PUBLIC_*` y revisar el bundle/configuración antes de cerrar. |
| Un endpoint público puede recibir spam aunque tenga honeypot | Mantener el honeypot y límites de longitud en esta spec; dejar CAPTCHA/rate limiting persistente para una especificación de operación posterior. |
| Los errores de red podrían dejar al usuario sin confirmación o provocar envíos duplicados | Deshabilitar el botón durante la petición, conservar el formulario ante error y permitir reintento explícito; no mostrar éxito hasta recibir HTTP 200. |
| Copiar estilos completos del template puede duplicar tokens o romper otras rutas | Integrar solo el bloque About/contact, reutilizar tokens y clases compartidas y ejecutar smoke tests sobre `/`, `/games`, `/auth` y `/hall-of-fame`. |
| Las pruebas contra un proveedor externo serían lentas o no deterministas | Mockear Resend en Vitest y reservar el envío real para una comprobación manual controlada con un buzón de prueba. |

## What is **not** in this spec

- Ningún formulario simulado: el envío real requiere Resend configurado en servidor.
- Ninguna ruta modal, alternativa o URL distinta de `/about`.
- Ninguna persistencia de mensajes, cuentas nuevas o datos personales en Arcade Vault.
- Ningún CAPTCHA, rate limiting persistente, moderación, adjuntos, HTML email o autorespuesta.
- Ningún secreto en `.env.template`, código, bundle, Git o respuesta HTTP.
- Ningún cambio funcional en juegos, puntuaciones, autenticación, rankings o pagos.

Cada elemento excluido requiere su propia especificación futura.
