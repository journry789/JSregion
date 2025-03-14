/**
 * 示例数据
 * 用于演示区域数据解析和查询功能
 */

const sampleData = `39986| 贵州省	520000	毕节市	520500	七星关区	520502	德溪街道	520502010	
39987| 广西壮族自治区	450000	防城港市	450600	防城区	450603	珠河街道	450603002	
39988| 广西壮族自治区	450000	防城港市	450600	防城区	450603	水营街道	450603001	
39989| 广西壮族自治区	450000	防城港市	450600	防城区	450603	文昌街道	450603003	
39990| 河南省	410000	驻马店市	411700	新蔡县	411729	月亮湾街道	411729003	
39991| 广西壮族自治区	450000	崇左市	451400	江州区	451402	石景林街道	451402003	
39992| 河南省	410000	安阳市	410500	滑县	410526	锦和街道	410526003	
39993| 贵州省	520000	黔西南布依族苗族自治州	522300	贞丰县	522325	珉谷街道	522325002	
39994| 辽宁省	210000	盘锦市	211100	兴隆台区	211103	沈采街道	211103013	
39995| 辽宁省	210000	沈阳市	210100	新民市	210181	兴隆堡镇	210181108	
39996| 湖南省	430000	娄底市	431300	涟源市	431382	湖泉镇	431382117	
39997| 吉林省	220000	白城市	220800	通榆县	220822	八区街道	220822002	
39998| 吉林省	220000	白城市	220800	通榆县	220822	开通镇	220822100	
39999| 湖南省	430000	常德市	430700	武陵区	430702	柳叶湖街道	430702013	
40000| 江苏省	320000	苏州市	320500	常熟市	320581	东南街道	320581006	
40001| 湖南省	430000	衡阳市	430400	衡南县	430422	云集街道	430422001	
40002| 江苏省	320000	苏州市	320500	昆山市	320583	花桥镇	320583104	
40003| 上海市	310000	上海市	310100	青浦区	310118	白鹤镇	310118110	
40004| 四川省	510000	资阳市	512000	雁江区	512002	宝莲街道	512002005	
40005| 天津市	120000	天津市	120100	宁河区	120117	北淮淀镇	120117113	
40006| 天津市	120000	天津市	120100	宁河区	120117	七里海镇	120117110	
40007| 北京市	110000	北京市	110100	西城区	110102	白纸坊街道	110102019	
40008| 河南省	410000	新乡市	410700	原阳县	410725	阳和街道	410725002	
40009| 贵州省	520000	毕节市	520500	金沙县	520523	民兴街道	520523005`;

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sampleData };
} else {
    // 在浏览器环境中
    window.sampleData = sampleData;
} 