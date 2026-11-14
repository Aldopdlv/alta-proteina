#!/bin/bash
# Arma el .zip para Claude Design a partir del contenido del repo.
# Uso (desde la raíz del repo):  bash claude-design/armar-paquete.sh
# Salida: claude-design/ALTA-PROTEINA-paquete-claude-design.zip
# Requiere python3 (no hace falta el comando zip).
set -e
cd "$(dirname "$0")/.."
python3 - <<'PY'
import zipfile, pathlib, datetime
raiz = pathlib.Path('.')
salida = raiz / 'claude-design' / 'ALTA-PROTEINA-paquete-claude-design.zip'
top = 'alta-proteina-claude-design/'
with zipfile.ZipFile(salida, 'w', zipfile.ZIP_DEFLATED) as z:
    cd = raiz / 'claude-design'
    for p in sorted(cd.glob('*.md')):
        z.write(p, top + p.name)
    for sub in ('datos', 'marca'):
        for p in sorted((cd / sub).rglob('*')):
            if p.is_file():
                z.write(p, top + str(p.relative_to(cd)).replace('\\', '/'))
    for p in sorted((raiz / 'docs').glob('*.md')):
        z.write(p, top + 'contexto/' + p.name)
    z.writestr(top + 'VERSION.txt', 'Paquete generado el %s desde el repo Aldopdlv/alta-proteina\n' % datetime.date.today().isoformat())
print('OK', salida, salida.stat().st_size, 'bytes')
with zipfile.ZipFile(salida) as z:
    for i in z.infolist():
        print(f'{i.file_size:>8}  {i.filename}')
PY
