const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ---------------- 配置项 ----------------
// 从环境变量读取API密钥
const SONNET_API_KEY = process.env.SONNET_API_KEY || '';
const SONNET_API_ENDPOINT = process.env.SONNET_API_ENDPOINT || 'https://api.anthropic.com/v1/messages';
const THIRD_PARTY_API_KEY = process.env.THIRD_PARTY_API_KEY || '';

// ---------------- 工具函数 ----------------

/**
 * 解析链接内容（小红书/公众号）
 * 注意：这里需要使用第三方API或自定义爬虫
 * 由于小红书和公众号都有反爬机制，建议使用第三方API服务
 */
async function parseUrlContent(url) {
    console.log('正在解析链接:', url);
    
    let content = "", readCount = 0, commentCount = 0;

    try {
        if (url.includes('xiaohongshu.com') || url.includes('xhslink.com')) {
            // 小红书解析
            // 这里需要集成第三方API，例如：芝士数据、蝉妈妈、新红数据
            // 示例代码（需要替换为实际的API）
            if (THIRD_PARTY_API_KEY) {
                // TODO: 替换为实际的第三方API调用
                // 当配置了API密钥时，调用真实的第三方API
                // const res = await axios.get('https://api.example.com/xiaohongshu/parse', {
                //     params: { url, apiKey: THIRD_PARTY_API_KEY }
                // });
                // content = res.data.content;
                // readCount = res.data.readCount;
                // commentCount = res.data.commentCount;
                
                // 暂时抛出错误提示，提醒开发者需要实现真实的API调用
                throw new Error('请在代码中实现真实的小红书API调用逻辑');
            } else {
                // 未配置API密钥时，使用模拟数据作为演示
                console.warn('未配置第三方API密钥，使用模拟数据');
                content = "这是一篇关于小红书内容营销的文章。文章详细介绍了如何通过优质内容吸引用户关注，提升品牌影响力。文章提到了内容创作的技巧、用户互动的重要性以及数据分析的方法。";
                readCount = Math.floor(Math.random() * 10000) + 1000;
                commentCount = Math.floor(Math.random() * 500) + 50;
            }
        } else if (url.includes('mp.weixin.qq.com')) {
            // 公众号解析
            // 这里需要集成第三方API，例如：新榜、清博指数、微小宝
            if (THIRD_PARTY_API_KEY) {
                // TODO: 替换为实际的第三方API调用
                // 当配置了API密钥时，调用真实的第三方API
                // const res = await axios.get('https://api.example.com/weixin/parse', {
                //     params: { url, apiKey: THIRD_PARTY_API_KEY }
                // });
                // content = res.data.content;
                // readCount = res.data.readCount;
                // commentCount = res.data.commentCount;
                
                // 暂时抛出错误提示，提醒开发者需要实现真实的API调用
                throw new Error('请在代码中实现真实的公众号API调用逻辑');
            } else {
                // 未配置API密钥时，使用模拟数据作为演示
                console.warn('未配置第三方API密钥，使用模拟数据');
                content = "这是一篇公众号文章，讨论了微信营销的最佳实践。文章分析了公众号运营的核心要素，包括内容定位、粉丝互动、推送时机等。作者分享了多个成功案例和实用技巧。";
                readCount = Math.floor(Math.random() * 50000) + 5000;
                commentCount = Math.floor(Math.random() * 1000) + 100;
            }
        } else {
            throw new Error('不支持的链接类型，目前仅支持小红书和微信公众号链接');
        }

        return { content, readCount, commentCount };
    } catch (error) {
        console.error('解析链接失败:', error.message);
        throw error;
    }
}

/**
 * 调用 Sonnet API 提取关键词
 * 使用 Anthropic Claude API
 */
