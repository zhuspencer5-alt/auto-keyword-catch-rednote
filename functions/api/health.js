// 健康检查接口
export async function onRequestGet() {
    return new Response(JSON.stringify({ 
        status: 'ok', 
        message: '服务运行正常',
        timestamp: new Date().toISOString()
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

