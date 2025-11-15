// Variables globales
let dadoJugador1 = '';
let dadoJugador2 = '';
let juegoActivo = false;
let puntosJugador1 = 0;
let puntosJugador2 = 0;
let rondaActual = 1;
let estadisticas = {
    J1: { wins: 0, total: 0, resultados: [] },
    J2: { wins: 0, total: 0, resultados: [] }
};

// Función de debugging global
window.debugCondorcet = function() {
    console.log('=== DEBUG CONDORCET ===');
    console.log('dadoJugador1:', dadoJugador1);
    console.log('dadoJugador2:', dadoJugador2);
    console.log('juegoActivo:', juegoActivo);
    console.log('Elementos:');
    console.log('- dadoJugador1 select:', document.getElementById('dadoJugador1'));
    console.log('- dadoJugador2 select:', document.getElementById('dadoJugador2'));
    console.log('- iniciarJuego button:', document.getElementById('iniciarJuego'));
    console.log('- lanzarDados button:', document.getElementById('lanzarDados'));
    console.log('- areaLanzamiento:', document.getElementById('areaLanzamiento'));
    console.log('======================');
};

// Definición de dados con sus valores
const dados = {
    'D1': [4, 4, 4, 4, 0, 0],
    'D2': [3, 3, 3, 3, 3, 3],
    'D3': [2, 2, 2, 2, 6, 6],
    'D4': [5, 5, 5, 1, 1, 1]
};

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');
    
    // Cargar datos y configurar
    cargarEstadisticas();
    calcularTodasProbabilidades();
    mostrarEstrategiaOptima();
    
    // Configurar event listeners de forma más segura
    const dadoJ1 = document.getElementById('dadoJugador1');
    const dadoJ2 = document.getElementById('dadoJugador2');
    const btnIniciar = document.getElementById('iniciarJuego');
    const btnLanzar = document.getElementById('lanzarDados');
    const btnReiniciar = document.getElementById('reiniciarJuego');
    const btnLimpiar = document.getElementById('limpiarEstadisticas');
    
    if (dadoJ1) {
        dadoJ1.addEventListener('change', function(e) {
            dadoJugador1 = e.target.value;
            actualizarDadoSeleccionado(1, dadoJugador1);
            verificarSeleccionCompleta();
        });
    }
    
    if (dadoJ2) {
        dadoJ2.addEventListener('change', function(e) {
            dadoJugador2 = e.target.value;
            actualizarDadoSeleccionado(2, dadoJugador2);
            verificarSeleccionCompleta();
        });
    }
    
    if (btnIniciar) {
        btnIniciar.addEventListener('click', function() {
            console.log('Clic en iniciar juego');
            iniciarJuego();
        });
    }
    
    if (btnLanzar) {
        btnLanzar.addEventListener('click', function() {
            console.log('Clic en lanzar dados');
            lanzarDadosJuego();
        });
    }
    
    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', reiniciarJuego);
    }
    
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarEstadisticas);
    }
    
    // Configurar año
    const anioElement = document.getElementById('anio');
    if (anioElement) {
        anioElement.textContent = new Date().getFullYear();
    }
    
    console.log('Inicialización completa');
});

// Cargar estadísticas guardadas
function cargarEstadisticas() {
    const stats = localStorage.getItem('condorcetStats');
    if (stats) {
        estadisticas = JSON.parse(stats);
    }
}

// Guardar estadísticas
function guardarEstadisticas() {
    localStorage.setItem('condorcetStats', JSON.stringify(estadisticas));
}

// Función para lanzar un dado
function lanzarDado(tipoDado) {
    const caras = dados[tipoDado];
    const indice = Math.floor(Math.random() * 6);
    return caras[indice];
}

// Calcular probabilidad de victoria entre dos dados
function calcularProbabilidad(dado1, dado2) {
    const caras1 = dados[dado1];
    const caras2 = dados[dado2];
    let wins1 = 0;
    let wins2 = 0;
    let empates = 0;
    
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (caras1[i] > caras2[j]) {
                wins1++;
            } else if (caras1[i] < caras2[j]) {
                wins2++;
            } else {
                empates++;
            }
        }
    }
    
    return {
        p1: (wins1 / 36) * 100,
        p2: (wins2 / 36) * 100,
        empate: (empates / 36) * 100
    };
}

