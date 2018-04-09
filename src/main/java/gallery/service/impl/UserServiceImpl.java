package gallery.service.impl;

import gallery.Util.JWT;
import gallery.Util.MD5Util;
import gallery.dao.CommonDao;
import gallery.dao.UserRepository;
import gallery.domain.User;
import gallery.dto.Result;
import gallery.dto.UserDto;
import gallery.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserServiceImpl implements UserService {
	 @Autowired
	 private UserRepository userRepository;
	 @Autowired
	 private CommonDao commonDao;

	public Result registerUser(User user) {
		Result result = new Result();
		if (userRepository.findByUsername(user.getUsername()).isEmpty()) {
			userRepository.save(user);
			result.setResultDescription("注册成功,等待激活！");
		} else {
			result.setResultDescription("用户名已被占用，请重新注册！");
		}
		return  result;
	}

	public Result verifyUserName(User user) {
		Result result = new Result();
		user.setPassword(MD5Util.getMD5(user.getPassword()));
		List<User> userList = userRepository.findByUsernameAndPassword(user.getUsername(),user.getPassword());
		if (userList.isEmpty()) {
			result.setResult(false);
			result.setResultDescription("用户名或密码错误！");
		} else {
			if (userList.get(0).getIsactive()==0) {
				result.setResult(false);
				result.setResultDescription("用户未激活，请等待！");
			}else {
				String token = JWT.sign(userList.get(0),30L * 24L * 3600L * 1000L);
				result.setResult(true);
				result.setToken(token);
			}
		}
		return result;
	}

	public Result changePwd(String username,String oldpwd, String newpwd){
		Result result = new Result();
		User user = userRepository.findByUsername(username).get(0);
		if (MD5Util.getMD5(oldpwd).equals(user.getPassword())) {
			user.setPassword(MD5Util.getMD5(newpwd));
			userRepository.save(user);
			result.setResult(true);
			result.setResultDescription("修改密码成功！");
		}else {
			result.setResult(false);
			result.setResultDescription("原密码错误，修改密码失败！");
		}
		return result;
	}

	public UserDto findUserlist(Integer length,Integer start){
		UserDto userDto = new UserDto();
		Integer page = start/length;
		Page<User> users = userRepository.findAll(new PageRequest(page,length));
		userDto.setData(users.getContent());
		userDto.setRecordsTotal((int) users.getTotalElements());
		userDto.setRecordsFiltered((int) users.getTotalElements());
		return userDto;
	}

	public Result userActive(String username,Long active){
		Result result = new Result();
		User user = userRepository.findByUsername(username).get(0);
		user.setIsactive(active);
		try {
			userRepository.save(user);
			result.setResultDescription("操作成功！");
		}catch (Exception ex){
			result.setResultDescription("操作失败！");
		}
		return result;
	}
}
