# PokéDex Explorer

App Expo (React Native) que consume la [PokéAPI](https://pokeapi.co/) para listar, buscar y ver la ficha de Pokémon.

## Cómo ejecutar

```bash
npm install
npx expo start
```

Escanea el QR con Expo Go, o presiona `i` (iOS) / `a` (Android).

## Árbol de carpetas y responsabilidades

```
pokedex-explorer/
├── app/                    # Rutas de Expo Router (nombres cortos)
│   ├── _layout.js          # Obligatorio: define el Stack de navegación
│   ├── index.js            # Ruta "/" → HomeScreen
│   └── detail.js           # Ruta "/detail" → PokemonDetailScreen
├── screens/
│   ├── HomeScreen.js       # Lista, búsqueda y scroll infinito
│   └── PokemonDetailScreen.js  # Ficha del Pokémon
├── components/
│   ├── PokemonCard.js      # Tarjeta de la cuadrícula
│   ├── SearchBar.js        # TextInput + botón Buscar
│   ├── StatusView.js       # Estados: cargando / error / vacío
│   ├── TypeBadge.js        # Distintivo de tipo con color
│   └── StatBar.js          # Barra proporcional de estadística
├── services/
│   └── pokeApi.js          # Única capa de red (fetch a PokéAPI)
├── constants/
│   └── typeColors.js       # Paleta de colores por tipo
└── utils/
    └── format.js           # Formato de número, nombre y etiquetas
```

### Por qué esta organización

- **`screens/`**: aquí vive la lógica de pantallas con nombres legibles (`HomeScreen`, `PokemonDetailScreen`).
- **`app/`**: solo conecta rutas de Expo Router. `_layout.js` e `index.js` son nombres que exige el router; no se pueden renombrar.
- **`services/pokeApi.js`**: concentra `fetch` y normalización; la UI no mezcla HTTP con JSX.
- **`components/`**: piezas reutilizables de interfaz.

## Funcionalidades

- Lista inicial de 20 Pokémon en cuadrícula de 2 columnas
- Scroll infinito (páginas de 20)
- Búsqueda por nombre o número (minúsculas, sin espacios extra)
- Ficha: imagen, tipos con color, altura (m), peso (kg), 6 stats con barra (máx. 255)
- Estados de UI: cargando, error (+ Reintentar), sin resultados, éxito

## Reglas del taller

- Código en inglés, textos de interfaz en español
- Conceptos de clase marcados con comentarios `// Concept: ...`

## Reflexión (plantilla)

1. **¿Por qué separar la API de la UI?**  
   Facilita probar la red, reutilizar endpoints y evitar componentes difíciles de leer.

2. **¿Qué controla el array de dependencias de `useEffect`?**  
   Cuándo se vuelve a disparar la petición (por ejemplo al cambiar el `id` de la ruta o al reintentar).

3. **¿Por qué `FlatList` y no `map`?**  
   Virtualiza filas visibles y mejora el rendimiento con listas largas.
