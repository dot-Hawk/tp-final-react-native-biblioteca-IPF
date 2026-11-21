# Respuestas – TP 4 Biblioteca IPF

Cada respuesta cita el archivo y las líneas de la app.

## Parte B · Estado, efectos y renderizado

### B1. El ciclo de vida de useLibros
a)

b)

c)

d)

### B2. La condición de carrera del buscador

| Momento | Qué pasa | Sin limpieza: qué se ve | Con tu código: qué se ve |
| --- | --- | --- | --- |
| t = 0 ms | Escribe "bor" → se pide `buscarLibros("bor")` (1.400 ms) | | |
| t = 200 ms | Escribe "borges" → se pide `buscarLibros("borges")` (300 ms) | | |
| t = 500 ms | Llega la respuesta de "borges" | | |
| t = 1.400 ms | Llega la respuesta de "bor" | | |

a)

b)

c)

### B3. Mutar o reemplazar
a)

b)

c)

### B4. ¿Dónde vive cada dato?

| Dato | Dónde vive en tu app | Por qué ahí y no en otro lugar |
| --- | --- | --- |
| Texto del buscador | | |
| Préstamos y reservas | | |
| Listas de espera | | |
| Vistos recientemente | | |
| Sesión del personal | | |
| Ejemplares disponibles de un libro | | |
| Estado del permiso de cámara | | |
| Identificador de la notificación programada | | |

Re-renderizado del Context:

## Parte C · Navegación y rutas

### C1. La pila en tu app

| # | Acción | Pilas resultantes |
| --- | --- | --- |
| 1 | Abre la app. | |
| 2 | Toca un libro del Catálogo. | |
| 3 | Toca "Reservar". | |
| 4 | Toca "Confirmar". | |
| 5 | Toca atrás (Android). | |
| 6 | Toca la tab "Catálogo". | |

a)

b)

### C2. El escáner que dispara de más
a)

b)

c)

d)

### C3. Deep links y rutas protegidas

| Link | Qué ve la persona | Qué queda debajo en la pila | Qué parte de tu código lo decide |
| --- | --- | --- | --- |
| `bibliotecaipf://libro/` + ISBN existente | | | |
| `bibliotecaipf://libro/123` | | | |
| `bibliotecaipf://buscar?q=borges` | | | |
| `bibliotecaipf://mostrador` (sin sesión) | | | |
| `bibliotecaipf://reserva` | | | |
| `bibliotecaipf://escanear` (cámara bloqueada) | | | |

¿Por qué `/libro/123` llega al detalle?

### C4. Foco, montaje y primer plano
a)

b)

c)

## Parte D · Permisos en tu app

### D1. Recorrido completo de la cámara

| # | Acción | Qué muestra tu app | status | canAskAgain |
| --- | --- | --- | --- | --- |
| 1 | Toca "Escanear" por primera vez. | | | |
| 2 | "Continuar" → "No permitir". | | | |
| 3 | Toca "Escanear" otra vez. | | | |
| 4 | "Continuar" → "No permitir". | | | |
| 5 | Toca "Escanear" otra vez. | | | |
| 6 | "Abrir Ajustes" → habilita la cámara → vuelve a la app. | | | |

a)

b)

c)

### D2. Notificaciones y consistencia
a)

b)

c)

d)

### D3. Lo que tu app pide y lo que no

| Plataforma | Permiso o clave declarada | Función de la app que lo justifica | ¿Quién lo agrega? |
| --- | --- | --- | --- |
| | | | |

a)

b)

c)

## Parte E · Buenas prácticas y decisiones de diseño

### E1. Revisión de código
a)

b)

c)

d)

### E2. Organización y acoplamiento
a)

b)

c)

### E3. Mapa de fallas

| Situación | Qué ve la persona | Dónde se maneja (archivo y línea) |
| --- | --- | --- |
| `obtenerLibros()` falla | | |
| Se abre `/libro/abc` | | |
| Se escanea un ISBN que no está en el catálogo | | |
| La cámara está bloqueada | | |
| Las notificaciones están denegadas | | |
| Se intenta reservar un libro ya reservado | | |
| "Entregar al siguiente" con la lista de espera vacía | | |
| Login con clave incorrecta | | |

### E4. Decisiones con argumentos
a)

b)

c)

d)
