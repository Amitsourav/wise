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
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n/gim, '<br>')
    // Paragraphs
    .replace(/<br><br>/gim, '</p><p>')
    // Wrap in paragraph
    .replace(/^(.+)$/gim, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/gim, '')
    .replace(/<p><br><\/p>/gim, '')
    .replace(/<p><h/gim, '<h')
    .replace(/<\/h(\d)><\/p>/gim, '</h$1>');
}

// Get blog template
function getBlogTemplate() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{DESCRIPTION}}">
    <title>{{TITLE}} | Wise Bridge Global Partners Blog</title>

    <link rel="icon" type="image/jpeg" href="../images/logo.jpeg">
    <link rel="apple-touch-icon" href="../images/logo.jpeg">
    <link rel="stylesheet" href="../css/style.css?v=10">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <style>
        .blog-header {
            padding: 120px 0 60px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: white;
        }
        .blog-header h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        .blog-meta {
            display: flex;
            gap: 20px;
            color: rgba(255,255,255,0.7);
            font-size: 0.95rem;
        }
        .blog-content {
            padding: 60px 0;
            max-width: 800px;
            margin: 0 auto;
        }
        .blog-content p {
            line-height: 1.8;
            margin-bottom: 1.5rem;
            color: #444;
        }
        .blog-content h2 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #1a1a2e;
        }
        .blog-cover {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: #d4af37;
            text-decoration: none;
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
                <a href="../index.html" class="logo">
                    <img src="../images/logo.jpeg" alt="Wise Bridge Global Partners" style="height: 45px; width: auto; object-fit: contain;">
                </a>
                <nav class="nav" id="nav">
                    <a href="../index.html" class="nav-link">Home</a>
                    <a href="../about.html" class="nav-link">About</a>
                    <a href="../services.html" class="nav-link">Services</a>
                    <a href="../blogs.html" class="nav-link active">Blog</a>
                    <a href="../contact.html" class="nav-link">Contact</a>
                </nav>
                <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Blog Header -->
    <section class="blog-header">
        <div class="container">
            <a href="../blogs.html" class="back-link">&larr; Back to Blog</a>
            <h1>{{TITLE}}</h1>
            <div class="blog-meta">
                <span>{{DATE}}</span>
                <span>By {{AUTHOR}}</span>
            </div>
        </div>
    </section>

    <!-- Blog Content -->
    <section class="blog-content">
        <div class="container">
            {{COVER_IMAGE}}
            {{CONTENT}}
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Wise Bridge Global Partners</h3>
                    <p>Premier financial consulting with Italian elegance and trust.</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <a href="../about.html">About Us</a>
                    <a href="../services.html">Services</a>
                    <a href="../blogs.html">Blog</a>
                    <a href="../contact.html">Contact</a>
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

// Get blogs listing template
function getBlogsListingTemplate(blogCards) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Wise Bridge Global Partners Blog - Financial insights, market analysis, and expert advice">
    <title>Blog | Wise Bridge Global Partners</title>

    <link rel="icon" type="image/jpeg" href="images/logo.jpeg">
    <link rel="apple-touch-icon" href="images/logo.jpeg">
    <link rel="stylesheet" href="css/style.css?v=10">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <style>
        .blogs-header {
            padding: 120px 0 60px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: white;
            text-align: center;
        }
        .blogs-header h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        .blogs-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 30px;
            padding: 60px 0;
        }
        .blog-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .blog-card:hover {
            transform: translateY(-5px);
        }
        .blog-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .blog-card-content {
            padding: 25px;
        }
        .blog-card h3 {
            margin-bottom: 10px;
            color: #1a1a2e;
        }
        .blog-card p {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.6;
        }
        .blog-card-meta {
            display: flex;
            justify-content: space-between;
            color: #999;
            font-size: 0.85rem;
        }
        .blog-card a {
            text-decoration: none;
            color: inherit;
        }
        .no-blogs {
            text-align: center;
            padding: 60px;
            color: #666;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-container">
                <a href="index.html" class="logo">
                    <img src="images/logo.jpeg" alt="Wise Bridge Global Partners" style="height: 45px; width: auto; object-fit: contain;">
                </a>
                <nav class="nav" id="nav">
                    <a href="index.html" class="nav-link">Home</a>
                    <a href="about.html" class="nav-link">About</a>
                    <a href="services.html" class="nav-link">Services</a>
                    <a href="blogs.html" class="nav-link active">Blog</a>
                    <a href="contact.html" class="nav-link">Contact</a>
                </nav>
                <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Blogs Header -->
    <section class="blogs-header">
        <div class="container">
            <h1>Our Blog</h1>
            <p>Financial insights, market analysis, and expert advice</p>
        </div>
    </section>

    <!-- Blogs Grid -->
    <section class="blogs-section">
        <div class="container">
            ${blogCards.length > 0 ? `<div class="blogs-grid">${blogCards}</div>` : '<div class="no-blogs"><p>No blog posts yet. Check back soon!</p></div>'}
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Wise Bridge Global Partners</h3>
                    <p>Premier financial consulting with Italian elegance and trust.</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <a href="about.html">About Us</a>
                    <a href="services.html">Services</a>
                    <a href="blogs.html">Blog</a>
                    <a href="contact.html">Contact</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Wise Bridge Global Partners. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="js/main.js"></script>
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

// Generate blog page
async function generateBlogPage(page) {
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
  let html = getBlogTemplate();
  html = html.replace(/\{\{TITLE\}\}/g, title);
  html = html.replace(/\{\{DESCRIPTION\}\}/g, description);
  html = html.replace(/\{\{DATE\}\}/g, formatDate(date));
  html = html.replace(/\{\{AUTHOR\}\}/g, author);
  html = html.replace(/\{\{CONTENT\}\}/g, content);
  html = html.replace(
    /\{\{COVER_IMAGE\}\}/g,
    coverImage ? `<img src="${coverImage}" alt="${title}" class="blog-cover">` : ""
  );

  // Write to file
  const filePath = path.join(__dirname, "..", "blogs", `${slug}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`Generated: blogs/${slug}.html`);

  return {
    title,
    slug,
    description,
    date,
    author,
    coverImage,
  };
}

// Generate blog card HTML
function generateBlogCard(blog) {
  return `
    <article class="blog-card">
        <a href="blogs/${blog.slug}.html">
            ${blog.coverImage ? `<img src="${blog.coverImage}" alt="${blog.title}">` : '<div style="height:200px;background:#f0f0f0;"></div>'}
            <div class="blog-card-content">
                <h3>${blog.title}</h3>
                <p>${blog.description || ""}</p>
                <div class="blog-card-meta">
                    <span>${formatDate(blog.date)}</span>
                    <span>${blog.author}</span>
                </div>
            </div>
        </a>
    </article>`;
}

// Main function
async function main() {
  console.log("Fetching blogs from Notion...");

  // Ensure blogs directory exists
  const blogsDir = path.join(__dirname, "..", "blogs");
  if (!fs.existsSync(blogsDir)) {
    fs.mkdirSync(blogsDir, { recursive: true });
  }

  // Fetch and generate blogs
  const pages = await fetchBlogs();
  console.log(`Found ${pages.length} published blogs`);

  const blogs = [];
  for (const page of pages) {
    const blog = await generateBlogPage(page);
    if (blog) {
      blogs.push(blog);
    }
  }

  // Generate blogs listing page
  const blogCards = blogs.map(generateBlogCard).join("");
  const listingHtml = getBlogsListingTemplate(blogCards);
  const listingPath = path.join(__dirname, "..", "blogs.html");
  fs.writeFileSync(listingPath, listingHtml);
  console.log("Generated: blogs.html");

  console.log("Done!");
}

main();
