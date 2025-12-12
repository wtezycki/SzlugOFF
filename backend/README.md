# SzlugOFF

Aplikacja typu "Yanosik dla wykroczeń" (MVP: zgłaszanie palenia).
Aplikacja umożliwia oznaczanie zdarzeń na mapie w czasie rzeczywistym.

## 🛠 Tech Stack

* **Język:** Java 17
* **Framework:** Spring Boot 4.0
* **Baza danych:** PostgreSQL 16
* **GIS (Mapy):** PostGIS + Hibernate Spatial
* **Konteneryzacja:** Docker & Docker Compose

## 🚀 Jak uruchomić projekt (Quick Start)

### 1. Wymagania wstępne
* Zainstalowany [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* Zainstalowane JDK 17+ (lub użycie wbudowanego w IDE)

### 2. Uruchomienie Bazy Danych
Projekt korzysta z gotowej konfiguracji Docker Compose. Aby postawić bazę PostgreSQL z włączonym rozszerzeniem PostGIS:

```bash
docker-compose up -d