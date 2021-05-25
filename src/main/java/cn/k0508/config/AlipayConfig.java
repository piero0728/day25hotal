package cn.k0508.config;

import java.io.FileWriter;
import java.io.IOException;

/* *
 *类名：AlipayConfig
 *功能：基础配置类
 *详细：设置帐户有关信息及返回路径
 *修改日期：2017-04-05
 *说明：  ksfxhw3818@sandbox.com   111111
 *以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 *该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
 */

public class AlipayConfig {
	
//↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

	// 应用ID,您的APPID，收款账号既是您的APPID对应支付宝账号
	public static String app_id = "2021000117656035";
	
	// 商户私钥，您的PKCS8格式RSA2私钥
    public static String merchant_private_key = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCaAvRRMqNai0PptLgKj+m0WQ1lXn5fSVCCSu3u8VNBypJqbqsu+mzCQzg/no+aNBR9Jceq42Il+JDOCe3VBk3FBdpjDnHqXy9Vu+krkqWkN3F8j0VVvUAc+w3kQA7S/g3DCV7BwOMDOXyDT7uxa6rlN2AyteVFxv1/kHj4XxDu3OHZOOzhncHFJT6+O6+6s+5qD09kyKpOuKK1x/JVjsfxXOK2/lo9jIecVdirFNTZvozywvx9ApVLcPuzCVLf++iVauBESGrhE5p0ohIgXBKgd2BiiR0Kh6emFwty/tpfaT5EnSTkIhokjTtDSs70sONfn4udJzK1uFSiF8L4uRmhAgMBAAECggEARiNOTKQ5DIUb2pT4s6aykfV0SlPsTUzAI3YoQYcZmX69i0b3Ip/dY+Lk/OQjFeDd69iGw+ZlzlES8SJIc5k5VZ7CxBXR/yB2GB9JoxRX5x9wyX8d3lwflJMo0mfx2Fjmv4nG44oKWG+Xqt1m5vfXjifX4YBA97QVwkBzNvlkZsLvqLBa5XMlJ7nZToyBfo/SPcUYwKYAUZuqe4BvDENcBi2f5AyCRkV5w8ghOgR50KcRLOuD+qu7AM7LaW2fvlz2lT9CIWzXuCWfzbaZndFx3pc03qhK3+rHt69A9CJQpe0qi1KxhnzVBW0Pi6pYop1sk7kPz7eDiMnA+d7ug/g9IQKBgQDVowor0Z8lEjt8zCd9v02ho1Szx+My9lNr0UIBbnOayp0NZW/PyHCa4J9MBJEpxl798x+YcFm0c++Y1bxfm189NwXhXFyDU89a0qBm8TI89YfoQLrKmjqvoZyaRZWnX823VJoExuR4/l/k+FT2UOKlG4Wmbt9ocwE789vv10jsrQKBgQC4jR9ne28tHfeXtQ+mHEG8fcrvR1bZw+vccWPVLLvT82QfnlaCv5AP2vhLenaqmlJrZxNIjH/Lpq9OuQ+YS+5Vv2fmdGBFuQiwEhMsGTI+Ph0fZE4LASzgHfHZxmcvdmfV+3plHhhs0zLwN0joKBo2Fy0Poc5gFmBY00nny1lrRQKBgQC/ss/yp+ONCUI15p9dF6cabowX0jpNxXjvm1MGI806TasFlUrygOKCJyLpvINhn+4nI9zrFY14/js1wjyI8ctRC6mMIiulcDP1RGDIXo/84Tk1r7etCx2z8WmriNsT2ESoyBJ4TNxAscjsleTvLX9iNkMEKCLx/5hQ6q4lFeIK9QKBgDEnLRkTsB21II+gYsWcOwnn+xfVyVUAsJ4q+Sr62h/ucFlXg7UZLlZ6vKzlthtkNNV0Q5eMDDGCeKif835douHls9eWYVnQmXbDqaWSJGadhoYo4fxeWMRsVVDqXesvPyKn8wZhiKHbcnK2Vs22eJy1eYPzVZMUAp9FzyZUa8F9AoGAZJX65bYoyFIlbp+nVlJuroqFnIuDNThhun/Wec4Wf5iBHJ9I1R0uUxGIIcSLKiLZUM3CTr18OmUuIdWTuqq+NAF5Vp4jotN7X3/KVjUi+xF24qN3k4Z5aTOzhIGciy8UWVqYPe6vmqdx20hbAQpAjxSC1id52caYfFulqBx2bPc=";
	
	// 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
    public static String alipay_public_key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmgL0UTKjWotD6bS4Co/ptFkNZV5+X0lQgkrt7vFTQcqSam6rLvpswkM4P56PmjQUfSXHquNiJfiQzgnt1QZNxQXaYw5x6l8vVbvpK5KlpDdxfI9FVb1AHPsN5EAO0v4NwwlewcDjAzl8g0+7sWuq5TdgMrXlRcb9f5B4+F8Q7tzh2Tjs4Z3BxSU+vjuvurPuag9PZMiqTriitcfyVY7H8Vzitv5aPYyHnFXYqxTU2b6M8sL8fQKVS3D7swlS3/volWrgREhq4ROadKISIFwSoHdgYokdCoenphcLcv7aX2k+RJ0k5CIaJI07Q0rO9LDjX5+LnScytbhUohfC+LkZoQIDAQAB";

	// 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	public static String notify_url = "http://工程公网访问地址/alipay.trade.page.pay-JAVA-UTF-8/notify_url.jsp";

	// 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
	public static String return_url = "http://localhost/day25hotal-1.0-SNAPSHOT/orders/afterOrdersPay";

	// 签名方式
	public static String sign_type = "RSA2";
	
	// 字符编码格式
	public static String charset = "utf-8";
	
	// 支付宝网关
	public static String gatewayUrl = "https://openapi.alipaydev.com/gateway.do";
	
	// 支付宝网关
	public static String log_path = "C:\\";


//↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

    /** 
     * 写日志，方便测试（看网站需求，也可以改成把记录存入数据库）
     * @param sWord 要写入日志里的文本内容
     */
    public static void logResult(String sWord) {
        FileWriter writer = null;
        try {
            writer = new FileWriter(log_path + "alipay_log_" + System.currentTimeMillis()+".txt");
            writer.write(sWord);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

