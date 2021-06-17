package gallery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
public class Application {

   /**
    * 跨域过滤器
    * @return
    */
   @Bean


   public CorsFilter corsFilter() {

      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      CorsConfiguration corsConfiguration = new CorsConfiguration();
      corsConfiguration.addAllowedOrigin("*");
      corsConfiguration.addAllowedHeader("*");
      corsConfiguration.addAllowedMethod("*");
      source.registerCorsConfiguration("/**", corsConfiguration);
      return new CorsFilter(source);
   }
   public static void main(String[] args) {
      SpringApplication.run(Application.class, args);
   }
}
