const fs      = require('fs');
const path    = require('path');
const cheerio = require('cheerio');

// load template
const tpl = fs.readFileSync(path.join(__dirname, 'page-template.html'), 'utf8');
// load & parse homepage
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const $ = cheerio.load(indexHtml);

// collect every href under #timeline (or change selector to grab any section)
const links = new Set();
$('#timeline a[href^="./pages/"]').each((_, el) => {
  // e.g. "./pages/pennsylvania-ave.html" → "pennsylvania-ave.html"
  links.add($(el).attr('href').replace('./pages/', ''));
});

// ensure output dir
const outDir = path.join(__dirname, '..', 'pages');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// generate each page
links.forEach(fileName => {
  const slug  = fileName.replace(/\.html$/, '');
  // grab the link text from index.html for the title
  const title = $(`#timeline a[href$="${fileName}"]`).text().trim() || slug;
  // render
  const html = tpl
    .replace(/{{title}}/g, title)
    .replace(/{{slug}}/g, slug);
  fs.writeFileSync(path.join(outDir, fileName), html);
  console.log('Generated', fileName);
});