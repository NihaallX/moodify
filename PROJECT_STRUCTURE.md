# Moodify Project Structure

## 📁 Core Application
- `src/` - React application source code
- `public/` - Static assets and landing page
- `package.json` - Main project dependencies
- `README.md` - Project documentation

## 🤖 AI Integration
- `gradio_app/` - Hugging Face Space applications (different AI model versions)
- **Live AI API**: https://huggingface.co/spaces/Leofrmamzn/moodify-mood-detection

## 📚 Documentation & Research
- `docs/` - Setup guides and documentation
- `Moodify_Research_Paper.md` - Academic research paper
- `paper_figures/` - Research paper figures

## 🚀 Deployment
- `build/` - Production build for GitHub Pages
- **Live App**: https://nihaallx.github.io/moodify/

## 🛠️ Development
- `.vscode/` - VS Code configuration
- `.github/` - GitHub Actions workflows
- `node_modules/` - React dependencies (auto-generated)

## How It Works
1. **Frontend**: React app with emoji slider + AI chat interface
2. **AI Backend**: Hartmann emotion classification model on Hugging Face Spaces
3. **Integration**: Frontend calls Hugging Face API for mood detection
4. **Output**: Mood-based Spotify playlist recommendations
