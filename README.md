# StackNova

StackNova is an Arabic-first, interactive learning platform for aspiring web developers. Learn HTML, CSS, and JavaScript through short lessons, challenges, live previews, and small projects.

## Getting started

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

To verify a production build:

```bash
npm run check:routes
npm run build
npm start
```

See [the deployment guide](docs/DEPLOYMENT.md) for step-by-step hosting instructions.

## Learning tracks

- **HTML** — headings and paragraphs, links and images, lists, and a profile-page mini-project.
- **CSS** — text and colors, backgrounds and borders, the box model, Flexbox, responsive layouts, and a profile-card mini-project.
- **JavaScript** — variables, conditions, functions, DOM interaction, and a click-counter project.

## Practice and projects

| Route | Description |
| --- | --- |
| `/` | Homepage and learning-track navigation |
| `/learn/html/roadmap` | HTML roadmap |
| `/learn/css` | CSS roadmap |
| `/learn/javascript` | JavaScript roadmap |
| `/learn/html/progress` | Progress dashboard for completed lessons and quiz score |
| `/projects` | Searchable project gallery with category filters |
| `/projects/portfolio` | Capstone combining HTML, CSS, and JavaScript |
| `/practice` | Ten-question knowledge check with explanations |
| `/reference` | Searchable quick reference with copyable code examples |

## How learning progress works

Lesson completion and the latest knowledge-check score are stored in the current browser using `localStorage`. Progress is local to that browser and is not synced to an account or across devices. Clearing browser storage removes the saved progress.

Interactive code previews run in sandboxed iframes. The lesson challenges use lightweight checks on the submitted source, so passing a challenge confirms that required patterns are present; it is not a complete evaluation of every possible implementation.

## Tech stack

- Next.js 15
- React 19
- TypeScript
- CSS
- GitHub Actions for pull-request and push build checks

## Development notes

- The interface is Arabic-first.
- Keep each new lesson focused on a small concept and an applied challenge.
- Use a feature branch and pull request for changes; wait for the production build workflow to pass before merging.

https://stack-nova-abnjawher25-8299.vercel.app
