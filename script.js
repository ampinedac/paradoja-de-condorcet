// Configuración de los dados
const dados = {
    D1: [4, 4, 4, 4, 0, 0],
    D2: [3, 3, 3, 3, 3, 3],
    D3: [2, 2, 2, 2, 6, 6],
    D4: [5, 5, 5, 1, 1, 1]
};

// Variables del estado del juego
let juegoActivo = false;
let rondaActual = 0;
let puntosJugador1 = 0;
let puntosJugador2 = 0;
let dadoJugador1 = null;
let dadoJugador2 = null;
let historialCompleto = [];

// Estadísticas globales
let estadisticas = {
    totalJuegos: 0,
    victorias: {
        D1: 0,
        D2: 0,
        D3: 0,
        D4: 0
    }
};

// Cargar estadísticas del localStorage
function cargarEstadisticas() {
    const stats = localStorage.getItem('estadisticasCondorcet');
    if (stats) {
        estadisticas = JSON.parse(stats);
        actualizarDisplayEstadisticas();
    }
}

// Guardar estadísticas en localStorage
function guardarEstadisticas() {
    localStorage.setItem('estadisticasCondorcet', JSON.stringify(estadisticas));
    actualizarDisplayEstadisticas();
}

// Función para lanzar un dado
function lanzarDado(tipoDado) {
    const caras = dados[tipoDado];
    const indice = Math.floor(Math.random() * 6);
    return caras[indice];
}

// Calcular probabilidad de que dado1 gane a dado2 en un lanzamiento
function calcularProbabilidad(dado1, dado2) {
    const caras1 = dados[dado1];
    const caras2 = dados[dado2];
    let victorias = 0;
    let total = 0;
    
    for (let cara1 of caras1) {
        for (let cara2 of caras2) {
            total++;
            if (cara1 > cara2) {
                victorias++;
            }
        }
    }
    
    return (victorias / total);
}

// Calcular todas las probabilidades
function calcularTodasProbabilidades() {
    const tiposDados = ['D1', 'D2', 'D3', 'D4'];
    
    for (let i = 0; i < tiposDados.length; i++) {
        for (let j = 0; j < tiposDados.length; j++) {
            if (i !== j) {
                const dado1 = tiposDados[i];
                const dado2 = tiposDados[j];
                const prob = calcularProbabilidad(dado1, dado2);
                
                const celda = document.getElementById(`prob-${dado1}-${dado2}`);
                if (celda) {
                    const porcentaje = (prob * 100).toFixed(1);
                    celda.textContent = `${porcentaje}%`;
                    
                    // Colorear según la probabilidad
                    celda.classList.remove('alta', 'media', 'baja');
                    if (prob > 0.6) {
                        celda.classList.add('alta');
                    } else if (prob > 0.4) {
                        celda.classList.add('media');
                    } else {
                        celda.classList.add('baja');
                    }
                }
            }
        }
    }
    
    // Mostrar estrategia óptima
    mostrarEstrategiaOptima();
}

// Mostrar estrategia óptima
function mostrarEstrategiaOptima() {
    const estrategiaTexto = document.getElementById('estrategiaTexto');
    
    const analisis = `
        <h4>Análisis de la Paradoja de Condorcet:</h4>
        <p><strong>Resultado sorprendente:</strong> Estos dados forman un ciclo intransitivo donde:</p>
        <ul>
            <li>D1 vence a D2 con probabilidad ${(calcularProbabilidad('D1', 'D2') * 100).toFixed(1)}%</li>
            <li>D2 vence a D3 con probabilidad ${(calcularProbabilidad('D2', 'D3') * 100).toFixed(1)}%</li>
            <li>D3 vence a D4 con probabilidad ${(calcularProbabilidad('D3', 'D4') * 100).toFixed(1)}%</li>
            <li>D4 vence a D1 con probabilidad ${(calcularProbabilidad('D4', 'D1') * 100).toFixed(1)}%</li>
        </ul>
        
        <h4>Estrategia Óptima:</h4>
        <p><strong>Si eliges segundo:</strong> Siempre puedes elegir un dado que tenga ventaja sobre el dado del oponente.</p>
        <p><strong>Si eliges primero:</strong> No hay dado "mejor", ya que siempre existe uno que te vence con mayor probabilidad.</p>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #ffc107;">
            <strong>Conclusión:</strong> La mejor estrategia es elegir segundo, lo que demuestra que la ventaja no está en el dado seleccionado, 
            sino en el orden de selección. Esta es la esencia de la paradoja de Condorcet.
        </div>
    `;
    
    estrategiaTexto.innerHTML = analisis;
}