// Calcular todas las probabilidades y mostrar matriz
function calcularTodasProbabilidades() {
    const dadosNombres = ['D1', 'D2', 'D3', 'D4'];
    const matriz = document.getElementById('matriz-probabilidades');
    
    let html = '<table class="probability-table"><thead><tr><th></th>';
    dadosNombres.forEach(dado => {
        html += `<th>${dado}<br><small>[${dados[dado].join(',')}]</small></th>`;
    });
    html += '</tr></thead><tbody>';
    
    dadosNombres.forEach(dado1 => {
        html += `<tr><th>${dado1}<br><small>[${dados[dado1].join(',')}]</small></th>`;
        dadosNombres.forEach(dado2 => {
            if (dado1 === dado2) {
                html += '<td class="mismo-dado">50%</td>';
            } else {
                const prob = calcularProbabilidad(dado1, dado2);
                const porcentaje = prob.p1.toFixed(1);
                let clase = '';
                if (prob.p1 > 50) clase = 'ventaja-alta';
                else if (prob.p1 < 50) clase = 'desventaja';
                else clase = 'empate';
                html += `<td class="${clase}">${porcentaje}%</td>`;
            }
        });
        html += '</tr>';
    });
    html += '</tbody></table>';
    matriz.innerHTML = html;
}

// Mostrar estrategia óptima
function mostrarEstrategiaOptima() {
    const estrategiaDiv = document.getElementById('estrategia-optima');
    estrategiaDiv.innerHTML = `
        <div class="estrategia-card">
            <h4>🎯 Estrategia Óptima</h4>
            <div class="estrategia-content">
                <p><strong>Si el oponente elige primero:</strong></p>
                <ul>
                    <li><strong>Contra D1:</strong> Usa D2 (probabilidad 66.7%)</li>
                    <li><strong>Contra D2:</strong> Usa D3 (probabilidad 55.6%)</li>
                    <li><strong>Contra D3:</strong> Usa D4 (probabilidad 55.6%)</li>
                    <li><strong>Contra D4:</strong> Usa D1 (probabilidad 66.7%)</li>
                </ul>
                <p class="paradoja-explicacion">
                    <strong>🔄 Paradoja:</strong> Cada dado puede ganar al siguiente, pero ninguno es el mejor absoluto.
                    Es como "piedra, papel, tijera" pero con probabilidades.
                </p>
            </div>
        </div>
    `;
}

// Actualizar visualización del dado seleccionado
function actualizarDadoSeleccionado(jugador, dado) {
    const elemento = document.getElementById(`dadoSeleccionado${jugador}`);
    if (dado) {
        elemento.textContent = `${dado} [${dados[dado].join(', ')}]`;
        elemento.classList.add('activo');
    } else {
        elemento.textContent = '';
        elemento.classList.remove('activo');
    }
}

// Verificar si ambos jugadores han seleccionado dados
function verificarSeleccionCompleta() {
    console.log('Verificando selección:', dadoJugador1, dadoJugador2);
    
    const btnIniciar = document.getElementById('iniciarJuego');
    if (!btnIniciar) {
        console.error('Botón iniciar no encontrado');
        return;
    }
    
    if (dadoJugador1 && dadoJugador2) {
        console.log('Ambos dados seleccionados - habilitando botón');
        btnIniciar.disabled = false;
        actualizarOpcionesDisponibles();
        mostrarProbabilidades();
    } else {
        console.log('Faltan dados - deshabilitando botón');
        btnIniciar.disabled = true;
    }
}

// Función separada para mostrar probabilidades
function mostrarProbabilidades() {
    if (!dadoJugador1 || !dadoJugador2) return;
    
    const prob = calcularProbabilidad(dadoJugador1, dadoJugador2);
    const infoProb = document.getElementById('info-probabilidades') || crearInfoProbabilidades();
    infoProb.innerHTML = `
        <div class="probabilidades-actuales">
            <h4>📊 Probabilidades de esta selección</h4>
            <div class="prob-row">
                <span>🎲 ${dadoJugador1}: <strong>${prob.p1.toFixed(1)}%</strong></span>
                <span>🎲 ${dadoJugador2}: <strong>${prob.p2.toFixed(1)}%</strong></span>
                <span>🤝 Empate: <strong>${prob.empate.toFixed(1)}%</strong></span>
            </div>
        </div>
    `;
}

