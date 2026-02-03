const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const fs = require("fs");
const path = require("path");

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Convert markdown to HTML
function markdownToHtml(markdown) {
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>');
}

// Get individual newsletter page template
function getNewsletterTemplate() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{DESCRIPTION}}">
    <title>{{TITLE}} | Wise Bridge Global Partners</title>

    <link rel="icon" type="image/jpeg" href="../images/logo.jpeg">
    <link rel="apple-touch-icon" href="../images/logo.jpeg">
    <link rel="stylesheet" href="../css/style.css?v=10">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <style>
        .newsletter-header {
            padding: 140px 0 60px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: white;
        }
        .newsletter-header h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            line-height: 1.3;
        }
        .newsletter-meta {
            display: flex;
            gap: 20px;
            color: rgba(255,255,255,0.7);
            font-size: 0.95rem;
            flex-wrap: wrap;
        }
        .newsletter-content {
            padding: 60px 0;
            max-width: 800px;
            margin: 0 auto;
        }
        .newsletter-content p {
            line-height: 1.9;
            margin-bottom: 1.5rem;
            color: #444;
            font-size: 1.1rem;
        }
        .newsletter-content h2, .newsletter-content h3 {
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            color: #1a1a2e;
        }
        .newsletter-cover {
            width: 100%;
            max-height: 450px;
            object-fit: cover;
            border-radius: 12px;
            margin-bottom: 40px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
            color: var(--gold-accent, #d4af37);
            text-decoration: none;
            font-weight: 500;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-container">
                <a href="../index.html" class="logo">Wise Bridge Global Partners</a>
                <nav class="nav" id="nav">
                    <a href="../index.html" class="nav-link">Home</a>
                    <a href="../about.html" class="nav-link">About Us</a>
                    <a href="../services.html" class="nav-link">Services</a>
                    <a href="../careers.html" class="nav-link">Careers</a>
                    <a href="../newsletters.html" class="nav-link active">Newsletters</a>
                    <a href="../contact.html" class="nav-link">Contact</a>
                </nav>
                <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle mobile menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Newsletter Header -->
    <section class="newsletter-header">
        <div class="container">
            <a href="../newsletters.html" class="back-link">← Back to Newsletters</a>
            <h1>{{TITLE}}</h1>
            <div class="newsletter-meta">
                <span>{{DATE}}</span>
                <span>By {{AUTHOR}}</span>
            </div>
        </div>
    </section>

    <!-- Newsletter Content -->
    <section class="newsletter-content">
        <div class="container">
            {{COVER_IMAGE}}
            <p>{{CONTENT}}</p>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>Wise Bridge Global Partners</h4>
                    <p>Premier financial consulting and advisory services delivered with Italian elegance and precision.</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul class="footer-links">
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="../about.html">About Us</a></li>
                        <li><a href="../services.html">Services</a></li>
                        <li><a href="../newsletters.html">Newsletters</a></li>
                        <li><a href="../contact.html">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Wise Bridge Global Partners. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../js/main.js"></script>
</body>
</html>`;
}

// Fetch all published blogs
async function fetchBlogs() {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });
    return response.results;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

// Get property value helper
function getPropertyValue(page, propertyName) {
  const property = page.properties[propertyName];
  if (!property) return "";

  switch (property.type) {
    case "title":
      return property.title[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text[0]?.plain_text || "";
    case "date":
      return property.date?.start || "";
    case "checkbox":
      return property.checkbox;
    case "url":
      return property.url || "";
    case "files":
      return property.files[0]?.file?.url || property.files[0]?.external?.url || "";
    default:
      return "";
  }
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate individual newsletter page
async function generateNewsletterPage(page) {
  const title = getPropertyValue(page, "Title") || getPropertyValue(page, "Name");
  const slug = getPropertyValue(page, "slug") || getPropertyValue(page, "Slug");
  const description = getPropertyValue(page, "Description");
  const date = getPropertyValue(page, "Date");
  const author = getPropertyValue(page, "Author") || "Wise Bridge Team";
  const coverImage = getPropertyValue(page, "Cover image") || getPropertyValue(page, "Cover Image");

  if (!slug) {
    console.log(`Skipping page without slug: ${title}`);
    return null;
  }

  // Fetch page content
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  const content = markdownToHtml(mdString.parent || "");

  // Generate HTML
  let html = getNewsletterTemplate();
  html = html.replace(/\{\{TITLE\}\}/g, title);
  html = html.replace(/\{\{DESCRIPTION\}\}/g, description || title);
  html = html.replace(/\{\{DATE\}\}/g, formatDate(date));
  html = html.replace(/\{\{AUTHOR\}\}/g, author);
  html = html.replace(/\{\{CONTENT\}\}/g, content);
  html = html.replace(
    /\{\{COVER_IMAGE\}\}/g,
    coverImage ? `<img src="${coverImage}" alt="${title}" class="newsletter-cover">` : ""
  );

  // Write to file
  const filePath = path.join(__dirname, "..", "newsletters", `${slug}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`Generated: newsletters/${slug}.html`);

  return { title, slug, description, date, author, coverImage };
}

