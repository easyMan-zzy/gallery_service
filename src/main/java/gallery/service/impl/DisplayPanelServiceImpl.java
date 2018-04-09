package gallery.service.impl;

import gallery.dao.DisplayPanelRepository;
import gallery.domain.DisplayPanel;
import gallery.dto.GalleryDto;
import gallery.service.DisplayPanelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DisplayPanelServiceImpl implements DisplayPanelService {

	@Autowired
	private DisplayPanelRepository displayPanelRepository;

	//展板保存
	public void save(DisplayPanel displayPanel) {
		displayPanelRepository.save(displayPanel);
	}

	public List<DisplayPanel> findDisplayPanels(Long gallery){
		return displayPanelRepository.findByGalleryAndImageNotNullOrderByChangedateDesc(gallery);
	}

	public DisplayPanel findById(Long id){
		return displayPanelRepository.findById(id);
	}
}