// Crear elemento para mostrar probabilidades
function crearInfoProbabilidades() {
    const info = document.createElement('div');
    info.id = 'info-probabilidades';
    info.className = 'info-probabilidades';
    document.querySelector('.selector-dados').appendChild(info);
    return info;
}

// Actualizar opciones disponibles según selecciones
function actualizarOpcionesDisponibles() {
    const select1 = document.getElementById('dadoJugador1');
    const select2 = document.getElementById('dadoJugador2');
    
    // Crear arrays de opciones
    const opciones = ['D1', 'D2', 'D3', 'D4'];
    
    [select1, select2].forEach((select, index) => {
        const valorActual = select.value;
        const otroValor = index === 0 ? dadoJugador2 : dadoJugador1;
        
        Array.from(select.querySelectorAll('option')).forEach(option => {
            if (option.value && option.value !== valorActual) {
                option.disabled = option.value === otroValor;
                option.style.opacity = option.disabled ? '0.5' : '1';
            }
        });
    });
}

// Iniciar juego
function iniciarJuego() {
    console.log('INICIANDO JUEGO');
    
    if (!dadoJugador1 || !dadoJugador2) {
        alert('⚠️ Por favor selecciona ambos dados antes de iniciar');
        return;
    }
    
    // Reiniciar contadores
    juegoActivo = true;
    puntosJugador1 = 0;
    puntosJugador2 = 0;
    rondaActual = 1;
    
    // Obtener elementos
    const dadoJ1Select = document.getElementById('dadoJugador1');
    const dadoJ2Select = document.getElementById('dadoJugador2');
    const btnIniciar = document.getElementById('iniciarJuego');
    const btnLanzar = document.getElementById('lanzarDados');
    const areaLanzamiento = document.getElementById('areaLanzamiento');
    
    // Configurar controles
    if (dadoJ1Select) dadoJ1Select.disabled = true;
    if (dadoJ2Select) dadoJ2Select.disabled = true;
    if (btnIniciar) btnIniciar.disabled = true;
    
    if (btnLanzar) {
        btnLanzar.disabled = false;
        btnLanzar.textContent = '🎲 Lanzar Dados';
        console.log('Botón lanzar dados habilitado');
    } else {
        console.error('ERROR: Botón lanzar dados no encontrado');
    }
    
    if (areaLanzamiento) {
        areaLanzamiento.style.display = 'block';
        console.log('Área de lanzamiento mostrada');
    }
    
    // Configurar dados de lanzamiento
    configurarDadosLanzamiento();
    
    // Actualizar display
    actualizarDisplayJuego();
    
    console.log('Juego iniciado exitosamente');
}

// Configurar los dados de lanzamiento 3D
function configurarDadosLanzamiento() {
    const dadoJ1Element = document.getElementById('dadoLanzamientoJ1');
    const dadoJ2Element = document.getElementById('dadoLanzamientoJ2');
    
    // Configurar caras del dado del jugador 1
    const carasJ1 = dados[dadoJugador1];
    const carasElementsJ1 = dadoJ1Element.querySelectorAll('.cara-lanz-3d');
    carasElementsJ1.forEach((cara, index) => {
        cara.textContent = carasJ1[index];
        if (carasJ1[index] === 6) {
            cara.classList.add('seis');
        } else {
            cara.classList.remove('seis');
        }
    });
    
    // Configurar caras del dado del jugador 2
    const carasJ2 = dados[dadoJugador2];
    const carasElementsJ2 = dadoJ2Element.querySelectorAll('.cara-lanz-3d');
    carasElementsJ2.forEach((cara, index) => {
        cara.textContent = carasJ2[index];
        if (carasJ2[index] === 6) {
            cara.classList.add('seis');
        } else {
            cara.classList.remove('seis');
        }
    });
    
    console.log(`🔧 Dados configurados: J1=${JSON.stringify(carasJ1)}, J2=${JSON.stringify(carasJ2)}`);
}

