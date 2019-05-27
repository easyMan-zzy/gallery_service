package gallery.common;

public enum UserStatus {
    ACTIVE("激活", new Long(1)), UNACTIVE("未激活", new Long(0));
    // 成员变量
    private String name;
    private Long index;
    // 构造方法
    private UserStatus(String name, Long index) {
        this.name = name;  
        this.index = index;  
    }

    // get set 方法  
    public String getName() {  
        return name;  
    }
    public void setName(String name) {  
        this.name = name;  
    }
    public Long getIndex() {
        return index;  
    }
    public void setIndex(Long index) {
        this.index = index;  
    }
}  