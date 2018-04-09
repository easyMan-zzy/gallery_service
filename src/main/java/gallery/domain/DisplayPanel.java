package gallery.domain;

import lombok.Data;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Data
@ToString
public class DisplayPanel {
  @Id
  @GeneratedValue
  private Long id;

  private Long gallery;
  private String image;
  private String paneldescription;
  private java.sql.Date changedate;
  private String changedescription;
  private java.sql.Timestamp uploadedtime;
  private String uploadedby;
  private java.sql.Timestamp modifiedtime;
  private String modifiedby;
}
