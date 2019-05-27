package gallery.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * @author lemon
 */
@Configuration
public class CustomCorsConfiguration2 extends WebMvcConfigurerAdapter {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 设置了可以被跨域访问的路径和可以被哪些主机跨域访问
        /*for (String s : whiteList.split(",")) {
            registry.addMapping("/**").allowedOrigins(s);
        }*/
        registry.addMapping("/**").allowedOrigins("http://192.168.1.107:8020","http://localhost:8020","http://localhost:63342");
    }
}