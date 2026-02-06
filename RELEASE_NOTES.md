G-VET System Desktop Release - v2.0.0

Artifacts (built on developer machine):

- Installer: dist/G-VET System Setup 2.0.0.exe
- Portable: dist/G-VET-System-2.0.0-portable.exe
- Unpacked executable: dist/win-unpacked/G-VET System.exe
- ZIP of artifacts: dist/G-VET-System-2.0.0-artifacts.zip (created by `npm run package-artifacts`)

Smoke-test summary:

- The Electron app launches and the bundled Node server starts.
- The server requires a reachable MySQL instance. Ensure `.env` DB settings point to a running MySQL (localhost or Docker container).
- Intermittent failures observed when the app attempted to connect to `database` or misspelled `localhostt`.

Usage:

1. Run portable (no install):
   - Double-click `dist/G-VET-System-2.0.0-portable.exe`
2. Run installer:
   - Run `dist/G-VET System Setup 2.0.0.exe` to install on Windows (creates shortcuts).

CI / Release:

- A GitHub Actions workflow is included at `.github/workflows/release.yml` to build and upload artifacts on push to `main`.

Signing:

- To code-sign the installer, provide a Windows code signing certificate (PFX) and set `CSC_LINK` and `CSC_KEY_PASSWORD` secrets in GitHub Actions or configure `certificateFile` in `package.json` when building locally.

Next steps:

- Provide a code-signing certificate to enable signed installers.
- Decide whether to publish artifacts to GitHub Releases or an internal file server.

Signed-off-by: G-VET Build Bot
