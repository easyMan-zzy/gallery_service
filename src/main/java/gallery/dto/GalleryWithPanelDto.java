package gallery.dto;

import gallery.domain.DisplayPanel;
import gallery.domain.Gallery;
import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GalleryWithPanelDto {
	private Gallery gallery;
	private List<DisplayPanel> displayPanels;
}