// Configurar event listeners
function configurarEventListeners() {
    // Selección de dados
    document.getElementById('dadoJugador1').addEventListener('change', function(e) {
        dadoJugador1 = e.target.value;
        actualizarDadoSeleccionado(1, dadoJugador1);
        verificarSeleccionCompleta();
    });
    
    document.getElementById('dadoJugador2').addEventListener('change', function(e) {
        dadoJugador2 = e.target.value;
        actualizarDadoSeleccionado(2, dadoJugador2);
        verificarSeleccionCompleta();
    });
    
    // Botones de juego
    document.getElementById('iniciarJuego').addEventListener('click', iniciarJuego);
    document.getElementById('lanzarDados').addEventListener('click', lanzarDadosJuego);
    document.getElementById('reiniciarJuego').addEventListener('click', reiniciarJuego);
    document.getElementById('limpiarEstadisticas').addEventListener('click', limpiarEstadisticas);
}

// Actualizar display del dado seleccionado
function actualizarDadoSeleccionado(jugador, dado) {
    const container = document.getElementById(`dadoSeleccionado${jugador}`);
    if (dado) {
        container.textContent = `${dado}: [${dados[dado].join(', ')}]`;
        container.classList.add('activo');
    } else {
        container.textContent = '';
        container.classList.remove('activo');
    }
}

// Verificar si ambos jugadores han seleccionado dados
function verificarSeleccionCompleta() {
    const iniciarBtn = document.getElementById('iniciarJuego');
    if (dadoJugador1 && dadoJugador2 && dadoJugador1 !== dadoJugador2) {
        iniciarBtn.disabled = false;
    } else {
        iniciarBtn.disabled = true;
    }
}

// Iniciar nuevo juego
function iniciarJuego() {
    juegoActivo = true;
    rondaActual = 0;
    puntosJugador1 = 0;
    puntosJugador2 = 0;
    historialCompleto = [];
    
    document.getElementById('iniciarJuego').disabled = true;
    document.getElementById('lanzarDados').disabled = false;
    document.getElementById('dadoJugador1').disabled = true;
    document.getElementById('dadoJugador2').disabled = true;
    
    actualizarDisplayJuego();
    limpiarHistorial();
    
    // Limpiar resultado anterior
    document.getElementById('ganadorFinal').innerHTML = '';
}

// Lanzar dados en el juego
function lanzarDadosJuego() {
    if (!juegoActivo || rondaActual >= 3) return;
    
    rondaActual++;
    
    // Animación de lanzamiento
    const resultadoJ1Element = document.getElementById('resultadoJ1');
    const resultadoJ2Element = document.getElementById('resultadoJ2');
    
    resultadoJ1Element.parentElement.classList.add('lanzando');
    resultadoJ2Element.parentElement.classList.add('lanzando');
    
    setTimeout(() => {
        const resultadoJ1 = lanzarDado(dadoJugador1);
        const resultadoJ2 = lanzarDado(dadoJugador2);
        
        resultadoJ1Element.textContent = resultadoJ1;
        resultadoJ2Element.textContent = resultadoJ2;
        
        let ganadorRonda = '';
        if (resultadoJ1 > resultadoJ2) {
            puntosJugador1++;
            ganadorRonda = 'Ganador: Jugador 1';
        } else if (resultadoJ2 > resultadoJ1) {
            puntosJugador2++;
            ganadorRonda = 'Ganador: Jugador 2';
        } else {
            ganadorRonda = 'Empate';
        }
        
        document.getElementById('ganadorRonda').textContent = ganadorRonda;
        
        // Agregar al historial
        const entradaHistorial = `Ronda ${rondaActual}: J1(${dadoJugador1})=${resultadoJ1} vs J2(${dadoJugador2})=${resultadoJ2} - ${ganadorRonda}`;
        agregarAlHistorial(entradaHistorial);
        
        actualizarDisplayJuego();
        
        // Verificar si el juego ha terminado
        if (puntosJugador1 >= 2 || puntosJugador2 >= 2 || rondaActual >= 3) {
            terminarJuego();
        }
        
        resultadoJ1Element.parentElement.classList.remove('lanzando');
        resultadoJ2Element.parentElement.classList.remove('lanzando');
    }, 500);
}

// Terminar juego
function terminarJuego() {
    juegoActivo = false;
    document.getElementById('lanzarDados').disabled = true;
    
    let ganadorFinal = '';
    let dadoGanador = '';
    
    if (puntosJugador1 > puntosJugador2) {
        ganadorFinal = '¡Jugador 1 GANA!';
        dadoGanador = dadoJugador1;
    } else if (puntosJugador2 > puntosJugador1) {
        ganadorFinal = '¡Jugador 2 GANA!';
        dadoGanador = dadoJugador2;
    } else {
        ganadorFinal = '¡EMPATE!';
    }
    
    document.getElementById('ganadorFinal').innerHTML = `
        <div>${ganadorFinal}</div>
        <div style="font-size: 0.9em; margin-top: 10px;">
            ${dadoGanador ? `Dado ganador: ${dadoGanador}` : 'Sin dado ganador'}
        </div>
    `;
    
    // Actualizar estadísticas
    if (dadoGanador) {
        estadisticas.victorias[dadoGanador]++;
    }
    estadisticas.totalJuegos++;
    guardarEstadisticas();
}

