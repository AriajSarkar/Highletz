# GitHub File Highlighter

A browser extension that highlights recently modified files in GitHub repositories to make it easier to identify recent changes.

## Features

- Highlights files based on their last modification time:
  - Today (green)
  - Yesterday (orange)
  - Recent (within last 3 days, blue)
- Works with GitHub's modern React-based UI and the classic UI
- Dark mode compatible
- Customizable settings

## Installation

### Chrome/Edge

1. Download the latest release from the [Releases page](https://github.com/yourusername/github-file-highlighter/releases)
2. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge
3. Enable "Developer mode" in the top right corner
4. Drag and drop the downloaded `.zip` file onto the page

### Firefox

1. Download the latest release from the [Releases page](https://github.com/yourusername/github-file-highlighter/releases)
2. Open `about:addons` in Firefox
3. Click the gear icon and select "Install Add-on From File..."
4. Select the downloaded `.xpi` file

## Development

This extension is built with TypeScript, Tailwind CSS, and Webpack.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [pnpm](https://pnpm.io/) (v6+)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/github-file-highlighter.git
cd github-file-highlighter

# Install dependencies
pnpm install

# Generate icons (optional)
pnpm generate-icons

# Start development mode
pnpm dev
```

### Building for production

```bash
# Build the extension
pnpm build

# Package the extension
pnpm package
```

### Mozilla Add-on Submission

For Mozilla Add-on reviewers and developers who need to build from source:
- See the [Mozilla Add-on Submission Info](amo-listing-info.md) for detailed build instructions

## License

MIT
