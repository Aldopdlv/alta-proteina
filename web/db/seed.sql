-- Valores confirmados por Aldo y Ale el 14-nov-2026 (configuracion-confirmada.json).
-- Todo se edita después en Panel → Configuración.
insert into config (id) values (1);

insert into productos (id, nombre, descripcion, categoria, precio, recalentado, orden) values
  ('burrito-pollo',    'Burrito de pollo',    'Pollo marinado, arroz, frejoles y vegetales envueltos en tortilla de trigo.', 'burritos-quesadillas', 1200, 'Microondas tapado, 3 a 4 minutos.', 1),
  ('quesadilla-pollo', 'Quesadilla de pollo', 'Pollo marinado y queso fundido en tortilla dorada.',                          'burritos-quesadillas', 1200, 'Microondas tapado, 3 a 4 minutos.', 2),
  ('arroz-pollo',      'Arroz con pollo',     'Pollo marinado sobre arroz con verduras; salsa aparte.',                      'arroz-fideos',         1100, 'Microondas tapado, 3 a 4 minutos.', 3),
  ('fideos-pollo',     'Fideos con pollo',    'Pasta corta al dente con pollo marinado; salsa aparte.',                      'arroz-fideos',         1100, 'Microondas tapado, 3 a 4 minutos, con un chorrito de agua.', 4);
insert into productos (id, nombre, descripcion, categoria, precio, pack_producto_id, pack_unidades, orden) values
  ('pack-7', 'Pack semanal x7', '7 burritos de pollo para toda la semana.', 'packs', 8000, 'burrito-pollo', 7, 5);

insert into marinados (id, nombre, descripcion, orden) values
  ('aji-panca',         'Ají panca',               'Ahumado y suave, con ajo y comino. El clásico.', 1),
  ('achiote',           'Achiote',                 'Color intenso, sabor suave y terroso.',          2),
  ('limon-ajo-oregano', 'Limón con ajo y orégano', 'Fresco y ligero.',                               3),
  ('teriyaki',          'Teriyaki',                'Dulce y salado, al estilo oriental.',            4);

-- Nombres provisionales de salsas (pendiente de Aldo y Ale).
insert into salsas (id, nombre, orden) values
  ('aji-amarillo',   'Ají amarillo cremoso', 1),
  ('chimichurri',    'Chimichurri',          2),
  ('criolla',        'Salsa criolla',        3),
  ('teriyaki-extra', 'Teriyaki extra',       4),
  ('huancaina',      'Huancaína',            5);

insert into zonas (id, nombre, costo, orden) values
  ('san-miguel', 'San Miguel',        0, 1),
  ('magdalena',  'Magdalena del Mar', 0, 2),
  ('san-isidro', 'San Isidro',        0, 3),
  ('miraflores', 'Miraflores',        0, 4),
  ('san-borja',  'San Borja',         0, 5);
