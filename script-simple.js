// SCRIPT MEJORADO CON ANIMACIONES
// Variables globales
let dadoJugador1 = '';
let dadoJugador2 = '';
let juegoActivo = false;
let nombreJugador1 = '';
let nombreJugador2 = '';
let rondaActual = 0;
let puntosJugador1 = 0;
let puntosJugador2 = 0;

// Variables para estadísticas
let estadisticas = {
    totalJuegos: 0,
    victoriasD1: 0,
    victoriasD2: 0,
    victoriasD3: 0,
    victoriasD4: 0
};

// Variable para el historial de lanzamientos
let historialLanzamientos = [];

// Flag para prevenir llamadas múltiples
let procesandoResultados = false;

// Definición de dados con sus valores y caras para animación
const dados = {
    'D1': {
        valores: [4, 4, 4, 4, 0, 0],
        caras: { frente: 4, atras: 4, derecha: 4, izquierda: 4, arriba: 0, abajo: 0 }
    },
    'D2': {
        valores: [3, 3, 3, 3, 3, 3],
        caras: { frente: 3, atras: 3, derecha: 3, izquierda: 3, arriba: 3, abajo: 3 }
    },
    'D3': {
        valores: [2, 2, 2, 2, 6, 6],
        caras: { frente: 2, atras: 2, derecha: 2, izquierda: 2, arriba: 6, abajo: 6 }
    },
    'D4': {
        valores: [5, 5, 5, 1, 1, 1],
        caras: { frente: 5, atras: 5, derecha: 5, izquierda: 1, arriba: 1, abajo: 1 }
    }
};

// Debug global
window.debugCondorcet = function() {
    console.log('=== DEBUG ===');
    console.log('dadoJugador1:', dadoJugador1);
    console.log('dadoJugador2:', dadoJugador2);
    console.log('juegoActivo:', juegoActivo);
};

// Funciones principales que van en el onclick del HTML
function iniciarJuego() {
    console.log('¡INICIANDO JUEGO!');
    
    if (!dadoJugador1 || !dadoJugador2) {
        return;
    }
    
    if (dadoJugador1 === dadoJugador2) {
        return;
    }
    
    juegoActivo = true;
    
    // Inicializar contadores del juego
    rondaActual = 0;
    puntosJugador1 = 0;
    puntosJugador2 = 0;
    
    // Actualizar displays iniciales
    actualizarContadorRondas();
    actualizarPuntuacion();
    
    // Habilitar botón de lanzar
    const btnLanzar = document.getElementById('lanzarDados');
    if (btnLanzar) {
        btnLanzar.disabled = false;
    }
    
    // Deshabilitar selección
    const select1 = document.getElementById('dadoJugador1');
    const select2 = document.getElementById('dadoJugador2');
    if (select1) select1.disabled = true;
    if (select2) select2.disabled = true;
    
    // Mostrar área de lanzamiento
    const area = document.getElementById('areaLanzamiento');
    if (area) {
        area.style.display = 'block';
    }
    
    // Configurar dados para animación
    configurarDadosLanzamiento();
}

function lanzarDadosJuego() {
    console.log('🎲 INICIANDO LANZAMIENTO DE DADOS');
    console.log('🎲 Estado antes del lanzamiento:', {
        dadoJugador1: dadoJugador1,
        dadoJugador2: dadoJugador2,
        juegoActivo: juegoActivo,
        rondaActual: rondaActual
    });
    
    if (!juegoActivo) {
        console.log('❌ Juego no activo, cancelando lanzamiento');
        return;
    }
    
    // Deshabilitar botón durante animación
    const btnLanzar = document.getElementById('lanzarDados');
    if (btnLanzar) btnLanzar.disabled = true;
    
    // Lanzar dados con animación
    const resultado1 = lanzarDado(dadoJugador1);
    const resultado2 = lanzarDado(dadoJugador2);
    
    console.log('🎲 RESULTADOS DEL LANZAMIENTO:', {
        resultado1: resultado1,
        resultado2: resultado2,
        dadoJugador1: dadoJugador1,
        dadoJugador2: dadoJugador2
    });
    
    // Iniciar animaciones
    animarDado('dadoLanzamientoJ1', resultado1, function() {
        animarDado('dadoLanzamientoJ2', resultado2, function() {
            mostrarResultados(resultado1, resultado2);
            // Reactivar botón
            if (btnLanzar) btnLanzar.disabled = false;
        });
    });
}

