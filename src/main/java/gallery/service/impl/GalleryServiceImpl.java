package gallery.service.impl;

import gallery.dao.DisplayPanelRepository;
import gallery.dao.GalleryRepository;
import gallery.domain.Gallery;
import gallery.dto.GalleryDto;
import gallery.dto.GalleryWithPanelDto;
import gallery.dto.Result;
import gallery.service.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Component
public class GalleryServiceImpl implements GalleryService {

	@Autowired
	private GalleryRepository galleryRepository;

	@Autowired
	private DisplayPanelRepository displayPanelRepository;


	public GalleryDto findGallery(Long community){
		GalleryDto galleryDto = new GalleryDto();
		galleryDto.setData(galleryRepository.findByCommunityAndIsdeleted(community,new Long(0)));
		return galleryDto;
	}

	public Gallery findGalleryById(Long id){
		Gallery gallery = galleryRepository.findById(id);
		return gallery;
	}

	public Result save(Gallery gallery) {
		Result result = new Result();
		try {
			if (gallery.getId()==null) {
				gallery.setCreatedtime(new Timestamp(System.currentTimeMillis()));
				gallery.setIsdeleted(new Long(0));
				galleryRepository.save(gallery);
				result.setResultDescription("画廊新建成功！");
			} else {
				Gallery dbGallery = galleryRepository.findById(gallery.getId());
				//更新值
				dbGallery.setName(gallery.getName());
				dbGallery.setMaintenancestatus(gallery.getMaintenancestatus());
				dbGallery.setChangeperiod(gallery.getChangeperiod());
				dbGallery.setPersonincharge(gallery.getPersonincharge());
				dbGallery.setTelofpersonincharge(gallery.getTelofpersonincharge());

				galleryRepository.save(dbGallery);
				result.setResultDescription("画廊修改成功！");
			}
		}catch (Exception ex){
			result.setResultDescription("画廊保存失败！");
		}
		return result;
	}

	public Result deletGallery(Long id){
		Result result = new Result();
		Gallery gallery = galleryRepository.findById(id);
		gallery.setIsdeleted(new Long(1));
		try{
			galleryRepository.save(gallery);
			result.setResult(true);
			result.setResultDescription("删除成功！");
			return result;
		}catch (Exception ex) {
			result.setResult(false);
			result.setResultDescription("删除失败！");
			return result;
		}
	}

	public List<GalleryWithPanelDto> findAllGalleryWithDisplayPanel(Long community){
		List<GalleryWithPanelDto> galleryWithPanelDtos = new ArrayList();
		List<Gallery> galleryList = galleryRepository.findByCommunityAndIsdeleted(community,new Long(0));
		for (Gallery gallery : galleryList) {
			GalleryWithPanelDto galleryWithPanelDto = new GalleryWithPanelDto();
			galleryWithPanelDto.setGallery(gallery);
			galleryWithPanelDto.setDisplayPanels(displayPanelRepository.findByGalleryAndImageNotNullOrderByChangedateDesc(gallery.getId()));
			galleryWithPanelDtos.add(galleryWithPanelDto);
		}
		return galleryWithPanelDtos;
	}
}