// Lanzar dados del juego con animación 3D realista
function lanzarDadosJuego() {
    if (!juegoActivo) return;
    
    document.getElementById('lanzarDados').disabled = true;
    document.getElementById('ganadorLanzamiento').textContent = 'Preparando lanzamiento...';
    
    // Obtener elementos de dados y sus cubos internos
    const dadoJ1Element = document.getElementById('dadoLanzamientoJ1');
    const dadoJ2Element = document.getElementById('dadoLanzamientoJ2');
    const cuboJ1 = dadoJ1Element.querySelector('.dado-cubo');
    const cuboJ2 = dadoJ2Element.querySelector('.dado-cubo');
    
    // Limpiar clases anteriores y resetear posición
    cuboJ1.classList.remove('dado-resultado-final');
    cuboJ2.classList.remove('dado-resultado-final');
    cuboJ1.className = 'dado-cubo';
    cuboJ2.className = 'dado-cubo';
    cuboJ1.style.animation = '';
    cuboJ2.style.animation = '';
    
    // Pequeña pausa para mostrar que van a ser lanzados
    setTimeout(() => {
        // Agregar animación de dados rodando
        cuboJ1.style.animation = 'dadoRodando 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        cuboJ2.style.animation = 'dadoRodando 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        
        document.getElementById('ganadorLanzamiento').textContent = '🎲 Dados rodando...';
        
        // Simular sonidos de dados realistas
        console.log('🎲 *Sonido inicial: CLIC-CLIC* (dados chocando)');
        
        setTimeout(() => {
            console.log('🔊 *Sonido: TAKA-TAKA-TAKA* (dados rodando en la superficie)');
        }, 800);
        
        setTimeout(() => {
            console.log('🔊 *Sonido: TAK... TAK... tak* (dados perdiendo velocidad)');
        }, 1800);
        
        setTimeout(() => {
            console.log('🔊 *Sonido final: CLONK* (dados se detienen)');
        }, 2300);
        
        setTimeout(() => {
            // Obtener resultados
            const resultadoJ1 = lanzarDado(dadoJugador1);
            const resultadoJ2 = lanzarDado(dadoJugador2);
            
            // Mostrar resultados finales con rotación a la cara correcta
            mostrarResultadoFinalRealista(resultadoJ1, resultadoJ2, cuboJ1, cuboJ2);
            
        }, 2500); // Duración de la animación de dados rodando (2.5 segundos)
        
    }, 500); // Pausa inicial para mostrar dados listos
}

// Mostrar resultado final con rotación realista a la cara correcta
function mostrarResultadoFinalRealista(resultadoJ1, resultadoJ2, cuboJ1, cuboJ2) {
    // Detener la animación de rodado
    cuboJ1.style.animation = '';
    cuboJ2.style.animation = '';
    
    // Agregar clase de transición suave
    cuboJ1.classList.add('dado-resultado-final');
    cuboJ2.classList.add('dado-resultado-final');
    
    // Determinar qué cara mostrar según el resultado y rotar hacia ella
    const caraJ1 = determinarCaraParaResultado(resultadoJ1, dadoJugador1);
    const caraJ2 = determinarCaraParaResultado(resultadoJ2, dadoJugador2);
    
    // Aplicar rotación para mostrar la cara correcta
    cuboJ1.classList.add(caraJ1);
    cuboJ2.classList.add(caraJ2);
    
    // Actualizar los resultados en pantalla
    document.getElementById('resultadoLanzJ1').textContent = resultadoJ1;
    document.getElementById('resultadoLanzJ2').textContent = resultadoJ2;
    
    // Después de la rotación, agregar animación de rebote
    setTimeout(() => {
        cuboJ1.style.animation = 'rebote3D 0.6s ease-out';
        cuboJ2.style.animation = 'rebote3D 0.6s ease-out';
        
        // Determinar y mostrar ganador
        let mensaje = '';
        if (resultadoJ1 > resultadoJ2) {
            mensaje = '🏆 ¡Jugador 1 gana esta ronda!';
            document.getElementById('resultadoLanzJ1').classList.add('resultado-brillando-3d');
            puntosJugador1++;
        } else if (resultadoJ2 > resultadoJ1) {
            mensaje = '🏆 ¡Jugador 2 gana esta ronda!';
            document.getElementById('resultadoLanzJ2').classList.add('resultado-brillando-3d');
            puntosJugador2++;
        } else {
            mensaje = '🤝 ¡Empate!';
        }
        
        document.getElementById('ganadorLanzamiento').textContent = mensaje;
        
        // Actualizar estadísticas
        actualizarEstadisticas(resultadoJ1, resultadoJ2);
        actualizarDisplayJuego();
        
        // Agregar al historial
        agregarAlHistorial(`Ronda ${rondaActual}: J1=${resultadoJ1}, J2=${resultadoJ2} - ${mensaje}`);
        
        rondaActual++;
        console.log(`✅ Ronda completada: J1=${resultadoJ1}, J2=${resultadoJ2} - ${mensaje}`);
        
        // Verificar si hay ganador del juego
        setTimeout(() => {
            if (puntosJugador1 >= 2 || puntosJugador2 >= 2 || rondaActual > 3) {
                terminarJuego();
            } else {
                // Preparar para siguiente ronda
                document.getElementById('lanzarDados').disabled = false;
                document.getElementById('lanzarDados').textContent = `🎲 Lanzar Ronda ${rondaActual}`;
            }
        }, 2000);
        
    }, 800); // Tiempo para que complete la rotación
}