function animarDado(elementoId, resultadoFinal, callback) {
    const dadoElemento = document.getElementById(elementoId);
    if (!dadoElemento) return;
    
    const cubo = dadoElemento.querySelector('.dado-cubo');
    if (!cubo) return;
    
    console.log(`Animando ${elementoId} con resultado ${resultadoFinal}`);
    
    // RESETEAR posición inicial para asegurar consistencia
    cubo.style.transform = 'rotateX(-10deg) rotateY(15deg) rotateZ(0deg)';
    cubo.style.transition = 'none';
    
    // NO configurar el resultado todavía - dejar que se muestren las caras originales
    
    setTimeout(() => {
        // Aplicar la animación de giro
        cubo.style.animation = 'rotarDadoRapido 1.2s ease-out';
        cubo.style.transformStyle = 'preserve-3d';
        
        // Después de la animación, mostrar resultado
        setTimeout(() => {
            // Detener la animación
            cubo.style.animation = 'none';
            
            // AHORA configurar las caras con el resultado final
            configurarCarasResultado(elementoId, resultadoFinal);
            
            // POSICIÓN FINAL IDÉNTICA PARA AMBOS DADOS
            cubo.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
            cubo.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            console.log(`${elementoId} posicionado en frente con resultado ${resultadoFinal}`);
            
            if (callback) setTimeout(callback, 600);
        }, 1200);
    }, 100);
}

function configurarCarasResultado(elementoId, resultado) {
    const dadoElemento = document.getElementById(elementoId);
    if (!dadoElemento) return;
    
    const cubo = dadoElemento.querySelector('.dado-cubo');
    if (!cubo) return;
    
    // Configurar SOLO la cara frontal con el resultado final
    const caraFrente = cubo.querySelector('.cara-frente-lanz');
    if (caraFrente) {
        caraFrente.textContent = resultado;
        caraFrente.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        caraFrente.style.fontWeight = 'bold';
    }
    
    console.log(`Configurando cara frontal de ${elementoId} con resultado: ${resultado}`);
}

