
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware de debug para registrar todas las peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.get('host')}${req.originalUrl}`);
  next();
});

app.set('trust proxy', true);

// Verificar existencia de public/index.html al iniciar
function checkPath(pathName, description) {
  const fullPath = path.join(__dirname, pathName);
  const indexPath = path.join(fullPath, 'index.html');
  console.log(`🔍 Checking ${description}:`);
  console.log(`   Path: ${fullPath}`);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ Directory exists`);
    if (fs.existsSync(indexPath)) {
      console.log(`   ✅ index.html exists`);
      const stats = fs.statSync(indexPath);
      console.log(`   📊 Size: ${stats.size} bytes`);
    } else {
      console.log(`   ❌ index.html missing`);
    }
    try {
      const files = fs.readdirSync(fullPath);
      console.log(`   📂 Contents: ${files.join(', ')}`);
    } catch (err) {
      console.log(`   ❌ Cannot read directory: ${err.message}`);
    }
  } else {
    console.log(`   ❌ Directory does not exist`);
  }
}

console.log(`🔍 Verifying public path...`);
checkPath('public', 'Principal site');
console.log(`✅ Path verification complete\n`);

// Servir archivos estáticos de public/
app.use(express.static(path.join(__dirname, 'public')));
// Servir archivos estáticos desde la raíz (para el logo)
app.use(express.static(__dirname));

// Catch-all para servir index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.log(`❌ Principal index.html error:`, err.message);
      res.status(404).send('<h1>Principal site - index.html not found</h1>');
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📂 Serving: lonjas.site -> public/`);
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');  
  process.exit(0);
});