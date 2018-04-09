package gallery.service;

import gallery.domain.DisplayPanel;;import java.util.List;

public interface DisplayPanelService {
    public void save(DisplayPanel displayPanel);
    public List<DisplayPanel> findDisplayPanels(Long gallery);
    public DisplayPanel findById(Long id);
}
