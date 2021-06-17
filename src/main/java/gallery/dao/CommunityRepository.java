package gallery.dao;

import gallery.domain.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityRepository extends JpaRepository<Community, Long> {
    List<Community> findByStreetAndIsdeleted(Long street, Long isdeleted);
    List<Community> findByNameContainingAndIsdeleted(String name, Long isdeleted);
}
