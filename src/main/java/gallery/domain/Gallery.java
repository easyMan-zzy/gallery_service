package gallery.domain;

import lombok.Data;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Data
@ToString
public class Gallery {
  @Id
  @GeneratedValue
  private Long id;

  private Long community;
  private String name;
  private String personincharge;
  private String telofpersonincharge;
  private String maintenancestatus;
  private String changeperiod;
  private Long isdeleted;
  private java.sql.Timestamp createdtime;
  private String createdby;
  private java.sql.Timestamp modifiedtime;
  private String modifiedby;
}
