package gallery.dao;

import gallery.domain.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {
    List<Gallery> findByCommunityAndIsdeleted(Long community, Long isdeleted);
    Gallery findById(Long Id);
}
