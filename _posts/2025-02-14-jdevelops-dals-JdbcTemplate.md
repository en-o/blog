---
layout: mypost
title: 🔗JdbcTemplate
categories: [Jdevelops, JdbcTemplate, SpringBoot, Java, 数据处理]
extMath: true
---

> 在注解里写sql ， 懒得在手动的去引入jdbctemplate后写一大堆东西
>
> [具体使用方法请看](https://github.com/en-o/Jdevelops-Example/tree/main/dal-jdbctemplate/src/test/java/cn/tannn/demo/jdevelops/daljdbctemplate)
>

---

# 基础配置
| 属性 | 说明 | 备注 |
| --- | --- | --- |
| <font style="color:#080808;background-color:#ffffff;">jdevelops.jdbc.base-package</font> | <font style="color:#080808;background-color:#ffffff;">扫描被标记{@link cn.tannn.jdevelops.annotations.jdbctemplate.JdbcTemplate}的字段，为其生成代理,作用范围为spring bean, 具体请看{@link cn.tannn.jdevelops.jdectemplate.util.AnnotationScanner#scanPackages}</font> | <font style="color:#080808;background-color:#ffffff;">必须填写，要不然代理不生效</font> |
| | | |


# 注解
## 主注解
| 注解 | 作用范围 | 使用场景 | 备注 |
| --- | --- | --- | --- |
| @JdbcTemplate | 接口字段上 | <font style="color:#080808;background-color:#ffffff;">用于配合 查询 删除 更新 新增 注解</font> | <font style="color:#080808;background-color:#ffffff;">动态代理标记位</font> |
| | | | |


## 配合注解
> 带开发注解
>
> + @delete 删除注解
> + @Update 更新注解
> + @Insert 新增注解
>

| 注解 | 作用范围 | 使用场景 | 参数 |
| --- | --- | --- | --- |
| @<font style="color:#080808;background-color:#ffffff;">Query</font> | 接口方法 | <font style="color:#080808;background-color:#ffffff;">查询注解</font> | <font style="color:#080808;background-color:#ffffff;">value： 构建sql语句</font> |
| | | | |


```java
// 想要实现类上不对当前方法重写并生效查询配置，用def修饰就行了
@Query("select * from sys_user")
default List<User> findAll(){
    return Collections.emptyList();
}

@Query("select * from sys_user where name = '#{user.name}' or login_name = '#{user.loginName}' ")
User findByBean(UserBO user)

```

## SQL中的表达式
1. 取实体参数的值

> <font style="color:#067d17;background-color:#ffffff;">#{user.name}</font>
>

2. 取参数值

> <font style="color:#067d17;background-color:#ffffff;">#{id}</font>
>

```java
@Query("select * from sys_user where name = '#{user.name}' or login_name = '#{user.loginName}' ")
User findByBean(UserBO user)


@Query("select name from sys_user where  id = #{id} ")
String findNameById(Integer id);
```

# 引入依赖
> 只测试了  mysql 8
>

```xml
<dependency>
  <groupId>cn.tannn.jdevelops</groupId>
  <artifactId>jdevelops-dals-jdbctemplate</artifactId>
  <version>1.0.1-SNAPSHOT</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
   <version>8.0.27</version>
</dependency>
<dependency>
  <groupId>cn.tannn.jdevelops</groupId>
  <artifactId>jdevelops-apis-result</artifactId>
  <version>1.0.1-SNAPSHOT</version>
</dependency>
```



# 使用参考
1. 构建service接口类，为其添加相关操作注解如：`@Query`

```java
@Service
public interface DefQueryUserService {
    @Query("select * from sys_user")
    default List<User> findAll(){
        return Collections.emptyList();
    }
    @Query("select * from sys_user")
    List<User> findAll();
}
```

2. 在使用类上 注入 构建的接口类，然后标记`@JdbcTemplate`

```plain
@JdbcTemplate
DefQueryUserService defQueryUserService
```

3. 将当前项目的根路径地址写到`<font style="color:#080808;background-color:#ffffff;">jdevelops.jdbc.base-package</font>`使其生效

```yaml
jdevelops.jdbc.base-package=cn.tannn.demo.jdevelops.daljdbctemplate
```

4. 参考Test中的使用
    1. <font style="color:#DF2A3F;">test中是使用</font>`<font style="color:#DF2A3F;background-color:#ffffff;">BeforeEach</font>`<font style="color:#DF2A3F;background-color:#ffffff;">测试的，真实环境只需要根据第二步的操作就好了</font>

## 配置文件配置
```properties

jdevelops.jdbc.base-package=cn.tannn.demo.jdevelops.daljdbctemplate.service

```

## @Query
> <font style="color:#F5222D;">数据库别忘了连接</font>
>
> <font style="color:#F5222D;">三种方式：</font>
>

### 只使用接口
```java
package cn.tannn.demo.jdevelops.daljdbctemplate.service;


import cn.tannn.demo.jdevelops.daljdbctemplate.entity.User;
import cn.tannn.demo.jdevelops.daljdbctemplate.entity.UserBO;
import cn.tannn.jdevelops.annotations.jdbctemplate.JdbcTemplate;
import cn.tannn.jdevelops.annotations.jdbctemplate.Query;
import cn.tannn.jdevelops.result.request.Paging;
import cn.tannn.jdevelops.result.response.PageResult;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author tnnn
 * @version V1.0
 * @date 2022-08-01 13:41
 */
public interface QueryUserService {

    // 想要实现类上不对当前方法重写并生效查询配置，用def修饰就行了
   @Query("select * from sys_user")
    default List<User> findAll(){
        // 重写没用
        return Collections.emptyList();
    }

    @Query("select * from sys_user where id = 1 ")
    User findById();


    @Query("select * from sys_user where id = 1 ")
    UserBO findByIdByBo();
}

```

### 只使用class
```java
package cn.tannn.demo.jdevelops.daljdbctemplate.service;

import cn.tannn.demo.jdevelops.daljdbctemplate.entity.User;
import cn.tannn.demo.jdevelops.daljdbctemplate.entity.UserBO;
import cn.tannn.jdevelops.annotations.jdbctemplate.Query;
import cn.tannn.jdevelops.result.request.Paging;
import cn.tannn.jdevelops.result.response.PageResult;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 *  没有接口的class
 * @author tnnn
 * @version V1.0
 * @date 2022-08-01 13:41
 */
@Service
public  class NoInterfaceQueryImpl {

    @Query("select * from sys_user")
    public List<User> findAll() {
        return Collections.emptyList();
    }

    @Query("select * from sys_user where id = 1 ")
    public User findById() {
        return null;
    }


    @Query("select * from sys_user where id = 1 ")
    public UserBO findByIdByBo() {
        return null;
    }

    public String noQuery() {
        return "no @Query";
    }
}

```

### 接口+实现
```java
package cn.tannn.demo.jdevelops.daljdbctemplate.service;

import cn.tannn.demo.jdevelops.daljdbctemplate.entity.User;
import cn.tannn.demo.jdevelops.daljdbctemplate.entity.UserBO;
import cn.tannn.jdevelops.annotations.jdbctemplate.Query;

import java.util.Collections;
import java.util.List;

/**
 *
 * @author tnnn
 * @version V1.0
 * @date 2022-08-01 13:41
 */
public interface ExistInterface {
    @Query("select * from sys_user")
    default List<User> findAll() {
        return Collections.emptyList();
    }

    @Query("select * from sys_user where id = 1 ")
    User findById();


    UserBO findByIdByBo();
}

```

```java
package cn.tannn.demo.jdevelops.daljdbctemplate.service;

import cn.tannn.demo.jdevelops.daljdbctemplate.entity.User;
import cn.tannn.demo.jdevelops.daljdbctemplate.entity.UserBO;
import cn.tannn.jdevelops.annotations.jdbctemplate.Query;
import org.springframework.stereotype.Service;

/**
 * xx
 *
 * @author <a href="https://t.tannn.cn/">tan</a>
 * @version V1.0
 * @date 2024/12/16 09:59
 */
@Service
public class ExistInterfaceImpl implements ExistInterface {
    @Override
    public User findById() {
        return null;
    }

    // 这种写法不行。 必须写在接口方法上
    @Query("select * from sys_user where id = 1 ")
    @Override
    public UserBO findByIdByBo() {
        UserBO userBO = new UserBO();
        userBO.setName("这种写法不行。 必须写在接口方法上");
        return userBO;
    }
}

```

### 测试
```java
package cn.tannn.demo.jdevelops.daljdbctemplate;

import cn.tannn.demo.jdevelops.daljdbctemplate.service.QueryUserService;
import cn.tannn.jdevelops.annotations.jdbctemplate.JdbcTemplate;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * @author <a href="https://t.tannn.cn/">tan</a>
 * @version V1.0
 * @date 2024/12/13 14:40
 */
@Component
public class TestScanner implements ApplicationRunner {

    @JdbcTemplate
    QueryUserService queryUserService;
    @Override
    public void run(ApplicationArguments args) throws Exception {
        queryUserService.findAll().forEach(it -> System.out.printf(it.toString()));
    }
}

```

```java
package cn.tannn.demo.jdevelops.daljdbctemplate;

import cn.tannn.demo.jdevelops.daljdbctemplate.entity.User;
import cn.tannn.demo.jdevelops.daljdbctemplate.entity.UserBO;
import cn.tannn.demo.jdevelops.daljdbctemplate.service.QueryUserService;
import cn.tannn.jdevelops.annotations.jdbctemplate.Query;
import cn.tannn.jdevelops.jdectemplate.core.CreateProxy;
import cn.tannn.jdevelops.result.request.Paging;
import cn.tannn.jdevelops.result.response.PageResult;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;


@SpringBootTest
class QueryTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    QueryUserService queryUserService;

    @BeforeEach
    void x(){
        // 这是特殊写法，要不然单测无法进行，正常使用看上面的
        queryUserService = (QueryUserService)CreateProxy.createQueryProxy(QueryUserService.class, jdbcTemplate);
    }

    @Test
    void findAll() {
        queryUserService.findAll().forEach(it -> System.out.printf(it.toString()));
    }

    @Test
    void findById() {
        System.out.println(queryUserService.findById());
    }

    @Test
    void findByIdByBo() {
        System.out.println(queryUserService.findByIdByBo());
    }

    @Test
    void findById2() {
        System.out.println(queryUserService.findById(2));
    }

    @Test
    void findById3() {
//        Assertions.assertThrows(EmptyResultDataAccessException.class, () -> {
//            queryUserService.findById(10);
//        });
            //优化成 null 了
        Assertions.assertNull(queryUserService.findById(10));
    }

    @Test
    void findByBean() {
        UserBO userBO = new UserBO();
        userBO.setName("超级管理员");
        userBO.setLoginName("admin");
        System.out.println(queryUserService.findByBean(userBO));
    }

    @Test
    void findByBean2() {
        UserBO userBO = new UserBO();
        userBO.setName("111");
        userBO.setLoginName("SH-01");
        queryUserService.findByBean2(userBO).forEach(it -> System.out.println(it.toString()));
    }

    @Test
    void findName() {
        queryUserService.findName().forEach(System.out::println);
    }


    @Test
    void findId() {
        System.out.println(queryUserService.findId());
    }


    @Test
    void findIdByName() {
        System.out.println(queryUserService.findIdByName("用户1"));
    }

    @Test
    void findIdByName2() {
        assertEquals("User{id=6, userNo='1469200914007695361', name='111', address='重庆', loginName='XX-01', loginPwd='1231', phone='1312', userIcon='null'}"
                , queryUserService.findIdByNameAndAddress("111", "重庆").toString());
        // null
        Assertions.assertNull(queryUserService.findIdByNameAndAddress("112", "重庆"));
        Assertions.assertThrows(IncorrectResultSizeDataAccessException.class, () -> {
            // IncorrectResultSizeDataAccessException
            queryUserService.findIdByNameAndAddress("test2", "重庆test");
        });
    }

    @Test
    void findAllPage() {
//        queryUserServiceImpl.findAllPage(new Paging(1, 2))
//                .getRows().forEach(it -> System.out.printf(it.toString()));

        PageResult<User> allPage = queryUserService.findAllPage(new Paging(1, 2));
        System.out.println("第一页：" + allPage);
        System.out.println("第二页：" + queryUserService.findAllPage(new Paging(2, 2)));
    }

    @Test
    void findAllPage_2() {
//        queryUserServiceImpl.findAllPage(new Paging(1, 2))
//                .getRows().forEach(it -> System.out.printf(it.toString()));
        System.out.println("第一页：" + queryUserService.findAllPage("111", "重庆", new Paging(1, 2)));
        System.out.println("第二页：" + queryUserService.findAllPage("111", "重庆", new Paging(2, 2)));
    }

    @Test
    void findAllPageByName() {
//        queryUserServiceImpl.findAllPage(new Paging(1, 2))
//                .getRows().forEach(it -> System.out.printf(it.toString()));
        System.out.println("第一页：" + queryUserService.findAllPageByName(new Paging(1, 2)));
        System.out.println("第二页：" + queryUserService.findAllPageByName(new Paging(2, 2)));
    }

    /**
     * 排序 - 写死
     */
    @Test
    void findAllOrderD() {
        queryUserService.findAllOrderD().forEach(it -> System.out.printf(it.toString()));
    }
    /**
     * 排序 - 写死
     */
    @Test
    void findAllOrderA() {
        queryUserService.findAllOrderA().forEach(it -> System.out.printf(it.toString()));
    }


    /**
     * page - like
     */
    @Test
    void findLikePage() {
        // currentPage=2, pageSize=2, totalPages=2, total=4

        // sql select * from sys_user where name like '%用户%'
        // sql SELECT COUNT(*) from sys_user where name like '%用户%'
        System.out.println("第一页：" + queryUserService.findLikePage("%用户%", new Paging(1, 2)));
        System.out.println("第二页：" + queryUserService.findLikePage("%用户%", new Paging(2, 2)));
    }
}

```



# 工具类使用
## JdbcTemplateUtil#<font style="color:#080808;background-color:#ffffff;">queryForObject</font>
全功能查询接口

```java
 /**
     * list查询
     */
    LIST,
    /**
     * 分页查询
     */
    PAGE,

    /**
     * MAP
     */
    MAP,

    /**
     * 数组  这种[1,2,3]
     */
    ARRAYS,

    /**
     * 只有一个数据，如： 就返回一个 数字，字符串 [ARRAYS脱掉组只留一个]
     */
    ONLY;
```

> 目前不适配 直接返回`Map` 和 `List<Map>`
>

```java
 @Test
    void testONLY(){
        Integer object = (Integer) JdbcTemplateUtil.queryForObject(jdbcTemplate
                , SelectType.ONLY, Integer.class
                , "select count(*) from sys_user"
        );
        System.out.println(object);
    }
    @Test
    void testARRAYS(){
        List<Integer> id = (List<Integer>) JdbcTemplateUtil.queryForObject(jdbcTemplate
                , SelectType.ARRAYS, Integer.class
                , "select id from sys_user"
        );
        System.out.println(id);
    }


    @Test
    void testLIST(){
        List<User> id = (List<User>) JdbcTemplateUtil.queryForObject(jdbcTemplate
                , SelectType.LIST,  User.class
                , "select id,name from sys_user"
        );
        id.forEach(System.out::println);
    }
```

## InteriorJdbcTemplateUtil#<font style="color:rgb(35, 41, 48);">paging</font>
> <font style="color:#DF2A3F;"> 已不建议使用</font>, 请使用`JdbcTemplateUtil#queryForObject`
>

```java
package cn.tannn.demo.jdevelops.daljdbctemplate;

import cn.tannn.demo.jdevelops.daljdbctemplate.entity.User;
import cn.tannn.jdevelops.jdectemplate.util.JdbcTemplateUtil;
import cn.tannn.jdevelops.result.request.Paging;
import cn.tannn.jdevelops.result.response.PageResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * 测试JdbcTemplateUtil
 *
 * @author <a href="https://t.tannn.cn/">tan</a>
 * @version V1.0
 * @date 2024/11/25 下午1:17
 */
@SpringBootTest
public class JdbcTemplateUtilTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void testPageFullSql(){
        Paging paging1 = new Paging(1, 2);
        Paging paging2 = new Paging(2, 2);
        PageResult<User> p1 = InteriorJdbcTemplateUtil.paging(jdbcTemplate
                , "select * from sys_user where name like '%用户%'"
                , User.class, paging1);

        PageResult<User> p2 = InteriorJdbcTemplateUtil.paging(jdbcTemplate
                , "select * from sys_user where name like '%用户%'"
                , User.class, paging2);

        System.out.println("第一页：" + p1);
        System.out.println("第二页：" + p2);
    }

    @Test
    void testPagePlaceholderSql(){
        PageResult<User> paging = InteriorJdbcTemplateUtil.paging(jdbcTemplate
                , "select * from sys_user where name like ? "
                , User.class, new Paging(1, 2), "%用户%");
        System.out.println(paging);
    }
}

```

# 注意
1. sql中的单引号 百分号 注意需要的时候要自己手动加上，跟手写sql没什么区别 
    1. `<font style="color:#080808;background-color:#ffffff;">login_name = </font><font style="color:#DF2A3F;background-color:#ffffff;">'</font><font style="color:#080808;background-color:#ffffff;">#{user.loginName}</font><font style="color:#DF2A3F;background-color:#ffffff;">'</font>`

