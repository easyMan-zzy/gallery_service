package gallery.service;

import gallery.domain.Community;
import gallery.domain.District;
import gallery.domain.Street;

import java.util.List;

public interface AreaService {
    public List<District> findDistrict();
    public List<Street> findStreet(Long district);
    public List<Community> findCommunity(Long street);
}
