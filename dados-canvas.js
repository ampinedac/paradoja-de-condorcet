// ===== ALTERNATIVA 3: DADOS CON CANVAS (MÁS REALISTA) =====

class DadoCanvas {
    constructor(canvasId, valor = 1) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.valor = valor;
        this.rotacion = { x: 0, y: 0, z: 0 };
        this.animando = false;
        
        this.canvas.width = 100;
        this.canvas.height = 100;
        
        this.dibujar();
    }
    
    dibujar() {
        const ctx = this.ctx;
        const size = 40;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sombra
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(centerX - size/2 + 5, centerY - size/2 + 5, size, size);
        
        // Cara principal (frente)
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(centerX - size/2, centerY - size/2, size, size);
        
        // Cara superior (efecto 3D)
        ctx.fillStyle = '#c0392b';
        ctx.beginPath();
        ctx.moveTo(centerX - size/2, centerY - size/2);
        ctx.lineTo(centerX, centerY - size/2 - 15);
        ctx.lineTo(centerX + size/2, centerY - size/2 - 15);
        ctx.lineTo(centerX + size/2, centerY - size/2);
        ctx.fill();
        
        // Cara derecha (efecto 3D)
        ctx.fillStyle = '#a93226';
        ctx.beginPath();
        ctx.moveTo(centerX + size/2, centerY - size/2);
        ctx.lineTo(centerX + size/2 + 15, centerY - size/2 - 5);
        ctx.lineTo(centerX + size/2 + 15, centerY + size/2 - 5);
        ctx.lineTo(centerX + size/2, centerY + size/2);
        ctx.fill();
        
        // Bordes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - size/2, centerY - size/2, size, size);
        
        // Dibujar puntos según el valor
        this.dibujarPuntos(centerX, centerY, size);
    }
    
    dibujarPuntos(centerX, centerY, size) {
        const ctx = this.ctx;
        const radius = 4;
        
        ctx.fillStyle = 'white';
        
        switch(this.valor) {
            case 1:
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 2:
                ctx.beginPath();
                ctx.arc(centerX - 10, centerY - 10, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX + 10, centerY + 10, radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 3:
                ctx.beginPath();
                ctx.arc(centerX - 10, centerY - 10, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX + 10, centerY + 10, radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 4:
                ctx.beginPath();
                ctx.arc(centerX - 10, centerY - 10, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX + 10, centerY - 10, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX - 10, centerY + 10, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX + 10, centerY + 10, radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 5:
                // 4 esquinas + centro
                ctx.beginPath();
                ctx.arc(centerX - 10, centerY - 10, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX + 10, centerY - 10, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX - 10, centerY + 10, radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(centerX + 10, centerY + 10, radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 6:
                // 3 columnas de 2
                for(let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(centerX - 15 + i*15, centerY - 8, radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(centerX - 15 + i*15, centerY + 8, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case 0:
                // Sin puntos para el valor 0
                break;
        }
    }
    
    animar(valorFinal, callback) {
        if (this.animando) return;
        
        this.animando = true;
        const duracion = 1500;
        const inicio = Date.now();
        
        const animate = () => {
            const ahora = Date.now();
            const progreso = Math.min((ahora - inicio) / duracion, 1);
            
            // Rotación más dramática
            const rotaciones = 6; // 6 vueltas completas
            this.rotacion.z = progreso * rotaciones * 360;
            
            // Escala y posición durante animación
            const escala = 1 + Math.sin(progreso * Math.PI * 4) * 0.2;
            const offsetY = Math.sin(progreso * Math.PI * 8) * 10;
            
            // Aplicar transformaciones
            this.ctx.save();
            this.ctx.translate(this.canvas.width/2, this.canvas.height/2 + offsetY);
            this.ctx.scale(escala, escala);
            this.ctx.rotate((this.rotacion.z * Math.PI) / 180);
            this.ctx.translate(-this.canvas.width/2, -this.canvas.height/2 - offsetY);
            
            // Cambiar valor aleatoriamente durante animación
            if (progreso < 0.9) {
                this.valor = Math.floor(Math.random() * 6) + 1;
            } else {
                this.valor = valorFinal;
            }
            
            this.dibujar();
            this.ctx.restore();
            
            if (progreso < 1) {
                requestAnimationFrame(animate);
            } else {
                this.valor = valorFinal;
                this.dibujar();
                this.animando = false;
                if (callback) callback();
            }
        };
        
        animate();
    }
}

// Función para crear dados Canvas
function crearDadoCanvas(containerId, valor = 1) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    // Crear canvas
    const canvas = document.createElement('canvas');
    canvas.style.width = '100px';
    canvas.style.height = '100px';
    canvas.style.border = 'none';
    canvas.style.borderRadius = '10px';
    canvas.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    canvas.id = containerId + '_canvas';
    
    container.innerHTML = '';
    container.appendChild(canvas);
    
    return new DadoCanvas(canvas.id, valor);
}