async function extractKeywords(content) {
    if (!SONNET_API_KEY) {
        console.warn('未配置 Sonnet API 密钥，使用简单关键词提取');
        // 简单的关键词提取备用方案
        return extractKeywordsSimple(content);
    }

    try {
        const prompt = `请分析以下文章内容，提取5-8个核心关键词。要求：
1. 关键词要简洁准确，能代表文章核心主题
2. 优先提取行业术语、专业概念、重点话题
3. 仅返回关键词列表，用中文逗号分隔，不要其他说明文字

文章内容：
${content.substring(0, 2000)}`;

        console.log('正在调用 AI API 提取关键词...');
        
        const res = await axios.post(
            SONNET_API_ENDPOINT,
            {
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3
            },
            {
                headers: {
                    'x-api-key': SONNET_API_KEY,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
                timeout: 30000
            }
        );

        const responseText = res.data.content[0].text;
        console.log('AI 返回结果:', responseText);
        
        // 解析关键词
        const keywords = responseText
            .split(/[,，、]/)
            .map(k => k.trim())
            .filter(k => k.length > 0 && k.length < 20)
            .slice(0, 8);

        return keywords.length > 0 ? keywords : extractKeywordsSimple(content);
    } catch (error) {
        console.error('AI 关键词提取失败:', error.message);
        // 降级到简单提取方法
        return extractKeywordsSimple(content);
    }
}

/**
 * 简单的关键词提取（备用方案）
 * 基于词频统计
 */
function extractKeywordsSimple(content) {
    // 移除标点符号和特殊字符
    const cleanContent = content.replace(/[，。！？；：、""''（）【】《》\s]/g, ' ');
    
    // 简单的中文分词（按空格和常见词分割）
    const words = cleanContent.split(/\s+/).filter(w => w.length >= 2);
    
    // 统计词频
    const wordCount = {};
    words.forEach(word => {
        if (word.length >= 2 && word.length <= 6) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });
    
    // 排序并取前8个
    const sortedWords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([word]) => word);
    
    return sortedWords.length > 0 ? sortedWords : ['内容分析', '关键词提取', '数据统计'];
}

// ---------------- API 接口 ----------------

/**
 * 主分析接口
 */
app.post('/api/analyze', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: '请提供文章链接' });
        }

        console.log('\n=== 开始分析 ===');
        console.log('URL:', url);

        // 步骤1：解析链接内容、阅读量、评论数
        const { content, readCount, commentCount } = await parseUrlContent(url);
        
        // 步骤2：调用 Sonnet 提取关键词
        const keywords = await extractKeywords(content);
        
        console.log('分析完成 - 关键词:', keywords);
        console.log('=== 分析结束 ===\n');

        // 返回结果
        res.json({
            success: true,
            readCount,
            commentCount,
            keywords,
            contentPreview: content.substring(0, 150) + '...'
        });
    } catch (err) {
        console.error('分析失败:', err.message);
        res.status(500).json({
            success: false,
            error: err.message || '分析失败，请稍后重试'
        });
    }
});

/**
 * 健康检查接口
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        config: {
            sonnetApiConfigured: !!SONNET_API_KEY,
            thirdPartyApiConfigured: !!THIRD_PARTY_API_KEY
        }
    });
});

/**
 * 首页路由
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------- 启动服务 ----------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n========================================');
    console.log(`🚀 服务已启动！`);
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log(`🔧 API端点: http://localhost:${PORT}/api/analyze`);
    console.log('========================================');
    console.log('\n配置状态:');
    console.log(`  - Sonnet API: ${SONNET_API_KEY ? '✅ 已配置' : '❌ 未配置（将使用简单提取）'}`);
    console.log(`  - 第三方API: ${THIRD_PARTY_API_KEY ? '✅ 已配置' : '⚠️  未配置（将使用模拟数据）'}`);
    console.log('\n💡 提示: 请在 .env 文件中配置API密钥\n');
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，正在关闭服务器...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n收到 SIGINT 信号，正在关闭服务器...');
    process.exit(0);
});

