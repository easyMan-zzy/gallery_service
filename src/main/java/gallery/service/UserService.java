package gallery.service;

import gallery.domain.User;
import gallery.dto.Result;
import gallery.dto.UserDto;

public interface UserService {
    public Result registerUser(User user);
    public Result verifyUserName(User user);
    public Result changePwd(String username,String oldpwd, String newpwd);
    public UserDto findUserlist(Integer length,Integer start);
    public Result userActive(String username,Long active);
}
