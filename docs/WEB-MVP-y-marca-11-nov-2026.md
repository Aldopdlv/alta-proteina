# Alta Proteína — Bosquejo de web MVP y marca (11 nov 2026)

## Marca
- Nombre de trabajo: **Alta Proteína**
- Concepto: **"Comida de verdad, sin complicarte"** — proteína real, lista en minutos, para gente ocupada que entrena. Salud + practicidad, sin tono de gimnasio extremo.
- Paleta propuesta:
  - Verde oliva (principal): #5B6B2F
  - Crema (fondo): #F5EFE0
  - Naranja (acento / botones): #E8772E
  - Texto oscuro: #2B2B2B

## Decisiones
- El MVP es una web de pedidos (no WhatsApp).
- Modelo de corte semanal: pedidos hasta el domingo, producción en lote, entrega en día fijo.

## Flujo del cliente
1. Ve el menú de la semana: burrito, quesadilla, arroz con pollo, fideos con pollo (gramos de proteína y precio).
2. Arma el pedido: unidades o pack de 7, marinado, salsas aparte.
3. Elige día de entrega y zona.
4. Paga:
   - **Tarjeta (link de pago)** con recargo: 10% si la compra es menor a S/ 100; 5% desde S/ 100.
   - **Yape**: misma lógica que el aula del Dr. Goyzueta — paga, sube captura y espera confirmación manual.

## Panel interno
- Pedidos de la semana con cierre automático el domingo.
- Confirmación manual de pagos Yape (ver captura → aprobar/rechazar).
- Resumen de producción: porciones por producto y kg de pollo crudo a comprar (rendimiento 60%).
- Entregas por zona y estado: pagado, preparado, entregado.

## MVP
- Sin cuentas de usuario.
- Delivery a zonas cercanas con costo fijo.
- Futuro: suscripción semanal, repetir pedido.