function mostrarResultados(resultado1, resultado2) {
    console.log('🏆 MOSTRANDO RESULTADOS:', {
        resultado1: resultado1,
        resultado2: resultado2,
        dadoJugador1: dadoJugador1,
        dadoJugador2: dadoJugador2,
        nombreJugador1: nombreJugador1,
        nombreJugador2: nombreJugador2,
        rondaActual: rondaActual
    });
    
    // Determinar ganador de la ronda
    let mensaje = '';
    let ganadorClass = '';
    
    if (resultado1 > resultado2) {
        mensaje = `🎉 ¡${nombreJugador1 || 'JUGADOR 1'} GANA! (${dadoJugador1}: ${resultado1} vs ${dadoJugador2}: ${resultado2})`;
        ganadorClass = 'ganador-j1';
    } else if (resultado2 > resultado1) {
        mensaje = `🎉 ¡${nombreJugador2 || 'JUGADOR 2'} GANA! (${dadoJugador2}: ${resultado2} vs ${dadoJugador1}: ${resultado1})`;
        ganadorClass = 'ganador-j2';
    } else {
        mensaje = `🤝 ¡EMPATE! (Ambos: ${resultado1})`;
        ganadorClass = 'empate';
    }
    
    // Mostrar ganador con estilo
    const ganador = document.getElementById('ganadorLanzamiento');
    if (ganador) {
        ganador.innerHTML = `<h3 class="${ganadorClass}">${mensaje}</h3>`;
        ganador.style.display = 'block';
        
        // Efecto de aparición
        ganador.style.opacity = '0';
        ganador.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            ganador.style.transition = 'all 0.5s ease';
            ganador.style.opacity = '1';
            ganador.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Actualizar tabla de resultados con el lanzamiento
    actualizarTablaResultados(resultado1, resultado2, ganadorClass);
    
    // Incrementar ronda y actualizar puntuación
    rondaActual++;
    
    // Actualizar puntuación según el ganador
    if (ganadorClass === 'ganador-j1') {
        puntosJugador1++;
    } else if (ganadorClass === 'ganador-j2') {
        puntosJugador2++;
    }
    
    // Actualizar displays
    actualizarContadorRondas();
    actualizarPuntuacion();
    
    // Añadir al historial
    actualizarHistorial(resultado1, resultado2, ganadorClass);
    
    // Verificar si el juego ha terminado
    verificarFinDelJuego();
}

function actualizarTablaResultados(resultado1, resultado2, ganadorClass) {
    // Actualizar los elementos de la tabla de resultados
    const resultadoJ1 = document.getElementById('resultadoJ1');
    const resultadoJ2 = document.getElementById('resultadoJ2');
    const ganadorRonda = document.getElementById('ganadorRonda');
    
    if (resultadoJ1) resultadoJ1.textContent = resultado1;
    if (resultadoJ2) resultadoJ2.textContent = resultado2;
    
    if (ganadorRonda) {
        let textoGanador = '';
        const nombre1 = nombreJugador1 || 'Jugador 1';
        const nombre2 = nombreJugador2 || 'Jugador 2';
        
        if (ganadorClass === 'ganador-j1') {
            textoGanador = `${nombre1} gana con ${resultado1}`;
        } else if (ganadorClass === 'ganador-j2') {
            textoGanador = `${nombre2} gana con ${resultado2}`;
        } else {
            textoGanador = `Empate con ${resultado1}`;
        }
        
        ganadorRonda.innerHTML = `<span class="${ganadorClass}">${textoGanador}</span>`;
        ganadorRonda.style.display = 'block';
    }
}

// ===== FUNCIONES DE CONTADORES Y PUNTUACIÓN =====
function actualizarContadorRondas() {
    const contadorRonda = document.getElementById('rondaActual');
    if (contadorRonda) {
        // Mostrar la ronda actual (rondaActual + 1 para mostrar "próxima ronda a jugar")
        // O rondaActual para mostrar "rondas completadas"
        contadorRonda.textContent = rondaActual;
    }
}

function actualizarPuntuacion() {
    const puntosJ1Element = document.getElementById('puntosJ1');
    const puntosJ2Element = document.getElementById('puntosJ2');
    
    if (puntosJ1Element) puntosJ1Element.textContent = puntosJugador1;
    if (puntosJ2Element) puntosJ2Element.textContent = puntosJugador2;
}

function verificarFinDelJuego() {
    console.log(`=== VERIFICANDO FIN DEL JUEGO ===`);
    console.log(`Ronda actual: ${rondaActual}`);
    console.log(`Puntos J1: ${puntosJugador1}, Puntos J2: ${puntosJugador2}`);
    
    // El juego termina cuando:
    // 1. Alguien gana 2 de 3 rondas (gana por mayoría)
    // 2. Se han completado 3 rondas (sin importar el resultado)
    
    const alguienGano2 = (puntosJugador1 >= 2) || (puntosJugador2 >= 2);
    const completaron3Rondas = (rondaActual >= 3);
    
    console.log(`¿Alguien ganó 2? ${alguienGano2}`);
    console.log(`¿Completaron 3 rondas? ${completaron3Rondas}`);
    console.log(`¿Terminar juego? ${alguienGano2 || completaron3Rondas}`);
    
    // Solo terminar si hay una condición de finalización válida
    if (alguienGano2 || completaron3Rondas) {
        console.log(`TERMINANDO JUEGO`);
        
        const ganadorFinalElement = document.getElementById('ganadorFinal');
        let mensajeFinal = '';
        
        if (puntosJugador1 > puntosJugador2) {
            mensajeFinal = `🏆 ¡${nombreJugador1 || 'Jugador 1'} GANA EL JUEGO! (${puntosJugador1}-${puntosJugador2})`;
        } else if (puntosJugador2 > puntosJugador1) {
            mensajeFinal = `🏆 ¡${nombreJugador2 || 'Jugador 2'} GANA EL JUEGO! (${puntosJugador2}-${puntosJugador1})`;
        } else {
            mensajeFinal = `🤝 ¡EMPATE FINAL! (${puntosJugador1}-${puntosJugador2})`;
        }
        
        if (ganadorFinalElement) {
            ganadorFinalElement.innerHTML = `<h2>${mensajeFinal}</h2>`;
            ganadorFinalElement.style.display = 'block';
        }
        
        // Registrar victoria en estadísticas solo si no es empate
        if (puntosJugador1 > puntosJugador2) {
            registrarVictoria(dadoJugador1);
        } else if (puntosJugador2 > puntosJugador1) {
            registrarVictoria(dadoJugador2);
        }
        
        // Deshabilitar el botón de lanzar
        const btnLanzar = document.getElementById('lanzarDados');
        if (btnLanzar) {
            btnLanzar.disabled = true;
            btnLanzar.textContent = 'Juego Terminado';
        }
        
        juegoActivo = false;
        return true; // Juego terminado
    }
    
    console.log(`JUEGO CONTINÚA - No se cumplen condiciones`);
    return false; // Juego continúa
}

function configurarDadosLanzamiento() {
    // Configurar caras del dado 1
    configurarCarasDado('dadoLanzamientoJ1', dadoJugador1);
    // Configurar caras del dado 2
    configurarCarasDado('dadoLanzamientoJ2', dadoJugador2);
}

function configurarCarasDado(elementoId, tipoDado) {
    const dadoElemento = document.getElementById(elementoId);
    if (!dadoElemento || !dados[tipoDado]) return;
    
    const caras = dados[tipoDado].caras;
    const cubo = dadoElemento.querySelector('.dado-cubo');
    if (!cubo) return;
    
    // Actualizar cada cara
    const caraFrente = cubo.querySelector('.cara-frente-lanz');
    const caraAtras = cubo.querySelector('.cara-atras-lanz');
    const caraDerecha = cubo.querySelector('.cara-derecha-lanz');
    const caraIzquierda = cubo.querySelector('.cara-izquierda-lanz');
    const caraArriba = cubo.querySelector('.cara-arriba-lanz');
    const caraAbajo = cubo.querySelector('.cara-abajo-lanz');
    
    if (caraFrente) caraFrente.textContent = caras.frente;
    if (caraAtras) caraAtras.textContent = caras.atras;
    if (caraDerecha) caraDerecha.textContent = caras.derecha;
    if (caraIzquierda) caraIzquierda.textContent = caras.izquierda;
    if (caraArriba) caraArriba.textContent = caras.arriba;
    if (caraAbajo) caraAbajo.textContent = caras.abajo;
}

function lanzarDado(tipoDado) {
    const valores = dados[tipoDado].valores;
    const indice = Math.floor(Math.random() * 6);
    return valores[indice];
}

function reiniciarJuego() {
    console.log('Reiniciando juego...');
    
    // Reset variables del juego
    dadoJugador1 = '';
    dadoJugador2 = '';
    juegoActivo = false;
    rondaActual = 0;
    puntosJugador1 = 0;
    puntosJugador2 = 0;
    
    // Reset nombres (mostrar modal de nuevo)
    const modal = document.getElementById('modalRegistro');
    if (modal) {
        modal.style.display = 'flex';
    }
    
    // Reset interfaz
    actualizarContadorRondas();
    actualizarPuntuacion();
    limpiarHistorial();
    
    // Reset selects
    const select1 = document.getElementById('dadoJugador1');
    const select2 = document.getElementById('dadoJugador2');
    if (select1) {
        select1.value = '';
        select1.disabled = false;
    }
    if (select2) {
        select2.value = '';
        select2.disabled = false;
    }
    
    // Reset botones
    const btnIniciar = document.getElementById('iniciarJuego');
    const btnLanzar = document.getElementById('lanzarDados');
    if (btnIniciar) btnIniciar.disabled = true;
    if (btnLanzar) {
        btnLanzar.disabled = true;
        btnLanzar.textContent = '🎲 Lanzar Dados';
    }
    
    // Ocultar área de lanzamiento
    const area = document.getElementById('areaLanzamiento');
    if (area) area.style.display = 'none';
    
    // Limpiar resultados
    const result1 = document.getElementById('resultadoLanzJ1');
    const result2 = document.getElementById('resultadoLanzJ2');
    const ganador = document.getElementById('ganadorLanzamiento');
    const ganadorFinal = document.getElementById('ganadorFinal');
    const ganadorRonda = document.getElementById('ganadorRonda');
    const resultadoJ1 = document.getElementById('resultadoJ1');
    const resultadoJ2 = document.getElementById('resultadoJ2');
    
    if (result1) result1.textContent = '?';
    if (result2) result2.textContent = '?';
    if (ganador) ganador.innerHTML = '';
    if (ganadorFinal) {
        ganadorFinal.innerHTML = '';
        ganadorFinal.style.display = 'none';
    }
    if (ganadorRonda) ganadorRonda.style.display = 'none';
    if (resultadoJ1) resultadoJ1.textContent = '-';
    if (resultadoJ2) resultadoJ2.textContent = '-';
}

// Manejar selección de dados (para los onchange de los selects)
function manejarSeleccionDado1() {
    const select = document.getElementById('dadoJugador1');
    if (select) {
        dadoJugador1 = select.value;
        console.log('Dado 1 seleccionado:', dadoJugador1);
        actualizarOpcionesDisponibles();
        verificarSeleccionSimple();
    }
}

function manejarSeleccionDado2() {
    const select = document.getElementById('dadoJugador2');
    if (select) {
        dadoJugador2 = select.value;
        console.log('Dado 2 seleccionado:', dadoJugador2);
        actualizarOpcionesDisponibles();
        verificarSeleccionSimple();
    }
}

function actualizarOpcionesDisponibles() {
    const select1 = document.getElementById('dadoJugador1');
    const select2 = document.getElementById('dadoJugador2');
    
    if (!select1 || !select2) return;
    
    // Resetear todas las opciones
    const opciones1 = select1.querySelectorAll('option');
    const opciones2 = select2.querySelectorAll('option');
    
    opciones1.forEach(option => {
        if (option.value) {
            option.disabled = false;
            option.style.color = '';
        }
    });
    
    opciones2.forEach(option => {
        if (option.value) {
            option.disabled = false;
            option.style.color = '';
        }
    });
    
    // Deshabilitar dado seleccionado por jugador 1 en select de jugador 2
    if (dadoJugador1) {
        const opcionJ2 = select2.querySelector(`option[value="${dadoJugador1}"]`);
        if (opcionJ2) {
            opcionJ2.disabled = true;
            opcionJ2.style.color = '#ccc';
        }
    }
    
    // Deshabilitar dado seleccionado por jugador 2 en select de jugador 1
    if (dadoJugador2) {
        const opcionJ1 = select1.querySelector(`option[value="${dadoJugador2}"]`);
        if (opcionJ1) {
            opcionJ1.disabled = true;
            opcionJ1.style.color = '#ccc';
        }
    }
}

function verificarSeleccionSimple() {
    const btnIniciar = document.getElementById('iniciarJuego');
    if (btnIniciar) {
        if (dadoJugador1 && dadoJugador2 && dadoJugador1 !== dadoJugador2) {
            btnIniciar.disabled = false;
            console.log('Botón habilitado');
        } else {
            btnIniciar.disabled = true;
            console.log('Botón deshabilitado');
        }
    }
}

// Inicialización cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - versión simplificada');
    
    // Agregar event listeners a los selects
    const select1 = document.getElementById('dadoJugador1');
    const select2 = document.getElementById('dadoJugador2');
    
    if (select1) {
        select1.addEventListener('change', manejarSeleccionDado1);
    }
    
    if (select2) {
        select2.addEventListener('change', manejarSeleccionDado2);
    }
    
    console.log('🚀 INICIO DE LA APLICACIÓN');
    console.log('🚀 Estado inicial de variables:', {
        dadoJugador1: dadoJugador1,
        dadoJugador2: dadoJugador2,
        historialLanzamientos: historialLanzamientos,
        nombreJugador1: nombreJugador1,
        nombreJugador2: nombreJugador2
    });
    
    console.log('Event listeners agregados');
    
    // Configurar el modal de registro
    configurarModalRegistro();
    
    // Cargar y mostrar estadísticas
    cargarEstadisticas();
    
    // Configurar botón de limpiar estadísticas
    const btnLimpiarStats = document.getElementById('limpiarEstadisticas');
    if (btnLimpiarStats) {
        btnLimpiarStats.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres limpiar todas las estadísticas?')) {
                limpiarEstadisticas();
            }
        });
    }
});

