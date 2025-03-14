/**
 * 简单的HTTP服务器
 * 用于解决浏览器安全限制，无法通过file://协议直接加载本地JSON文件的问题
 * 
 * 使用方法：
 * 1. 确保已安装Node.js
 * 2. 在命令行中运行: node server.js
 * 3. 在浏览器中访问: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 配置
const PORT = 3000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 解析请求URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // 默认访问index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // 获取文件路径
    const filePath = path.join(__dirname, pathname);
    
    // 获取文件扩展名
    const extname = path.extname(filePath);
    
    // 获取MIME类型
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // 读取文件
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // 文件不存在
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`<h1>404 Not Found</h1><p>The requested URL ${pathname} was not found on this server.</p>`);
                return;
            }
            
            // 其他错误
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`<h1>500 Internal Server Error</h1><p>${err.message}</p>`);
            return;
        }
        
        // 设置响应头
        res.writeHead(200, { 'Content-Type': contentType });
        
        // 发送文件内容
        res.end(data);
    });
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`服务器已启动，访问 http://localhost:${PORT}`);
    console.log(`按 Ctrl+C 停止服务器`);
}); 