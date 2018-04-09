package gallery.dto;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Result {
	private Boolean result;
	private Integer resultCode;
	private String resultDescription;
	private String token;
}
