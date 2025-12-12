package pl.szlugoff.szlugoff.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    static {
        SpringDocUtils.getConfig().addResponseTypeToIgnore(
                org.locationtech.jts.geom.Point.class
        );
    }

    @Bean
    public OpenAPI szlugoffOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SzlugOFF API")
                        .version("1.0")
                        .description("API do zgłaszania palenia"));
    }
}