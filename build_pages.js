const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

const headerSplit = indexHtml.split('<main>');
const topHtml = headerSplit[0] + '<main>\n';
const footerSplit = indexHtml.split('</main>');
const bottomHtml = '\n</main>' + footerSplit[1];

function getSection(id) {
  const match = indexHtml.match(new RegExp(`<section[^>]*id="${id}"[^>]*>[\\s\\S]*?</section>`, 'i'));
  return match ? match[0] : '';
}
function getClassSection(cls) {
  const match = indexHtml.match(new RegExp(`<section[^>]*class="${cls}"[^>]*>[\\s\\S]*?</section>`, 'i'));
  return match ? match[0] : '';
}

const marginHeader = '<div style="height:120px; background:rgba(11, 37, 69, 0.9);"></div>';

const aboutHtml = topHtml + marginHeader + getClassSection('goal-section') + getSection('work') + getSection('why-choose-us') + bottomHtml;
fs.writeFileSync('about.html', aboutHtml
  .replace('<li><a href="index.html" style="color: var(--accent);">Home</a></li>', '<li><a href="index.html">Home</a></li>')
  .replace('<li><a href="about.html">About Us</a></li>', '<li><a href="about.html" style="color: var(--accent);">About Us</a></li>')
);

const servicesHtml = topHtml + marginHeader + getSection('services') + getSection('industries') + bottomHtml;
fs.writeFileSync('services.html', servicesHtml
  .replace('<li><a href="index.html" style="color: var(--accent);">Home</a></li>', '<li><a href="index.html">Home</a></li>')
  .replace('<li><a href="services.html">Services</a></li>', '<li><a href="services.html" style="color: var(--accent);">Services</a></li>')
);

const contactHtml = topHtml + marginHeader + getSection('contact') + bottomHtml;
fs.writeFileSync('contact.html', contactHtml
  .replace('<li><a href="index.html" style="color: var(--accent);">Home</a></li>', '<li><a href="index.html">Home</a></li>')
  .replace('<li><a href="contact.html">Contact Us</a></li>', '<li><a href="contact.html" style="color: var(--accent);">Contact Us</a></li>')
);

// Optional: clean up index.html to only have Home + Preview of Services + Industries
const newIndexHtml = topHtml + getSection('home') + marginHeader + getSection('services') + getSection('industries') + bottomHtml;
fs.writeFileSync('index.html', newIndexHtml);

console.log('Pages generated successfully!');
