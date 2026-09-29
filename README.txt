TFG - Plataforma de previsualització de videomapping

Descripció

Aquest projecte consisteix en el desenvolupament d’una plataforma de previsualització de videomapping en un entorn 3D.

L’aplicació permet carregar contingut multimèdia (vídeo), projectar-lo sobre una superfície virtual i ajustar el mapping mitjançant punts de control.

Actualment, el prototip implementa les següents funcionalitats:

-Visualització d’una escena 3D interactiva.
-Projecció de vídeo sobre una superfície virtual.
-Ajust manual del mapping mitjançant 4 punts de control.
-Càrrega de vídeos des de l’equip local.
-Guardat i càrrega de configuracions de mapping en format JSON.
-Generació d’una versió optimitzada per a producció.

Requisits previs

Per executar el projecte és necessari disposar de:

Node.js (versió LTS recomanada)
npm (inclòs amb Node.js)

Instal·lació

Descarregar o clonar el projecte.
Obrir una terminal a la carpeta del projecte.
Instal·lar les dependències executant:

npm install

Execució en mode desenvolupament

Per executar l’aplicació en mode desenvolupament:

npm run dev

A continuació, obrir el navegador i accedir a l’adreça indicada (normalment):

http://localhost:5173/

Generació de la versió de producció

Per generar una versió optimitzada del projecte:

npm run build

Això generarà una carpeta:

dist/

Execució de la versió final

Per executar la versió de producció, es recomana utilitzar un servidor local.

Opció senzilla:

npm install -g serve
serve dist

Després, obrir el navegador a:

http://localhost:3000/

Funcionament bàsic

1, 2, 3, 4 → Seleccionar cantonada del mapping
Fletxes → Moure la cantonada seleccionada
Q / E → Moure en profunditat

Funcionalitats disponibles:

-Càrrega de vídeo des de l’ordinador
-Ajust del mapping en temps real
-Botó de reset de la superfície
-Guardar configuració en JSON
-Carregar configuració des d’un fitxer

Estructura del projecte

src/ → codi font
public/ → fitxers estàtics (vídeos)
dist/ → versió compilada (producció)

Estat del projecte

Aquest projecte es troba en fase inicial de desenvolupament (primer avançament del TFG), amb un prototip funcional que valida la viabilitat del sistema.

Autor: Joel Fernandez Fernandez