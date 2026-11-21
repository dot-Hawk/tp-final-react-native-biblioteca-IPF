# Biblioteca IPF

Trabajo Práctico N° 4 del Taller Complementario React Native II (Instituto Politécnico Formosa).

App para consultar el catálogo de la biblioteca, reservar libros, recibir un recordatorio antes de la devolución y, desde el mostrador, entregar los libros respetando el orden de la lista de espera.

- **SDK de Expo:** 58 (`expo ~58.0.26`, `expo-router ~58.0.32`, React Native 0.88)
- **Lenguaje:** TypeScript estricto con rutas tipadas
- **Probado en:** _completar con el modelo de teléfono y el sistema operativo_

## Cómo ejecutarlo

```bash
npm install
npx expo start
```

Escanear el QR con Expo Go (Android) o con la cámara (iOS).

Otros comandos:

```bash
npx expo lint      # lint
npx tsc --noEmit   # chequeo de tipos
npm test           # tests de Pila, Cola y utilidades (jest-expo)
```

**Credenciales del personal** (fijas en `src/constants/biblioteca.ts`): usuario `biblioteca`, clave `ipf2026`.

**Libros para probar el escáner:** los dos primeros de `src/data/libros.ts` hay que reemplazarlos por los ISBN de dos libros físicos que tengas a mano.

## Árbol de rutas

```
src/app
├── _layout.tsx                  Stack raíz. Provider del Context y Stack.Protected
├── (tabs)
│   ├── _layout.tsx              Tabs (Catálogo, Mis reservas)
│   ├── (catalogo)
│   │   ├── _layout.tsx          Stack propio de la tab Catálogo (anchor: index)
│   │   ├── index.tsx            /
│   │   └── libro
│   │       └── [isbn].tsx       /libro/[isbn]
│   └── reservas.tsx             /reservas
├── buscar.tsx                   /buscar?q=        (Stack raíz)
├── escanear.tsx                 /escanear         (Stack raíz)
├── reservar
│   └── [isbn].tsx               /reservar/[isbn]  (Stack raíz, modal)
├── permisos
│   └── [recurso].tsx            /permisos/[recurso] (modal)
├── login.tsx                    /login            (modal, solo sin sesión)
├── mostrador.tsx                /mostrador        (solo con sesión)
├── reserva.tsx                  /reserva -> <Redirect href="/reservas" />
└── +not-found.tsx               cualquier otra URL
```

El layout raíz exporta `unstable_settings = { anchor: '(tabs)' }`: si la app se abre con un deep link a `/buscar` o `/escanear`, las pestañas quedan debajo en la pila y "atrás" vuelve a ellas.

## Organización del código

| Carpeta | Contenido |
| --- | --- |
| `src/app` | Solo rutas |
| `src/components` | Componentes de presentación, uno por archivo |
| `src/hooks` | `useLibros`, `useBusqueda`, `usePermiso`, `useBiblioteca` |
| `src/context` | `BibliotecaContext`: préstamos, listas de espera, recientes, sesión y avisos |
| `src/estructuras` | Clases `Pila` y `Cola` con campos privados (`#items`) |
| `src/lib` | API simulada, notificaciones, fechas, validación de ISBN |
| `src/data` | Libros y listas de espera iniciales |
| `src/types` | Tipos compartidos |
| `src/constants` | `tema.ts` (colores, espacios, tipografía) y constantes de negocio |

Las importaciones van siempre "hacia abajo": `app` usa `components`, `hooks` y `context`; ninguna carpeta importa desde `src/app`.

## Plugins de `app.json`

```jsonc
"plugins": [
  // Rutas basadas en archivos
  "expo-router",

  // Pantalla de carga con el color de fondo de la app
  ["expo-splash-screen", { "backgroundColor": "#F6F4EF", "image": "./assets/images/splash-icon.png", "imageWidth": 76 }],

  [
    "expo-camera",
    {
      // Texto de propósito que iOS muestra en el diálogo del sistema
      "cameraPermission": "Usamos tu cámara para leer el código de barras del libro y abrir su ficha sin escribir el ISBN.",
      // La app no graba video: no se declara el micrófono en iOS...
      "microphonePermission": false,
      // ...ni RECORD_AUDIO en Android
      "recordAudioAndroid": false
    }
  ],

  // Color del ícono de las notificaciones en Android
  ["expo-notifications", { "color": "#2F4A3A" }]
]
```

## Permisos

| Recurso | Módulo | Cuándo se pide | Alternativa si se niega |
| --- | --- | --- | --- |
| Cámara | `expo-camera` | Al tocar "Usar la cámara" en `/escanear`, después de la pantalla previa `/permisos/camara` | Escribir el ISBN a mano en la misma pantalla |
| Notificaciones | `expo-notifications` | Solo al activar "Recordarme" en un préstamo, después de `/permisos/notificaciones` | El recordatorio y el aviso de "libro disponible" se muestran dentro de `/reservas` |

La app no pide ningún otro permiso.

### `blockedPermissions` (Android)

```json
"blockedPermissions": [
  "android.permission.RECORD_AUDIO",
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.WRITE_EXTERNAL_STORAGE",
  "android.permission.SYSTEM_ALERT_WINDOW"
]
```

- `RECORD_AUDIO`: `expo-camera` lo puede agregar para grabar video con sonido; la app solo lee códigos de barras.
- `READ/WRITE_EXTERNAL_STORAGE`: la app no lee ni guarda archivos.
- `SYSTEM_ALERT_WINDOW`: lo agregan algunas herramientas de desarrollo; la app no dibuja sobre otras apps.

Se bloquean para cumplir con el principio de mínimo privilegio aunque alguna dependencia los declare. `blockedPermissions` solo tiene efecto en una build propia (no en Expo Go).

## Deep links de prueba

En Expo Go reemplazar `bibliotecaipf://` por `exp://<IP>:8081/--/`.

| Link | Resultado esperado |
| --- | --- |
| `bibliotecaipf://libro/9789500441001` | Detalle de "Ficciones" |
| `bibliotecaipf://libro/123` | Mensaje "ISBN inválido" con acceso al catálogo |
| `bibliotecaipf://buscar?q=borges` | Buscador con los resultados de "borges" y las tabs debajo |
| `bibliotecaipf://mostrador` | Sin sesión: no se muestra el mostrador |
| `bibliotecaipf://reserva` | Redirige a Mis reservas |
| `bibliotecaipf://escanear` | Con la cámara bloqueada: aviso y carga manual del ISBN |

## Verificación

Salida de `npx expo lint` y `npx tsc --noEmit`:

```
_pegar acá la salida_
```

## Desafíos opcionales hechos

- **Pruebas:** tests de `Pila` y `Cola` con `jest-expo` (incluye desencolar una cola vacía) y de las utilidades de `src/lib`.
- **Debounce:** el buscador espera 300 ms sin escribir antes de actualizar `q` en la URL y buscar; la limpieza del efecto cancela el temporizador.

## Pendiente de verificar en un teléfono

- Que al iniciar sesión el login se cierre sin dejar una segunda copia de las pestañas en la pila (en la versión web aparece una flecha "atrás" en el Catálogo después de iniciar sesión).
- El escáner, el canal `prestamos` de Android y la notificación a los 15 segundos (no funcionan en la versión web).
