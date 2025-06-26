function calcularCargas() {
  const q1 = parseFloat(document.getElementById('q1').value);
  const q2 = parseFloat(document.getElementById('q2').value);
  const q3 = parseFloat(document.getElementById('q3').value);
  const u1 = parseFloat(document.getElementById('unidad-q1').value);
  const u2 = parseFloat(document.getElementById('unidad-q2').value);
  const u3 = parseFloat(document.getElementById('unidad-q3').value);
  const distancia = parseFloat(document.getElementById("r").value);
  const k = 8.9875e9;

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

  const angulo13 = 60 * Math.PI / 180;
  const angulo23 = 120 * Math.PI / 180;

  const f13x = signo13 * f13 * Math.cos(angulo13);
  const f13y = signo13 * f13 * Math.sin(angulo13);

  const f23x = signo23 * f23 * Math.cos(angulo23);
  const f23y = signo23 * f23 * Math.sin(angulo23);

  const FRx = f13x + f23x;
  const FRy = f13y + f23y;
  const FR = Math.sqrt(FRx ** 2 + FRy ** 2);

  let theta = Math.atan2(FRy, FRx) * 180 / Math.PI;
  if (theta < 0) theta += 360;

  const formatearNumero = num => (Math.abs(num) < 0.0001 ? num.toExponential(2) : num.toFixed(4));

  document.getElementById("resultado").innerHTML = `
    <h3>Resultados:</h3>
    <p>F13 = ${formatearNumero(f13)} N → (${tipo13})</p>
    <p>F23 = ${formatearNumero(f23)} N → (${tipo23})</p>
    <hr>
    <p>F13x = ${formatearNumero(f13x)} N</p>
    <p>F13y = ${formatearNumero(f13y)} N</p>
    <p>F23x = ${formatearNumero(f23x)} N</p>
    <p>F23y = ${formatearNumero(f23y)} N</p>
    <hr>
    <p>FRx = ${formatearNumero(FRx)} N</p>
    <p>FRy = ${formatearNumero(FRy)} N</p>
    <p><strong>FR = ${formatearNumero(FR)} N</strong></p>
    <p><strong>θ = ${formatearNumero(theta)}°</strong></p>
    <hr>
    <p><strong>Fórmulas utilizadas:</strong></p>
    <ul>
      <li>F = k ⋅ |q₁ ⋅ q₃| / r²</li>
      <li>Fx = F ⋅ cos(θ), Fy = F ⋅ sin(θ)</li>
      <li>FRx = F13x + F23x, FRy = F13y + F23y</li>
      <li>FR = √(FRx² + FRy²)</li>
      <li>θ = atan2(FRy, FRx)</li>
    </ul>
  `;

  const canvas = document.getElementById("grafico");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.6;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const escala = Math.min(canvas.width, canvas.height) / (distancia * 5);

  const posQ3 = { x: cx, y: cy };
  const posQ2 = { x: cx - distancia * escala / 2, y: cy + distancia * escala * Math.sin(Math.PI / 6) };
  const posQ1 = { x: cx + distancia * escala / 2, y: cy + distancia * escala * Math.sin(Math.PI / 6) };

  function drawCharge(pos, label, charge) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = charge > 0 ? '#ffaaaa' : '#aaaaff';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "bold 14px Arial";
    ctx.fillText(label, pos.x, pos.y - 20);
    ctx.fillText(charge > 0 ? '+' : '-', pos.x, pos.y + 5);
  }

  function drawArrow(from, fx, fy, color) {
    const longitud = canvas.width / 100000;
    const dx = fx * longitud;
    const dy = fy * longitud;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(from.x + dx, from.y - dy);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(from.x + dx, from.y - dy);
    ctx.lineTo(from.x + dx - 6, from.y - dy - 6);
    ctx.lineTo(from.x + dx + 6, from.y - dy - 6);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawAngleArc(center, startAngle, endAngle, label) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, 25, startAngle * Math.PI / 180, endAngle * Math.PI / 180);
    ctx.strokeStyle = "black";
    ctx.stroke();
    const midAngle = (startAngle + endAngle) / 2 * Math.PI / 180;
    const x = center.x + 35 * Math.cos(midAngle);
    const y = center.y + 35 * Math.sin(midAngle);
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(label, x, y);
  }

  ctx.beginPath();
  ctx.moveTo(posQ1.x, posQ1.y);
  ctx.lineTo(posQ2.x, posQ2.y);
  ctx.lineTo(posQ3.x, posQ3.y);
  ctx.closePath();
  ctx.fillStyle = "rgba(128, 0, 255, 0.2)";
  ctx.fill();
  ctx.stroke();

  drawCharge(posQ1, "q1", q1);
  drawCharge(posQ2, "q2", q2);
  drawCharge(posQ3, "q3", q3);

  drawArrow(posQ3, f13x, f13y, "orange");
  drawArrow(posQ3, f23x, f23y, "red");
  drawArrow(posQ3, FRx, FRy, "black");
  drawArrow(posQ3, FRx, FRy, "green");

  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, canvas.height);
  ctx.moveTo(0, cy);
  ctx.lineTo(canvas.width, cy);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "green";
  ctx.font = "bold 16px Arial";
  ctx.fillText("X", canvas.width - 10, cy - 10);
  ctx.fillText("Y", cx + 10, 20);

  drawAngleArc(posQ2, 0, 120, `β=120°`);
  drawAngleArc(posQ2, 90, 150, `α=60°`);

  ctx.fillStyle = "brown";
  ctx.fillText(`${distancia} m`, (posQ2.x + posQ3.x) / 2, posQ2.y + 15);
}