package cn.k0508.controller;

import cn.k0508.pojo.User;
import cn.k0508.service.UserService;
import cn.k0508.utils.MD5;
import cn.k0508.utils.VerifyCodeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Controller
@RequestMapping("user")
public class UserController extends BaseController<User>{
    @Autowired
    private UserService userService;
    //生成验证码,返回显示验证码的图片
    @RequestMapping("getVerifyCode")
    public void getVerifyCode(HttpServletResponse response, HttpSession session){
        //生成5位数的验证码
        String verifyCode = VerifyCodeUtils.generateVerifyCode(5);
        //把验证码转成小写存进session中
        session.setAttribute("verifyCode",verifyCode.toLowerCase());
        //把验证码图片响应到页面上
        try {
            VerifyCodeUtils.outputImage(220,35,response.getOutputStream(),verifyCode);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //验证码验证
    @RequestMapping("checkVerifyCode")
    @ResponseBody
    public String checkVerifyCode(String yzm,HttpSession session){
        //获取session中正确的验证码
        String verifyCode = (String) session.getAttribute("verifyCode");
        //把输入验证码与session的验证码进行对比
        if (verifyCode.equals(yzm.toLowerCase())){
            return "success";
        }else {
            return "fail";
        }

    }

    @RequestMapping("checkLogin")
    @ResponseBody
    public String checkLogin(User user,HttpSession session){
        //讲输入的密码MD5加密
        user.setPwd(MD5.md5crypt(user.getPwd()));
        try {
            User loginUser = userService.findTByParams(user);
            if (loginUser!=null){
                session.setAttribute("loginUser",loginUser);
                return "success";
            }else {
                return "fail";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
    }

    @RequestMapping("exitUser")
    @ResponseBody
    public String exitUser(HttpSession session){
        try {
            //从session中去掉用户信息
            session.removeAttribute("loginUser");
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }
}
