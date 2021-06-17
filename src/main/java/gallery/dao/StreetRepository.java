package gallery.dao;

import gallery.domain.Street;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StreetRepository extends JpaRepository<Street, Long> {
    List<Street> findByDistrictAndIsdeleted(Long district, Long isdeleted);
    List<Street> findByNameContainingAndIsdeleted(String name, Long isdeleted);
}
