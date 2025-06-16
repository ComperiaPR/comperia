# Comperia

Comperia es una plataforma de consulta y seguimiento de inmuebles que permite a las empresas consultar diferente información de inmuebles en Puerto Rico.

## Características

- Registro de propiedades/inmuebles
- Consulta de propiedades/inmuebles
- Historial de propiedades/inmuebles
- Registro de usuarios
- Pagos con suscripciones
- Otras características

## Tecnologías Utilizadas

- **Frontend:** React (v19), TypeScript (v5), Inertia.js (v2), Tailwind CSS (v4)
- **Backend:** PHP (v8.2), Laravel (v12)
- **Base de datos:** MySQL (v8)

## Instalación local con docker

Para obtener una copia local en funcionamiento, siga estos pasos:

### Requisitos Previos
- Tener instalado docker y docker-compose

### Configuración

1. **Clonar el repositorio:**
    ```bash
    git clone git@github.com:ComperiaPR/comperia.git
    ```

2. **Configurar credenciales git:**
    ```bash
    cd comperia
    git config user.email email-github@example.com
    git config user.name "Nombre/Alias"
    git config core.fileMode false
    ```

3. **Copiar el archivo `.env.example` a `.env` y configurar sus variables de entorno:**
    ```bash
    cp .env.example .env
    ```

4. **Crear contenedores:**
    ```bash
    sudo docker-compose up
    ```

5. **Ingresar al contenedor y correr los siguientes comandos:**
    ```bash
    composer install
    npm install
    php artisan migrate --seed
	php artisan storage:link
	npm run dev
    ```

7. **Usar app:**

    Luego, abra su navegador y navegue a `http://localhost:8083`.

## Estilo de Código

Seguimos el estándar de codificación PSR-12 para PHP y la guía de estilo de Airbnb para JavaScript/TypeScript. Asegúrese de ejecutar test y el linter antes de confirmar cualquier código:

1. **Commits:**

La estructura del commit debe ser:

Tiulo de lo realizado

Descripción de lo realizado con el por qué se hizo en formato de lista con viñetas

2. **Test:**

```bash
php artisan test
```

3. **Análisis y formateo de código:**

Este comando analiza el código y lo formatea, con el --test evita que lo haga de forma autómatica directamente en el código

```bash
./vendor/bin/pint --test
```

4. **Análisis y actualización de código automático:**

Este comando analiza el código y lo actualiza a las últimas versiones de php, con el --dry-run evita que lo haga de forma autómatica directamente en el código

```bash
./vendor/bin/rector --dry-run
```

5. **Análisis de código estático:**

Hay dos opciones puede usar una o las dos

```bash
./vendor/bin/phpstan analyse

php artisan insights
```
