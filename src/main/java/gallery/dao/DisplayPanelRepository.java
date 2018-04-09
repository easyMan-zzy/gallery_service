package gallery.dao;

import gallery.domain.DisplayPanel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisplayPanelRepository extends JpaRepository<DisplayPanel, Long> {
    List<DisplayPanel> findByGalleryAndImageNotNullOrderByChangedateDesc(Long gallery);
    DisplayPanel findById(Long Id);
}
