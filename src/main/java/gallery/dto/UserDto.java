package gallery.dto;

import gallery.domain.User;
import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDto {
	private Integer draw;
	private Integer recordsTotal;
	private Integer recordsFiltered;
	private List<User> data;
}