// Generate newsletter card HTML
function generateNewsletterCard(newsletter) {
  const coverStyle = newsletter.coverImage
    ? `background: url('${newsletter.coverImage}') center/cover;`
    : `background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);`;

  return `
                    <article class="card">
                        <div style="height: 200px; ${coverStyle} border-radius: 4px 4px 0 0; margin: -1.5rem -1.5rem 1.5rem;"></div>
                        <span style="color: var(--gold-accent); font-size: 0.875rem;">NEWSLETTER</span>
                        <h3 style="margin: 0.5rem 0;">${newsletter.title}</h3>
                        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">${formatDate(newsletter.date)}</p>
                        <p>${newsletter.description || ""}</p>
                        <a href="newsletters/${newsletter.slug}.html" class="btn btn-outline" style="margin-top: 1rem; display: inline-block;">Read More →</a>
                    </article>`;
}

// Update newsletters.html with dynamic content
function updateNewslettersPage(newsletters) {
  const newslettersPath = path.join(__dirname, "..", "newsletters.html");
  let html = fs.readFileSync(newslettersPath, "utf-8");

  // Generate newsletter cards
  const cardsHtml = newsletters.length > 0
    ? newsletters.map(generateNewsletterCard).join("\n")
    : `<div class="text-center" style="grid-column: 1/-1; padding: 3rem;">
         <p style="color: var(--text-secondary);">No newsletters published yet. Check back soon!</p>
       </div>`;

  // Find and replace the grid content
  // Match from "Latest Publications" grid start to end
  const gridRegex = /(<div class="grid grid-3 mt-5">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>\s*<!-- Newsletter Categories -->)/;

  if (gridRegex.test(html)) {
    html = html.replace(gridRegex, `$1\n${cardsHtml}\n                $3`);
    fs.writeFileSync(newslettersPath, html);
    console.log("Updated: newsletters.html");
  } else {
    console.log("Warning: Could not find grid section in newsletters.html");
  }
}

// Main function
async function main() {
  console.log("Fetching newsletters from Notion...");

  // Ensure newsletters directory exists
  const newslettersDir = path.join(__dirname, "..", "newsletters");
  if (!fs.existsSync(newslettersDir)) {
    fs.mkdirSync(newslettersDir, { recursive: true });
  }

  // Fetch and generate newsletters
  const pages = await fetchBlogs();
  console.log(`Found ${pages.length} published newsletters`);

  const newsletters = [];
  for (const page of pages) {
    const newsletter = await generateNewsletterPage(page);
    if (newsletter) {
      newsletters.push(newsletter);
    }
  }

  // Update newsletters listing page
  updateNewslettersPage(newsletters);

  console.log("Done!");
}

main();
