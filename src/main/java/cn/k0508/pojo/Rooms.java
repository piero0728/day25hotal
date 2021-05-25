package cn.k0508.pojo;

import lombok.Data;

@Data
public class Rooms {
    /** 主键 */
    private Integer id;

    /** 房屋封面图 */
    private String roomPic;

    /** 房间编号 */
    private String roomNum;

    /** 房间的状态(0空闲，1已入住，2打扫) */
    private String roomStatus;

    /** 房间类型主键 */
    private Integer roomTypeId;

    /** 1表示显示0不显示 */
    private Integer flag;

    //客房类型对象
    private RoomType roomType;

}
