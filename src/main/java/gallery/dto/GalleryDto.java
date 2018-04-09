package gallery.dto;

import gallery.domain.Gallery;
import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GalleryDto {
	private List<Gallery> data;
}
