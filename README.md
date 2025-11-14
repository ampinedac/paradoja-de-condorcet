# Paradoja de Condorcet - Dados Intransitivos

Una aplicación web interactiva para explorar la famosa paradoja de Condorcet utilizando dados especiales que demuestran la intransitividad en probabilidades.

## Descripción del Problema

Se confeccionan cuatro dados especiales:

- **D1**: tiene en cuatro caras 4 y en dos 0
- **D2**: en todas sus caras 3  
- **D3**: 2 en cuatro caras y 6 en las restantes
- **D4**: tiene 5 en tres caras y 1 en las otras tres

### Reglas del Juego

1. Dos jugadores compiten
2. Uno de ellos selecciona un dado y el contrincante, después, otro
3. Lanzan los dados un máximo de tres veces
4. Gana quien en dos de los lanzamientos obtiene una puntuación superior

## Características de la Aplicación

### 🎲 Visualización Interactiva
- Representación visual de todos los dados con sus caras
- Interfaz intuitiva para la selección de dados
- Animaciones durante los lanzamientos

### 🎮 Juego Completo
- Sistema de juego por rondas (mejor de 3)
- Seguimiento automático de puntuación
- Historial detallado de lanzamientos

### 📊 Análisis Probabilístico
- Cálculo automático de todas las probabilidades
- Matriz completa de probabilidades de victoria
- Análisis de la estrategia óptima

### 📈 Estadísticas
- Seguimiento de juegos totales
- Contador de victorias por cada dado
- Persistencia de datos en localStorage

## La Paradoja Explicada

Esta configuración de dados demuestra la **intransitividad probabilística**:

- D1 vence a D2 con ~55.6% de probabilidad
- D2 vence a D3 con ~66.7% de probabilidad  
- D3 vence a D4 con ~55.6% de probabilidad
- D4 vence a D1 con ~55.6% de probabilidad

**Resultado sorprendente**: No existe un "mejor dado" universal. Cada dado puede ser vencido por otro, formando un ciclo donde A > B > C > D > A.

## Estrategia Óptima

La aplicación revela que la **mejor estrategia es elegir segundo**, ya que siempre puedes seleccionar un dado que tenga ventaja probabilística sobre el dado de tu oponente.

## Uso Educativo

Esta herramienta es ideal para:

- **Enseñanza de probabilidades**: Demuestra conceptos contraintuitivos
- **Teoría de juegos**: Ilustra estrategias óptimas
- **Matemática recreativa**: Exploración de paradojas
- **Análisis estadístico**: Comparación entre teoría y práctica

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo con animaciones
- **JavaScript ES6**: Lógica del juego y cálculos probabilísticos
- **LocalStorage**: Persistencia de estadísticas

## Instalación y Uso

1. Descarga todos los archivos del proyecto
2. Abre `index.html` en tu navegador web
3. ¡Comienza a explorar la paradoja!

No se requieren dependencias externas ni servidor web.

## Funcionalidades Avanzadas

### Para Desarrolladores
La aplicación incluye funciones en la consola del navegador:

```javascript
// Simular 1000 juegos entre D1 y D2
simularJuegos("D1", "D2", 1000)

// Calcular probabilidad exacta
calcularProbabilidad("D1", "D2")

// Acceder a configuración de dados
dados
```

### Características Técnicas
- **Responsive Design**: Adaptable a móviles y tablets
- **Animaciones CSS**: Efectos visuales suaves
- **Cálculos en tiempo real**: Probabilidades exactas
- **Persistencia de datos**: Estadísticas guardadas localmente

## Aplicaciones Pedagógicas

### Método Práctico
- Jugar múltiples partidas
- Anotar resultados
- Comparar con predicciones teóricas

### Método Teórico  
- Calcular probabilidades exactas
- Analizar la matriz de dominancia
- Comprender la intransitividad

## Contribuciones

Este proyecto está diseñado para uso educativo. Las contribuciones son bienvenidas para:

- Mejoras en la interfaz de usuario
- Nuevas funcionalidades estadísticas
- Optimizaciones de rendimiento
- Traduciones a otros idiomas

## Licencia

Proyecto de código abierto para fines educativos.

---

**¿Cuál es la mejor estrategia para ganar el juego?** 
¡Descúbrelo experimentando con la aplicación! 🎲