// Determinar qué cara del dado debe mostrarse según el resultado
function determinarCaraParaResultado(resultado, tipoDado) {
    const carasDelDado = dados[tipoDado];
    
    // Encontrar en qué posición está este resultado en el dado
    const indiceCaraConResultado = carasDelDado.indexOf(resultado);
    
    // Mapear cada índice de cara a su clase CSS correspondiente
    const mapeoCaras = [
        'mostrar-cara-frente',    // índice 0
        'mostrar-cara-atras',     // índice 1  
        'mostrar-cara-derecha',   // índice 2
        'mostrar-cara-izquierda', // índice 3
        'mostrar-cara-arriba',    // índice 4
        'mostrar-cara-abajo'      // índice 5
    ];
    
    return mapeoCaras[indiceCaraConResultado] || 'mostrar-cara-frente';
}

// Terminar juego
function terminarJuego() {
    juegoActivo = false;
    document.getElementById('lanzarDados').disabled = true;
    
    let ganadorFinal = '';
    let dadoGanador = '';
    
    if (puntosJugador1 > puntosJugador2) {
        ganadorFinal = '🎉 ¡Jugador 1 GANA!';
        dadoGanador = dadoJugador1;
    } else if (puntosJugador2 > puntosJugador1) {
        ganadorFinal = '🎉 ¡Jugador 2 GANA!';
        dadoGanador = dadoJugador2;
    } else {
        ganadorFinal = '🤝 ¡EMPATE!';
    }
    
    document.getElementById('ganadorFinal').innerHTML = `
        <div style="font-size: 1.4em; margin-bottom: 10px;">${ganadorFinal}</div>
        <div style="font-size: 1em; color: #666;">
            ${dadoGanador ? `Dado ganador: ${dadoGanador} [${dados[dadoGanador].join(', ')}]` : 'Sin dado ganador'}
        </div>
        <div style="margin-top: 15px;">
            <small>Marcador final: ${puntosJugador1} - ${puntosJugador2}</small>
        </div>
    `;
    
    console.log(`🏁 Juego terminado: ${ganadorFinal} - Marcador: ${puntosJugador1}-${puntosJugador2}`);
}