// Reiniciar juego
function reiniciarJuego() {
    juegoActivo = false;
    rondaActual = 0;
    puntosJugador1 = 0;
    puntosJugador2 = 0;
    dadoJugador1 = null;
    dadoJugador2 = null;
    historialCompleto = [];
    
    document.getElementById('dadoJugador1').value = '';
    document.getElementById('dadoJugador2').value = '';
    document.getElementById('dadoJugador1').disabled = false;
    document.getElementById('dadoJugador2').disabled = false;
    document.getElementById('iniciarJuego').disabled = true;
    document.getElementById('lanzarDados').disabled = true;
    
    document.getElementById('dadoSeleccionado1').textContent = '';
    document.getElementById('dadoSeleccionado1').classList.remove('activo');
    document.getElementById('dadoSeleccionado2').textContent = '';
    document.getElementById('dadoSeleccionado2').classList.remove('activo');
    
    actualizarDisplayJuego();
    limpiarHistorial();
    document.getElementById('ganadorFinal').innerHTML = '';
    document.getElementById('ganadorRonda').textContent = '';
    document.getElementById('resultadoJ1').textContent = '-';
    document.getElementById('resultadoJ2').textContent = '-';
}

// Actualizar display del juego
function actualizarDisplayJuego() {
    document.getElementById('rondaActual').textContent = rondaActual;
    document.getElementById('puntosJ1').textContent = puntosJugador1;
    document.getElementById('puntosJ2').textContent = puntosJugador2;
}

// Agregar entrada al historial
function agregarAlHistorial(entrada) {
    historialCompleto.unshift(entrada);
    const historialDiv = document.getElementById('historialLanzamientos');
    
    const entradaDiv = document.createElement('div');
    entradaDiv.className = 'entrada-historial';
    entradaDiv.textContent = entrada;
    
    historialDiv.insertBefore(entradaDiv, historialDiv.firstChild);
    
    // Mantener solo las últimas 10 entradas en el display
    while (historialDiv.children.length > 10) {
        historialDiv.removeChild(historialDiv.lastChild);
    }
}

// Limpiar historial
function limpiarHistorial() {
    document.getElementById('historialLanzamientos').innerHTML = '';
}

// Actualizar display de estadísticas
function actualizarDisplayEstadisticas() {
    document.getElementById('totalJuegos').textContent = estadisticas.totalJuegos;
    document.getElementById('victoriasD1').textContent = estadisticas.victorias.D1;
    document.getElementById('victoriasD2').textContent = estadisticas.victorias.D2;
    document.getElementById('victoriasD3').textContent = estadisticas.victorias.D3;
    document.getElementById('victoriasD4').textContent = estadisticas.victorias.D4;
}

// Limpiar estadísticas
function limpiarEstadisticas() {
    if (confirm('¿Estás seguro de que quieres limpiar todas las estadísticas?')) {
        estadisticas = {
            totalJuegos: 0,
            victorias: {
                D1: 0,
                D2: 0,
                D3: 0,
                D4: 0
            }
        };
        guardarEstadisticas();
    }
}

// Función para simular múltiples juegos (para análisis)
function simularJuegos(dado1, dado2, numeroJuegos = 1000) {
    let victoriasDado1 = 0;
    
    for (let juego = 0; juego < numeroJuegos; juego++) {
        let puntosDado1 = 0;
        let puntosDado2 = 0;
        
        for (let ronda = 0; ronda < 3 && puntosDado1 < 2 && puntosDado2 < 2; ronda++) {
            const resultado1 = lanzarDado(dado1);
            const resultado2 = lanzarDado(dado2);
            
            if (resultado1 > resultado2) {
                puntosDado1++;
            } else if (resultado2 > resultado1) {
                puntosDado2++;
            }
        }
        
        if (puntosDado1 > puntosDado2) {
            victoriasDado1++;
        }
    }
    
    return victoriasDado1 / numeroJuegos;
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    configurarEventListeners();
    calcularTodasProbabilidades();
    cargarEstadisticas();
    
    // Agregar funcionalidad de simulación para desarrolladores (se puede activar desde consola)
    window.simularJuegos = simularJuegos;
    window.dados = dados;
    window.calcularProbabilidad = calcularProbabilidad;
    
    console.log('🎲 Paradoja de Condorcet cargada');
    console.log('💡 Usa simularJuegos("D1", "D2", 1000) para simular 1000 juegos');
    console.log('📊 Usa calcularProbabilidad("D1", "D2") para probabilidades exactas');
});