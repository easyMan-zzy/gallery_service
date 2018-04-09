package gallery.dao.impl;

import gallery.dao.CommonDao;
import org.springframework.stereotype.Component;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Component
public class CommonDaoImpl implements CommonDao {
	@PersistenceContext
	private EntityManager em;
	
//	public Level3 test() {
//		List<DTO> abcs = em.createQuery("select new gallery.dto.DTO(d.name,s.name) " +
//                "from District d, Street s  where d.id=s.district").getResultList();
//		return abcs;
//	}
}
