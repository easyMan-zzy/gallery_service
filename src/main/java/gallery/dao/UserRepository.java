package gallery.dao;

import gallery.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User,String>{

    List<User> findByUsernameAndPassword(String name,String password);

    List<User> findByUsername(String username);
}
