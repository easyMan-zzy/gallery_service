package gallery.domain;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Value;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
@ToString
public class User {

  @Id
  private String username;
  private String password;
  private Long userrole;
  private Long isactive;
  private java.sql.Timestamp lastlogin;
  private String name;
  private String address;
  private String tel;
  private java.sql.Timestamp createdtime;
  private String createdby;
  private java.sql.Timestamp modifiedtime;
  private String modifiedby;

}
