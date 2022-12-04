package cn.luckynow.monitoringserver.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import java.sql.Timestamp;

import io.swagger.annotations.ApiModel;
import lombok.Data;

/**
 * <p>
 * 
 * </p>
 *
 * @author xz
 * @since 2022-12-02
 */
@ApiModel(value = "Host对象", description = "")
@Data

public class Host implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id_host", type = IdType.AUTO)
    private Long idHost;

    private String ip;



}
