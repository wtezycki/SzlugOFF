# SzlugOFF - Frontend

Aplikacja kliencka (SPA) stworzona w Angular 17+, wykorzystująca Leaflet do map i SCSS do stylów.

## 🛠 Wymagania (Development)

Jeśli chcesz pracować nad frontendem z wykorzystaniem Hot Reload (bez Dockera):
* Node.js (wersja 18 lub 20 LTS)
* npm

## Uruchomienie (Dev Server)

To najszybszy sposób pracy nad frontendem aplikacji.

1.  **Instalacja zależności:**
    ```bash
    npm install
    ```

2.  **Start serwera deweloperskiego:**
    ```bash
    npm start
    # lub
    ng serve
    ```

3.  **Dostęp:**
    Aplikacja będzie dostępna pod adresem: http://localhost:4200/

> **Uwaga:** Aby frontend działał poprawnie, musisz mieć uruchomiony backend (lokalnie na porcie 8080 lub w Dockerze). Musisz też skonfigurować proxy lub zmienić adres API w `src/app/report.ts` na pełny adres lokalny (np. `http://localhost:8080/api...`).
