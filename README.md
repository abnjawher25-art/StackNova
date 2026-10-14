# 🚀 StackNova

**Learn Web Development. Build Real Projects. Level Up Your Skills.**

StackNova is an Arabic-first, interactive learning platform for aspiring web developers. Learn **HTML, CSS, and JavaScript** through short lessons, practical challenges, live previews, and hands-on projects.

🌐 **Live Website:** [stack-nova-abnjawher25-8299.vercel.app](https://stack-nova-abnjawher25-8299.vercel.app)  
📦 **GitHub Repository:** [abnjawher25-art/StackNova](https://github.com/abnjawher25-art/StackNova)

---

## ✨ Features

- 📚 **Guided Learning Paths** — Follow learning roadmaps for HTML, CSS, and JavaScript.
- 🎯 **Interactive Challenges** — Practice concepts through focused exercises.
- 💻 **Live Code Previews** — Experiment with code in sandboxed previews.
- 🛠️ **Hands-on Projects** — Reinforce learning by building small projects.
- 📊 **Progress Tracking** — Track completed lessons and your latest knowledge-check score.
- 🔎 **Project Gallery** — Explore projects with search and category filters.
- 📖 **Quick Reference** — Find coding examples and copy useful snippets.
- 🌍 **Arabic-First Interface** — A learning experience designed primarily for Arabic-speaking learners.

## 📚 Learning Tracks

### HTML — Structure the Web
- Headings and paragraphs
- Links and images
- Lists and page structure
- **Mini-project:** Personal Profile Page

### CSS — Design the Web
- Text, colors, and typography
- Backgrounds and borders
- The CSS Box Model
- Flexbox and responsive layouts
- **Mini-project:** Profile Card

### JavaScript — Bring Pages to Life
- Variables and programming fundamentals
- Conditional statements
- Functions
- DOM interaction
- **Mini-project:** Click Counter

## 🗺️ Platform Routes

| Route | Description |
| --- | --- |
| `/` | Homepage and learning-track navigation |
| `/learn/html/roadmap` | HTML learning roadmap |
| `/learn/css` | CSS learning roadmap |
| `/learn/javascript` | JavaScript learning roadmap |
| `/learn/html/progress` | Progress dashboard for completed lessons and quiz score |
| `/projects` | Searchable project gallery with category filters |
| `/projects/portfolio` | Capstone project combining HTML, CSS, and JavaScript |
| `/practice` | Ten-question knowledge check with explanations |
| `/reference` | Searchable coding reference with copyable examples |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **20.9 or newer**
- npm (included with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/abnjawher25-art/StackNova.git
   ```

2. Enter the project directory:

   ```bash
   cd StackNova
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Verify a Production Build

Run the following commands:

```bash
npm run check:routes
npm run build
npm start
```

For hosting instructions, see the [Deployment Guide](docs/DEPLOYMENT.md).

## 📈 Learning Progress and Data Storage

Lesson completion and the latest knowledge-check score are stored in the current browser using `localStorage`.

- Progress is saved locally in the browser being used.
- Progress is not synchronized across accounts or devices.
- Clearing the browser's site data can remove saved progress.

**Challenge note:** Interactive code previews run in sandboxed iframes. Lesson challenges use lightweight checks on submitted source code to look for required patterns. Passing a challenge does not guarantee that every possible implementation is correct.

## 🛠️ Tech Stack

- **Next.js 15** — Web application framework
- **React 19** — User interface
- **TypeScript** — Type-safe JavaScript development
- **CSS** — Styling and responsive layouts
- **GitHub Actions** — Automated build checks for pushes and pull requests
- **Vercel** — Hosting and deployment

## 👨‍💻 Development Guidelines

- Keep the interface Arabic-first and accessible.
- Keep lessons focused on small concepts with practical challenges.
- Use a feature branch and pull request when contributing.
- Run the quality checks and confirm they pass before merging changes.

## 🧪 Quality Checks

Before submitting changes, run:

```bash
npm run check:routes
npm run build
```

Also verify that the relevant pages, navigation links, and interactive features work as expected.

## 🌐 Deployment

StackNova is deployed on Vercel.

- **Live site:** [https://stack-nova-abnjawher25-8299.vercel.app](https://stack-nova-abnjawher25-8299.vercel.app)
- **Repository:** [https://github.com/abnjawher25-art/StackNova](https://github.com/abnjawher25-art/StackNova)
- **Deployment instructions:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

**StackNova — Your journey from learning code to building for the web starts here.** 🚀
