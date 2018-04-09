package gallery.web;

import java.io.File;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import gallery.Util.JWT;
import gallery.Util.MD5Util;
import gallery.common.Role;
import gallery.common.UserStatus;
import gallery.domain.*;
import gallery.dto.GalleryDto;
import gallery.dto.GalleryWithPanelDto;
import gallery.dto.Result;
import gallery.dto.UserDto;
import gallery.service.AreaService;
import gallery.service.DisplayPanelService;
import gallery.service.GalleryService;
import gallery.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class Controller {
    @Value("${uploadDir}")
    private String uploadDir;
    @Value("${subSysName}")
    private String subSysName;
	@Autowired
	private UserService userService;
    @Autowired
    private AreaService areaService;
    @Autowired
    private GalleryService galleryService;
    @Autowired
    private DisplayPanelService displayPanelService;

    @RequestMapping(value = "/user/register", method = RequestMethod.POST)
    public Result register(User user) {
        user.setPassword(MD5Util.getMD5(user.getPassword()));
        user.setUserrole(Role.MANGER.getIndex());
        user.setIsactive(UserStatus.UNACTIVE.getIndex());
        user.setCreatedtime(new Timestamp(System.currentTimeMillis()));
        user.setCreatedby(user.getUsername());
        return userService.registerUser(user);
    }

    @RequestMapping(value = "/user/login", method = RequestMethod.POST)
    public Result login(User user) {
        return userService.verifyUserName(user);
    }

    @RequestMapping(value = "/user/validtoken",method = RequestMethod.POST)
    public User getUserInfo(@RequestParam String token) {
        User user = JWT.unsign(token, User.class);
        return user;
    }

    @RequestMapping(value = "/user/updatePwd",method = RequestMethod.POST)
    public Result updatePwd(@RequestParam String username,@RequestParam String oldpwd,@RequestParam String newpwd) {
        return userService.changePwd(username,oldpwd, newpwd);
    }

    @RequestMapping(value = "/user/findUserlist",method = RequestMethod.GET)
    public UserDto findUserlist(@RequestParam Integer length,@RequestParam Integer start) {
        return userService.findUserlist(length,start);
    }

    @RequestMapping(value = "/user/activeUser",method = RequestMethod.POST)
    public Result activeUser(@RequestParam String username,@RequestParam Long active) {
        return userService.userActive(username,active);
    }

    @RequestMapping(value = "/area/district",method = RequestMethod.GET)
    public List<District> findDistrict() {
        return areaService.findDistrict();
    }

    @RequestMapping(value = "/area/street",method = RequestMethod.GET)
    public List<Street> findStreet(@RequestParam Long district) {
        return areaService.findStreet(district);
    }

    @RequestMapping(value = "/area/community",method = RequestMethod.GET)
    public List<Community> findCommunity(@RequestParam Long street) {
        return areaService.findCommunity(street);
    }

    @RequestMapping(value = "/gallery/list",method = RequestMethod.GET)
    public GalleryDto findGallery(@RequestParam Long community) {
        return galleryService.findGallery(community);
    }

    @RequestMapping(value = "/gallery/findAGallery",method = RequestMethod.GET)
    public Gallery findAGallery(@RequestParam Long id) {
        return galleryService.findGalleryById(id);
    }

    @RequestMapping(value = "/gallery/save",method = RequestMethod.POST)
    public Result update(Gallery gallery) {
        return galleryService.save(gallery);
    }

    @RequestMapping(value = "/gallery/delete",method = RequestMethod.POST)
    public Result deleteGallery(@RequestParam Long id) {
        return galleryService.deletGallery(id);
    }



    @RequestMapping(value = "/panel/list",method = RequestMethod.GET)
    public List<DisplayPanel> findDisplayPanels(@RequestParam Long gallery) {
        return displayPanelService.findDisplayPanels(gallery);
    }


    @RequestMapping(value = "/panel/save", method = RequestMethod.POST)
    public Result savePanel(@RequestParam String changedescription,
                              @RequestParam String paneldescription,
                              @RequestParam MultipartFile image,
                              @RequestParam String modifiedby,
                              @RequestParam String changedate,
                              @RequestParam Long gallery,
                              @RequestParam String uploadedbytran){
        Result result = new Result();

        if (image.isEmpty()) {
            result.setResult(false);
            result.setResultDescription("上传图片为空，请重新上传");
            return result;
        }

        // 替换文件名
        String fileName = image.getOriginalFilename();//获取文件名
        String suffixName = fileName.substring(fileName.lastIndexOf("."));// 获取文件的后缀名
        String newFileName = (new SimpleDateFormat("yyyyMMddHHmmssSSS")).format(new Date(System.currentTimeMillis()))+suffixName;
        String filePath = uploadDir;
        String path = "/images/new-gallery-photos/"+subSysName+"/"+gallery+"/"+newFileName;
        File dest = new File(filePath + path);
        // 检测是否存在目录
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }
        try {
            DisplayPanel displayPanel = new DisplayPanel();
            displayPanel.setChangedescription(changedescription);
            displayPanel.setPaneldescription(paneldescription);
            image.transferTo(dest);
            displayPanel.setImage(path);
            displayPanel.setModifiedby(modifiedby);
            displayPanel.setChangedate(new Date(new SimpleDateFormat("yyyy-MM-dd").parse(changedate).getTime()));
            displayPanel.setGallery(new Long(gallery));
            displayPanel.setUploadedby(uploadedbytran);
            displayPanel.setUploadedtime(new Timestamp(System.currentTimeMillis()));
            displayPanelService.save(displayPanel);

            result.setResult(true);
            result.setResultDescription("保存成功！");
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            result.setResult(false);
            result.setResultDescription("保存失败");
            return result;
        }
    }

    @RequestMapping(value = "/panel/update", method = RequestMethod.POST)
    public Result updatePanel(@RequestParam Long id1,
                            @RequestParam String changedescription1,
                            @RequestParam String paneldescription1,
                            @RequestParam MultipartFile image1,
                            @RequestParam String modifiedby1,
                            @RequestParam String changedate1){
        Result result = new Result();

        try {
            DisplayPanel displayPanel = displayPanelService.findById(id1);
            displayPanel.setChangedescription(changedescription1);
            displayPanel.setPaneldescription(paneldescription1);
            displayPanel.setModifiedby(modifiedby1);
            displayPanel.setChangedate(new Date(new SimpleDateFormat("yyyy-MM-dd").parse(changedate1).getTime()));
            if (!image1.isEmpty()) {
                // 替换文件名
                String fileName = image1.getOriginalFilename();//获取文件名
                String suffixName = fileName.substring(fileName.lastIndexOf("."));// 获取文件的后缀名
                String newFileName = (new SimpleDateFormat("yyyyMMddHHmmssSSS")).format(new Date(System.currentTimeMillis()))+suffixName;
                String filePath = uploadDir;
                String path = "/images/new-gallery-photos/"+subSysName+"/"+displayPanel.getGallery()+"/"+newFileName;
                File dest = new File(filePath + path);
                // 检测是否存在目录
                if (!dest.getParentFile().exists()) {
                    dest.getParentFile().mkdirs();
                }
                image1.transferTo(dest);
                displayPanel.setImage(path);
            }
            displayPanelService.save(displayPanel);
            result.setResult(true);
            result.setResultDescription("保存成功！");
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            result.setResult(false);
            result.setResultDescription("保存失败");
            return result;
        }
    }

    @RequestMapping(value = "/gallery/galleryWithPanel",method = RequestMethod.GET)
    public List<GalleryWithPanelDto> findAllGalleryWithDisplayPanel(@RequestParam Long community) {
        return galleryService.findAllGalleryWithDisplayPanel(community);
    }

}