// Reiniciar juego
function reiniciarJuego() {
    // Reiniciar variables
    juegoActivo = false;
    puntosJugador1 = 0;
    puntosJugador2 = 0;
    rondaActual = 1;
    dadoJugador1 = '';
    dadoJugador2 = '';
    
    // Resetear selecciones
    document.getElementById('dadoJugador1').value = '';
    document.getElementById('dadoJugador2').value = '';
    document.getElementById('dadoJugador1').disabled = false;
    document.getElementById('dadoJugador2').disabled = false;
    document.getElementById('iniciarJuego').disabled = true;
    document.getElementById('lanzarDados').disabled = true;
    document.getElementById('lanzarDados').textContent = '🎲 Lanzar Dados';
    
    // Ocultar área de lanzamiento
    document.getElementById('areaLanzamiento').style.display = 'none';
    
    // Limpiar displays de dados seleccionados
    document.getElementById('dadoSeleccionado1').textContent = '';
    document.getElementById('dadoSeleccionado1').classList.remove('activo');
    document.getElementById('dadoSeleccionado2').textContent = '';
    document.getElementById('dadoSeleccionado2').classList.remove('activo');
    
    // Limpiar resultados
    actualizarDisplayJuego();
    limpiarHistorial();
    document.getElementById('ganadorFinal').innerHTML = '';
    document.getElementById('ganadorRonda').textContent = '';
    document.getElementById('resultadoJ1').textContent = '-';
    document.getElementById('resultadoJ2').textContent = '-';
    
    // Limpiar área de lanzamiento
    document.getElementById('resultadoLanzJ1').textContent = '?';
    document.getElementById('resultadoLanzJ2').textContent = '?';
    document.getElementById('ganadorLanzamiento').textContent = '';
    
    // Limpiar animaciones 3D si las hay
    const dadoJ1Element = document.getElementById('dadoLanzamientoJ1');
    const dadoJ2Element = document.getElementById('dadoLanzamientoJ2');
    const resultadoLanzJ1 = document.getElementById('resultadoLanzJ1');
    const resultadoLanzJ2 = document.getElementById('resultadoLanzJ2');
    
    if (dadoJ1Element && dadoJ2Element) {
        const cuboJ1 = dadoJ1Element.querySelector('.dado-cubo');
        const cuboJ2 = dadoJ2Element.querySelector('.dado-cubo');
        
        if (cuboJ1 && cuboJ2) {
            // Limpiar todas las clases de animación y resultado
            cuboJ1.classList.remove('dado-resultado-final');
            cuboJ2.classList.remove('dado-resultado-final');
            cuboJ1.className = 'dado-cubo'; // Resetear a clase base
            cuboJ2.className = 'dado-cubo'; // Resetear a clase base
            cuboJ1.style.animation = '';
            cuboJ2.style.animation = '';
        }
    }
    
    if (resultadoLanzJ1 && resultadoLanzJ2) {
        resultadoLanzJ1.classList.remove('resultado-brillando-3d');
        resultadoLanzJ2.classList.remove('resultado-brillando-3d');
    }
    
    console.log('🔄 Juego reiniciado - Selecciona nuevos dados');
}

// Actualizar display del juego
function actualizarDisplayJuego() {
    document.getElementById('rondaActual').textContent = rondaActual;
    document.getElementById('puntosJ1').textContent = puntosJugador1;
    document.getElementById('puntosJ2').textContent = puntosJugador2;
}

// Agregar entrada al historial
function agregarAlHistorial(entrada) {
    const historial = document.getElementById('historial-juego');
    const nuevaEntrada = document.createElement('div');
    nuevaEntrada.className = 'historial-entrada';
    nuevaEntrada.textContent = entrada;
    historial.insertBefore(nuevaEntrada, historial.firstChild);
    
    // Limitar historial a 10 entradas
    if (historial.children.length > 10) {
        historial.removeChild(historial.lastChild);
    }
}

// Limpiar historial
function limpiarHistorial() {
    document.getElementById('historial-juego').innerHTML = '';
}

// Actualizar estadísticas
function actualizarEstadisticas(resultadoJ1, resultadoJ2) {
    estadisticas.J1.total++;
    estadisticas.J2.total++;
    estadisticas.J1.resultados.push(resultadoJ1);
    estadisticas.J2.resultados.push(resultadoJ2);
    
    if (resultadoJ1 > resultadoJ2) {
        estadisticas.J1.wins++;
    } else if (resultadoJ2 > resultadoJ1) {
        estadisticas.J2.wins++;
    }
    
    // Actualizar display de estadísticas
    const winRateJ1 = estadisticas.J1.total > 0 ? (estadisticas.J1.wins / estadisticas.J1.total * 100).toFixed(1) : 0;
    const winRateJ2 = estadisticas.J2.total > 0 ? (estadisticas.J2.wins / estadisticas.J2.total * 100).toFixed(1) : 0;
    
    document.getElementById('winRateJ1').textContent = `${winRateJ1}%`;
    document.getElementById('winRateJ2').textContent = `${winRateJ2}%`;
    document.getElementById('totalRondasJ1').textContent = estadisticas.J1.total;
    document.getElementById('totalRondasJ2').textContent = estadisticas.J2.total;
    
    guardarEstadisticas();
}

// Limpiar estadísticas
function limpiarEstadisticas() {
    estadisticas = {
        J1: { wins: 0, total: 0, resultados: [] },
        J2: { wins: 0, total: 0, resultados: [] }
    };
    
    // Actualizar displays
    document.getElementById('winRateJ1').textContent = '0%';
    document.getElementById('winRateJ2').textContent = '0%';
    document.getElementById('totalRondasJ1').textContent = '0';
    document.getElementById('totalRondasJ2').textContent = '0';
    
    guardarEstadisticas();
    console.log('📊 Estadísticas limpiadas');
}