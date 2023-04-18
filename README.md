# Proyecto de Desarrollo Web: RolGM

## Descripción
Este es un proyecto desarrollado por [Iván De La Poza](https://github.com/IvanDLPG) para el proyecto de final de curso. 
El proyecto consiste en un entorno que facilite los Juegos de Rol mediante el uso de herramientas creadas especificamente 
para cubrir las necesidades de los jugadores.

## Tutores del proyecto
- [Fernández Hernández, Gonzalo](https://github.com/GonxFH) [Tutor General]
- [Gallardo Crespillo, Patricia A.](https://github.com/Irtnia) [Tutora Individual]

## Requisitos
- Es necesario tener instalado [Docker](https://www.docker.com/)
- Es necesario tener Make instalado. Si no lo tienes, los comandos de Make puedes copiarlos y ejecutarlos manualmente
- Es necesario contar con almenos 3.5 GB de espacio de almacenamiento

## Instalación
1. Descarga el proyecto en [zip](https://github.com/IvanDLPG/rolgm-project/archive/refs/heads/main.zip) o clónalo con Git.
2. Copia y modifica el fichero ".env.example" con el nombre ".env" (Está preparado para funcionar pero se recomienda personalizarlo).
3. Usa el comando "make init" del Makefile del proyecto. Esto creará las imagenes y levantará los servidores.
4. Usa el comando "make migrate" del Makefile del proyecto. Esto creará las tablas en la Base de Datos.
5. Usa el comando "superuser" del Makefile del proyecto. Esto creará al Super Usuario.
6. Usa el comando "make static" del Makefile del proyecto. Esto añadirá los ficheros estaticos de django al proyecto.

## Uso
1. Ejecuta el comando "make up" o "make start" para levantar los contenedores mostrando o no el prompt.
2. Accede a la aplicación por defecto desde http://172.18.0.2:8000 (Servidor) http://172.18.0.3:5173 (Cliente).

## Licencia
Este proyecto está bajo la Licencia [?]. Consulta el archivo [?] para más información.