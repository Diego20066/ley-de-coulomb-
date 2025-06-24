function calcularCargas() {
  const q1 = parseFloat(document.getElementById('q1').value);
  const q2 = parseFloat(document.getElementById('q2').value);
  const q3 = parseFloat(document.getElementById('q3').value);

  const u1 = parseFloat(document.getElementById('unidad-q1').value);
  const u2 = parseFloat(document.getElementById('unidad-q2').value);
  const u3 = parseFloat(document.getElementById('unidad-q3').value);

  const distancia = parseFloat(document.getElementById("r").value);
  const k = 8.9875e9;

  if (isNaN(q1) || isNaN(q2) || isNaN(q3) || isNaN(distancia) || distancia === 0) {
    alert("Por favor completa todos los datos correctamente.");
    return;
  }

  const q1_si = q1 * u1;
  const q2_si = q2 * u2;
  const q3_si = q3 * u3;

  const calcularFuerza = (qA, qB) => (k * Math.abs(qA * qB)) / (distancia ** 2);
  const f13 = calcularFuerza(q1_si, q3_si);
  const f23 = calcularFuerza(q2_si, q3_si);

  const tipo13 = (q1 * q3) > 0 ? "repulsión" : "atracción";
  const tipo23 = (q2 * q3) > 0 ? "repulsión" : "atracción";

  const signo13 = tipo13 === "repulsión" ? 1 : -1;
  const signo23 = tipo23 === "repulsión" ? 1 : -1;

  // Componentes en X y Y
  const angulo13 = 60 * Math.PI / 180; // 60 grados
  const angulo23 = 120 * Math.PI / 180; // 120 grados

  const f13x = signo13 * f13 * Math.cos(angulo13);
  const f13y = signo13 * f13 * Math.sin(angulo13);

  const f23x = signo23 * f23 * Math.cos(angulo23);
  const f23y = signo23 * f23 * Math.sin(angulo23);

  // Resultante en X y Y
  const FRx = f13x + f23x;
  const FRy = f13y + f23y;

  // Magnitud total
  const FR = Math.sqrt(FRx ** 2 + FRy ** 2);

  // Ángulo en grados
  let theta = Math.atan2(FRy, FRx) * 180 / Math.PI;
  if (theta < 0) {
    theta += 360; // Para que quede en [0°, 360°]
  }

  function formatoExponente(valor) {
    if (valor === 1e-3) return "-3";
    if (valor === 1e-6) return "-6";
    if (valor === 1e-9) return "-9";
    return "";
  }

  function formatearNumero(num) {
    if (Math.abs(num) < 0.0001 && Math.abs(num) >= 1e-9) {
      return num.toFixed(10);
    } else if (Math.abs(num) < 1e-9 && num !== 0) {
      return num.toExponential(2);
    } else {
      return num.toFixed(4);
    }
  }

  const textoResultado = `
    <h3>Fórmulas usadas:</h3>
    <p><em>Magnitud de la fuerza entre dos cargas:</em> <strong>F = k × |q₁ × q₂| / r²</strong></p>
    <p><em>Fuerza resultante:</em> <strong>FR = √(FRx² + FRy²)</strong></p>
    <p><em>Ángulo:</em> <strong>θ = atan(FRy / FRx)</strong></p>

    <h3>Datos:</h3>
    <ul>
      <li>k = 9 × 10<sup>9</sup> N·m²/C²</li>
      <li>Carga 1 (q₁): ${q1} × 10<sup>${formatoExponente(u1)}</sup> C</li>
      <li>Carga 2 (q₂): ${q2} × 10<sup>${formatoExponente(u2)}</sup> C</li>
      <li>Carga 3 (q₃): ${q3} × 10<sup>${formatoExponente(u3)}</sup> C</li>
      <li>Distancia entre cargas (r): ${distancia} m</li>
    </ul>
    <hr>

    <h3>Resultados:</h3>
    <p>F13 = ${formatearNumero(f13)} N → (${tipo13})</p>
    <p>F23 = ${formatearNumero(f23)} N → (${tipo23})</p>
    <hr>
    <p>FRx = ${formatearNumero(FRx)} N</p>
    <p>FRy = ${formatearNumero(FRy)} N</p>
    <p><strong>FR = ${formatearNumero(FR)} N</strong></p>
    <p><strong>θ = ${formatearNumero(theta)}°</strong></p>
  `;

  document.getElementById("resultado").innerHTML = textoResultado;

  // --- DIBUJAR TRIÁNGULO ---
  const canvas = document.getElementById("grafico");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centroX = canvas.width / 2;
  const centroY = canvas.height / 2;
  const escala = 100;

  const pos1 = { x: centroX - distancia * escala / 2, y: centroY + distancia * escala * Math.sin(Math.PI / 6) };
  const pos2 = { x: centroX + distancia * escala / 2, y: centroY + distancia * escala * Math.sin(Math.PI / 6) };
  const pos3 = { x: centroX, y: centroY - distancia * escala * Math.cos(Math.PI / 6) };

  function dibujarCarga(pos, color, label) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(label, pos.x - 3, pos.y + 4);
  }

  function dibujarFlecha(from, fx, fy, color) {
    const longitud = 50;
    const offsetX = fx * longitud;
    const offsetY = fy * longitud;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(from.x + offsetX, from.y - offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(from.x + offsetX, from.y - offsetY);
    ctx.lineTo(from.x + offsetX - 6, from.y - offsetY - 6);
    ctx.lineTo(from.x + offsetX + 6, from.y - offsetY - 6);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  dibujarCarga(pos1, "red", "1");
  dibujarCarga(pos2, "blue", "2");
  dibujarCarga(pos3, "green", "3");

  dibujarFlecha(pos3, f13x, f13y, "purple");
  dibujarFlecha(pos3, f23x, f23y, "orange");
}





