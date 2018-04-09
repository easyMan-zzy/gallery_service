package gallery.service;

import gallery.domain.Gallery;
import gallery.dto.GalleryDto;
import gallery.dto.GalleryWithPanelDto;
import gallery.dto.Result;
;import java.util.List;

public interface GalleryService {
    public GalleryDto findGallery(Long community);
    public Gallery findGalleryById(Long id);
    public Result save(Gallery gallery);
    public Result deletGallery(Long id);
    public List<GalleryWithPanelDto> findAllGalleryWithDisplayPanel(Long community);
}