// ===== FUNCIONES DEL MODAL DE REGISTRO =====
function configurarModalRegistro() {
    const btnComenzar = document.getElementById('btnComenzarJuego');
    const inputNombre1 = document.getElementById('nombreJugador1');
    const inputNombre2 = document.getElementById('nombreJugador2');
    
    if (btnComenzar) {
        btnComenzar.addEventListener('click', comenzarJuegoConNombres);
    }
    
    // Validación en tiempo real
    if (inputNombre1 && inputNombre2) {
        inputNombre1.addEventListener('input', validarNombres);
        inputNombre2.addEventListener('input', validarNombres);
    }
}

function validarNombres() {
    const inputNombre1 = document.getElementById('nombreJugador1');
    const inputNombre2 = document.getElementById('nombreJugador2');
    const btnComenzar = document.getElementById('btnComenzarJuego');
    
    const nombre1 = inputNombre1.value.trim();
    const nombre2 = inputNombre2.value.trim();
    
    if (btnComenzar) {
        btnComenzar.disabled = !(nombre1.length > 0 && nombre2.length > 0);
    }
}

function comenzarJuegoConNombres() {
    const inputNombre1 = document.getElementById('nombreJugador1');
    const inputNombre2 = document.getElementById('nombreJugador2');
    
    nombreJugador1 = inputNombre1.value.trim();
    nombreJugador2 = inputNombre2.value.trim();
    
    if (nombreJugador1 && nombreJugador2) {
        // Actualizar todos los elementos de la interfaz con los nombres
        actualizarNombresEnInterfaz();
        
        // Cerrar el modal
        const modal = document.getElementById('modalRegistro');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

function actualizarNombresEnInterfaz() {
    // Actualizar nombres en selección de dados
    const nombre1Display = document.getElementById('nombreJugador1Display');
    const nombre2Display = document.getElementById('nombreJugador2Display');
    
    if (nombre1Display) nombre1Display.textContent = nombreJugador1;
    if (nombre2Display) nombre2Display.textContent = nombreJugador2;
    
    // Actualizar nombres en área de lanzamiento
    const jugadorLabel1 = document.getElementById('jugadorLabel1');
    const jugadorLabel2 = document.getElementById('jugadorLabel2');
    
    if (jugadorLabel1) jugadorLabel1.textContent = nombreJugador1;
    if (jugadorLabel2) jugadorLabel2.textContent = nombreJugador2;
    
    // Actualizar nombres en marcador
    const marcadorJ1 = document.getElementById('marcadorJ1');
    const marcadorJ2 = document.getElementById('marcadorJ2');
    
    if (marcadorJ1) marcadorJ1.textContent = nombreJugador1;
    if (marcadorJ2) marcadorJ2.textContent = nombreJugador2;
    
    // Actualizar nombres en resultados
    const resultJ1Label = document.getElementById('resultJ1Label');
    const resultJ2Label = document.getElementById('resultJ2Label');
    
    if (resultJ1Label) resultJ1Label.textContent = nombreJugador1;
    if (resultJ2Label) resultJ2Label.textContent = nombreJugador2;
}

// ===== FUNCIÓN DE HISTORIAL =====
function actualizarHistorial(resultado1, resultado2, ganadorClass) {
    const nombre1 = nombreJugador1 || 'Jugador 1';
    const nombre2 = nombreJugador2 || 'Jugador 2';
    
    let textoGanador = '';
    if (ganadorClass === 'ganador-j1') {
        textoGanador = `${nombre1} gana`;
    } else if (ganadorClass === 'ganador-j2') {
        textoGanador = `${nombre2} gana`;
    } else {
        textoGanador = 'Empate';
    }
    
    const entradaHistorial = {
        ronda: rondaActual,
        jugador1: { nombre: nombre1, dado: dadoJugador1, resultado: resultado1 },
        jugador2: { nombre: nombre2, dado: dadoJugador2, resultado: resultado2 },
        ganador: textoGanador
    };
    
    historialLanzamientos.push(entradaHistorial);
    
    // Actualizar el display del historial
    mostrarHistorial();
}

function mostrarHistorial() {
    const historialElement = document.getElementById('historialLanzamientos');
    if (!historialElement) return;
    
    if (historialLanzamientos.length === 0) {
        historialElement.innerHTML = '<div class="historial-vacio">📋 No hay lanzamientos aún</div>';
        return;
    }
    
    let html = '<div class="historial-lista">';
    
    // Mostrar TODOS los lanzamientos de forma simple
    historialLanzamientos.forEach((entrada, index) => {
        // Verificar que la entrada tenga la estructura correcta
        if (!entrada.jugador1 || !entrada.jugador2) {
            return;
        }
        
        const claseGanador = entrada.ganador.includes(entrada.jugador1.nombre) ? 'ganador-j1' : 
                           entrada.ganador.includes(entrada.jugador2.nombre) ? 'ganador-j2' : 'empate';
        
        // FORMATO SIMPLE: Solo quién gana y con qué número
        let resultadoSimple = '';
        if (claseGanador === 'ganador-j1') {
            resultadoSimple = `${entrada.jugador1.nombre} gana con ${entrada.jugador1.resultado}`;
        } else if (claseGanador === 'ganador-j2') {
            resultadoSimple = `${entrada.jugador2.nombre} gana con ${entrada.jugador2.resultado}`;
        } else {
            resultadoSimple = `Empate con ${entrada.jugador1.resultado}`;
        }
        
        html += `
            <div class="entrada-historial ${claseGanador}" style="animation: slideIn 0.5s ease ${(index % 5) * 0.1}s both;">
                <div class="ronda-numero">🎲 Ronda ${entrada.ronda}</div>
                <div class="resultado-simple">${resultadoSimple}</div>
            </div>
        `;
    });
    
    html += '</div>';
    historialElement.innerHTML = html;
}

function limpiarHistorial() {
    historialLanzamientos = [];
    mostrarHistorial();
}

// ===== FUNCIONES DE ESTADÍSTICAS =====
function cargarEstadisticas() {
    const estadisticasGuardadas = localStorage.getItem('estadisticasCondorcet');
    if (estadisticasGuardadas) {
        estadisticas = JSON.parse(estadisticasGuardadas);
    }
    actualizarDisplayEstadisticas();
}

function guardarEstadisticas() {
    localStorage.setItem('estadisticasCondorcet', JSON.stringify(estadisticas));
}

function actualizarDisplayEstadisticas() {
    const elementos = {
        totalJuegos: document.getElementById('totalJuegos'),
        victoriasD1: document.getElementById('victoriasD1'),
        victoriasD2: document.getElementById('victoriasD2'),
        victoriasD3: document.getElementById('victoriasD3'),
        victoriasD4: document.getElementById('victoriasD4')
    };
    
    Object.entries(elementos).forEach(([key, elemento]) => {
        if (elemento) {
            elemento.textContent = estadisticas[key];
        }
    });
}

function registrarVictoria(dadoGanador) {
    estadisticas.totalJuegos++;
    estadisticas[`victorias${dadoGanador}`]++;
    guardarEstadisticas();
    actualizarDisplayEstadisticas();
}

function limpiarEstadisticas() {
    estadisticas = {
        totalJuegos: 0,
        victoriasD1: 0,
        victoriasD2: 0,
        victoriasD3: 0,
        victoriasD4: 0
    };
    guardarEstadisticas();
    actualizarDisplayEstadisticas();
}

console.log('Script simplificado cargado correctamente');