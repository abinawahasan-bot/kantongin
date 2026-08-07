module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm start -- -p 4173",
      url: ["http://localhost:4173/", "http://localhost:4173/blog"],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "lhci-report",
    },
  },
};
