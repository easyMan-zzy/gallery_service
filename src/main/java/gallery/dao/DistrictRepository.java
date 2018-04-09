package gallery.dao;

import gallery.domain.District;
import gallery.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District, Long> {
    List<District> findByIsdeleted(Long isDeleted);
}