package cn.k0508.controller;

import cn.k0508.pojo.Rooms;
import cn.k0508.utils.QiniuUploadUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.math.RandomUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("rooms")
public class RoomsController extends BaseController<Rooms>{
    //图片上传操作
    @RequestMapping("uploadRoomPic")
    @ResponseBody
    public Map<String,Object> uploadRoomPic(String path, MultipartFile myFile){
        System.out.println("path = " + path);
        System.out.println("myFile = " + myFile);
        //新建文件上传后的map集合（上传结果）
        Map<String,Object> map = new HashMap<>();
        //---------------------文件上传开始---------------------//
        try {
            return QiniuUploadUtils.upload(myFile);
        } catch (IOException e) {
            e.printStackTrace();
            return null ;
        }
        //---------------------文件上传结束---------------------//

    };
}
