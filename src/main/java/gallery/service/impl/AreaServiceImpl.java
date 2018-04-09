package gallery.service.impl;

import gallery.dao.*;
import gallery.domain.Community;
import gallery.domain.District;
import gallery.domain.Street;
import gallery.service.AreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AreaServiceImpl implements AreaService {

	@Autowired
	private DistrictRepository districtRepository;
	@Autowired
	private StreetRepository streetRepository;
	@Autowired
	private CommunityRepository communityRepository;

	public List<District> findDistrict(){
		return districtRepository.findByIsdeleted(new Long(0));
	}

	public List<Street> findStreet(Long district){
		return streetRepository.findByDistrictAndIsdeleted(district,new Long(0));
	}

	public List<Community> findCommunity(Long street){
		return communityRepository.findByStreetAndIsdeleted(street,new Long(0));
	}
}
