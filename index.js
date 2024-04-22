// 导入 axios 模块
const axios = require('axios');

// 定义获取微博热搜数据的异步函数
async function getWeiboHotSearch() {
    try {
        // 发送 GET 请求获取微博热搜数据
        const response = await axios.get('https://weibo.com/ajax/side/hotSearch');
        // 从响应数据中提取实时热搜列表
        const data = response.data.data.realtime;
        // 初始化热搜列表
        const hotSearchList = [];

        // 定义热搜类型的映射关系
        const jyzy = {
            '电影': '影',
            '剧集': '剧',
            '综艺': '综',
            '音乐': '音'
        };

        // 遍历实时热搜数据，构建热搜列表
        for (const item of data) {
            let hot = '';

            // 如果是广告则跳过
            if (item.is_ad) {
                continue;
            }

            // 判断热搜类型并映射为简写
            if (item.flag_desc) {
                hot = jyzy[item.flag_desc] || '';
            }

            // 根据热度标志设置热搜类型
            if (item.is_boom) {
                hot = '爆';
            }

            if (item.is_hot) {
                hot = '热';
            }

            if (item.is_fei) {
                hot = '沸';
            }

            if (item.is_new) {
                hot = '新';
            }

            // 构建热搜条目对象并添加到热搜列表中
            hotSearchList.push({
                title: item.note,
                url: `https://s.weibo.com/weibo?q=%23${encodeURIComponent(item.word)}%23`,
                num: item.num,
                hot: hot
            });
        }

        // 返回热搜列表
        return hotSearchList;
    } catch (error) {
        // 发生错误时打印错误信息并返回空数组
        console.error('Error fetching Weibo hot search:', error);
        return [];
    }
}

// 导出云函数的主函数
exports.main = async (event, context) => {
    // 调用获取微博热搜数据的函数
    const data = await getWeiboHotSearch();

    // 构建返回结果对象
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // 设置跨域允许的源
            'Content-Type': 'application/json' // 设置响应内容类型为 JSON
        },
        body: JSON.stringify(data) // 将热搜数据转换为 JSON 字符串作为响应体
    };

    // 返回结果对象
    return response;
};
