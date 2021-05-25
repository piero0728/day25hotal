package cn.k0508.Interceptor;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//拦截器
public class SysInterceptor extends HandlerInterceptorAdapter {

    //拦截器核心方法
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //得到session中的用户数据
        Object loginUser = request.getSession().getAttribute("loginUser");
        if (loginUser!=null){
            return true;
        }else {

            request.setAttribute("loginUIMsg","loginUIMsg");
            //转发
            request.getRequestDispatcher("/model/toLoginUI").forward(request,response);
            return false;
        }
    }
}
