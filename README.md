# SzlugOFF

> **System zgłaszania wykroczeń i przestępstw w przestrzeni publicznej.**

[![Angular](https://img.shields.io/badge/Angular-17%2B-DD0031?style=flat&logo=angular)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=flat&logo=spring)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)](https://www.docker.com/)

**SzlugOFF** to aplikacja webowa typu Full-Stack, umożliwiająca mieszkańcom anonimowe zgłaszanie miejsc, w których łamane są przepisy. System wyposażony jest w interaktywną mapę oraz dedykowany panel administracyjny dla służb porządkowych.
---

## Spis treści
- [Funkcjonalności](#-funkcjonalności)
- [Technologia](#-technologia)
- [Wymagania](#-wymagania)
- [Instalacja i Uruchomienie](#-instalacja-i-uruchomienie)
- [Konfiguracja](#-konfiguracja)
- [Struktura Projektu](#-struktura-projektu)
- [API i Dokumentacja](#-api-i-dokumentacja)
- [Licencja](#-licencja)
---

## Funkcjonalności

### Dla Użytkownika (Mieszkańca)
* **Interaktywna mapa:** Przeglądanie zgłoszeń w okolicy (wykorzystanie biblioteki Leaflet).
* **Geolokalizacja:** Automatyczne namierzanie pozycji użytkownika.
* **Zgłaszanie naruszeń:** Intuicyjny formularz wyboru zdarzenia (np. "Palenie na przystanku").
* **Powiadomienia:** Estetyczne komunikaty o statusie operacji.

### Dla Administratora (Służb)
* **Panel Zarządzania:** Dostęp do listy zgłoszeń w formie dashboardu.
* **Workflow Zgłoszeń:** Możliwość zmiany statusu (`NOWE` → `W TOKU` → `ZATWIERDZONE` / `ODRZUCONE`).
* **Filtrowanie:** Przeglądanie zgłoszeń według ich statusu.
* **Wizualizacja:** Podgląd konkretnego zgłoszenia na mapie.

---

## Technologia

Projekt oparty jest o architekturę mikroserwisową, w pełni skonteneryzowaną.

| Warstwa | Technologie |
|---------|-------------|
| **Frontend** | Angular 17+, TypeScript, SCSS, Nginx |
| **Backend** | Java 17, Spring Boot 3, Hibernate, Maven |
| **Baza Danych** | PostgreSQL 16 + PostGIS (dane geoprzestrzenne) |
| **DevOps** | Docker, Docker Compose |

---

## Wymagania

Aby uruchomić projekt, nie potrzebujesz instalować Javy ani Node.js lokalnie. Wymagane są jedynie:

* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* Git

---

## Instalacja i Uruchomienie

1.  **Sklonuj repozytorium:**
    ```bash
    git clone [https://github.com/wiciu1/szlugoff.git](https://github.com/wiciu1/szlugoff.git)
    cd szlugoff
    ```

2.  **Skonfiguruj zmienne środowiskowe:**
    Utwórz plik `.env` w głównym katalogu projektu na podstawie przykładowego pliku (jeśli istnieje) lub użyj poniższej treści:
    ```ini
    POSTGRES_USER=admin
    POSTGRES_PASSWORD=twoje_haslo
    POSTGRES_DB=szlugoff
    ```

3.  **Uruchom aplikację:**
    W głównym katalogu projektu (tam gdzie `docker-compose.yml`) wykonaj:
    ```bash
    docker-compose up --build
    ```
    *Uwaga: Pierwsze uruchomienie może potrwać kilka minut, ponieważ Docker musi pobrać obrazy i zbudować aplikacje.*

4.  **Dostęp do aplikacji:**
    * **Strona Główna:** [http://localhost](http://localhost)
    * **Panel Administratora:** [http://localhost/admin](http://localhost/admin)

---

## Konfiguracja

Główne pliki konfiguracyjne:
* **`docker-compose.yml`**: Definicja serwisów, portów i sieci.
* **`.env`**: Zmienne środowiskowe dla bazy danych.
* **`frontend/nginx.conf`**: Konfiguracja serwera Nginx oraz Reverse Proxy dla API.

> **Wskazówka:** Jeśli po pierwszym uruchomieniu zmienisz nazwę bazy danych w pliku `.env`, konieczne będzie usunięcie folderu `postgres_data`, aby baza mogła zainicjować się na nowo.

---

## Struktura Projektu

```text
szlugoff/
├── backend/            # Aplikacja Spring Boot
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/           # Aplikacja Angular
│   ├── src/
│   ├── public/         # Zasoby statyczne
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml  # Orkiestracja kontenerów
└── .env                # Zmienne środowiskowe (ignorowane przez git)
```

## Licencja

© 2025 SzlugOFF. Wszelkie prawa zastrzeżone.

Ten projekt jest oprogramowaniem własnościowym. Kopiowanie, rozpowszechnianie, modyfikowanie 
lub wykorzystywanie kodu źródłowego (w całości lub w części) bez wyraźnej, pisemnej zgody autora jest zabronione.