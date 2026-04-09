// 测试文件 - 包含多种漏洞用于演示
const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const app = express();

// 漏洞1: SQL注入
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  connection.query(query, (err, result) => {
    res.json(result);
  });
});

// 漏洞2: XSS - dangerouslySetInnerHTML 模拟
app.get('/profile', (req, res) => {
  const name = req.query.name;
  res.send('<div>' + name + '</div>');
});

// 漏洞3: JWT 不验证
app.post('/login', (req, res) => {
  const token = jwt.sign({ role: 'user' }, 'secret123');
  res.json({ token });
});

// 漏洞4: 水平越权 IDOR
app.get('/invoice/:id', (req, res) => {
  const invoice = db.query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
  res.json(invoice);
});

// 漏洞5: 垂直越权 - 角色从请求体获取
app.post('/promote', (req, res) => {
  const userId = req.body.user_id;
  const newRole = req.body.role;
  User.update({ id: userId, role: newRole });
  res.json({ success: true });
});

// 漏洞6: 命令注入
app.get('/ping', (req, res) => {
  const host = req.query.host;
  exec('ping -c 3 ' + host, (err, stdout) => {
    res.send(stdout);
  });
});

// 漏洞7: 路径穿越
app.get('/download', (req, res) => {
  const file = req.query.file;
  res.sendFile('/var/www/uploads/' + file);
});

// 漏洞8: 敏感信息硬编码
const API_KEY = 'sk_live_1234567890abcdef';
const DB_PASSWORD = 'admin123';

// 漏洞9: CORS 错误配置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// 漏洞10: SSRF
app.get('/fetch', async (req, res) => {
  const url = req.query.url;
  const response = await axios.get(url);
  res.json(response.data);
});
