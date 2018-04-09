package gallery.common;

public enum Role {
    SUPERMANGER("超级管理员", new Long(1)), MANGER("管理员", new Long(2));
    // 成员变量  
    private String name;  
    private Long index;
    // 构造方法  
    private Role(String name, Long index) {
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