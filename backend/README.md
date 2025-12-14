# SzlugOFF - Backend API

Moduł serwerowy aplikacji SzlugOFF oparty na Spring Boot. Odpowiada za logikę biznesową, obsługę bazy danych Geo i API dla frontendu.

## 🛠 Wymagania (Development)

Jeśli chcesz pracować nad backendem bez użycia Dockera:
* Java 17 JDK
* Maven (lub użyj wbudowanego wrappera `mvnw`)
* Uruchomiona lokalnie baza PostgreSQL (np. z Dockera: `docker-compose up db`)

## Uruchomienie (Lokalnie)

1.  **Konfiguracja Bazy:**
    Upewnij się, że w pliku `src/main/resources/application.yml` ustawienia wskazują na Twoją lokalną bazę (domyślnie localhost:5433 - docker-compose.yml).

2.  **Start aplikacji:**
    ```bash
    ./mvnw spring-boot:run
    ```

3.  **Swagger UI:**
    Po uruchomieniu dokumentacja API dostępna jest pod:
    http://localhost:8080/swagger-ui/index.html