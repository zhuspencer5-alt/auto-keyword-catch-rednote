// Cloudflare Pages Functions 格式的后端接口
// 对应路由: /api/analyze

/**
 * 解析链接内容
 */
async function parseUrlContent(url, env) {
    let content = '';
    let readCount = 0;
    let commentCount = 0;

    try {
        const THIRD_PARTY_API_KEY = env.THIRD_PARTY_API_KEY;
        
        if (url.includes('xiaohongshu.com') || url.includes('xhslink.com')) {
            // 判断是否配置了真实的API密钥（排除占位符）
            const hasRealApiKey = THIRD_PARTY_API_KEY && 
                                  !THIRD_PARTY_API_KEY.includes('your_') && 
                                  !THIRD_PARTY_API_KEY.includes('here') &&
                                  THIRD_PARTY_API_KEY.length > 10;
            
            if (hasRealApiKey) {
                // TODO: 替换为实际的第三方API调用
                throw new Error('请在代码中实现真实的小红书API调用逻辑');
            } else {
                // 未配置真实API密钥时，使用模拟数据作为演示
                console.warn('未配置第三方API密钥，使用模拟数据');
                content = "这是一篇关于小红书内容营销的文章。文章详细介绍了如何通过优质内容吸引用户关注，提升品牌影响力。文章提到了内容创作的技巧、用户互动的重要性以及数据分析的方法。";
                readCount = Math.floor(Math.random() * 10000) + 1000;
                commentCount = Math.floor(Math.random() * 500) + 50;
            }
        } else if (url.includes('mp.weixin.qq.com')) {
            // 判断是否配置了真实的API密钥（排除占位符）
            const hasRealApiKey = THIRD_PARTY_API_KEY && 
                                  !THIRD_PARTY_API_KEY.includes('your_') && 
                                  !THIRD_PARTY_API_KEY.includes('here') &&
                                  THIRD_PARTY_API_KEY.length > 10;
            
            if (hasRealApiKey) {
                // TODO: 替换为实际的第三方API调用
                throw new Error('请在代码中实现真实的公众号API调用逻辑');
            } else {
                // 未配置真实API密钥时，使用模拟数据作为演示
                console.warn('未配置第三方API密钥，使用模拟数据');
                content = "这是一篇公众号文章，讨论了微信营销的最佳实践。文章分析了公众号运营的核心要素，包括内容定位、粉丝互动、推送时机等。作者分享了多个成功案例和实用技巧。";
                readCount = Math.floor(Math.random() * 50000) + 5000;
                commentCount = Math.floor(Math.random() * 1000) + 100;
            }
        } else {
            throw new Error('不支持的链接类型，请提供小红书或公众号链接');
        }

        return { content, readCount, commentCount };
    } catch (error) {
        throw error;
    }
}

/**
 * 使用 Sonnet API 提取关键词
 */
async function extractKeywordsWithSonnet(content, env) {
    const SONNET_API_KEY = env.SONNET_API_KEY;
    const SONNET_API_ENDPOINT = env.SONNET_API_ENDPOINT || 'https://api.anthropic.com/v1/messages';

    // 判断是否配置了真实的API密钥
    const hasRealApiKey = SONNET_API_KEY && 
                          !SONNET_API_KEY.includes('your_') && 
                          !SONNET_API_KEY.includes('here') &&
                          SONNET_API_KEY.length > 10;

    if (!hasRealApiKey) {
        console.warn('未配置 Sonnet API，使用简单关键词提取');
        return extractKeywordsSimple(content);
    }

    try {
        const response = await fetch(SONNET_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': SONNET_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                messages: [{
                    role: 'user',
                    content: `请从以下文本中提取3-5个最重要的关键词，只返回关键词，用逗号分隔，不要其他解释：\n\n${content}`
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Sonnet API 调用失败: ${response.status}`);
        }

        const data = await response.json();
        const keywords = data.content[0].text.trim();
        return keywords;
    } catch (error) {
        console.error('Sonnet API 调用失败:', error.message);
        return extractKeywordsSimple(content);
    }
}

/**
 * 简单的关键词提取（备用方案）
 */
function extractKeywordsSimple(content) {
    const stopWords = ['的', '了', '是', '在', '和', '与', '等', '这', '那', '有', '为', '以', '及', '等等'];
    const words = content.match(/[\u4e00-\u9fa5]{2,}/g) || [];
    const wordFreq = {};

    words.forEach(word => {
        if (!stopWords.includes(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });

    const sortedWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);

    return sortedWords.join(', ');
}

/**
 * Cloudflare Pages Functions 导出处理函数
 */
export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return new Response(JSON.stringify({ error: '请提供URL' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 解析链接内容
        const { content, readCount, commentCount } = await parseUrlContent(url, env);

        // 提取关键词
        const keywords = await extractKeywordsWithSonnet(content, env);

        // 返回结果
        return new Response(JSON.stringify({
            success: true,
            data: {
                url,
                readCount,
                commentCount,
                keywords,
                contentPreview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('分析失败:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

