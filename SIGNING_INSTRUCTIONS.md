Code Signing Instructions (Windows)

To sign the NSIS installer and portable EXE you need a code signing certificate (PFX).

Local signing (electron-builder):

1. Place your PFX file somewhere secure, e.g. `~/.certs/gvet.pfx`.
2. Run:

```powershell
setx CSC_LINK "file://C:\Users\<user>\.certs\gvet.pfx"
setx CSC_KEY_PASSWORD "<pfx-password>"
npm run electron-build-win
```

GitHub Actions signing:

- Add two repository secrets:
  - `CSC_LINK` — a URL to the PFX (or base64-encoded PFX), or use `actions/upload-artifact` to transfer to runner.
  - `CSC_KEY_PASSWORD` — the PFX password.
- electron-builder will automatically pick up `CSC_LINK` and `CSC_KEY_PASSWORD` when building.

If you don't have a certificate yet, obtain one from a trusted CA such as DigiCert, Sectigo, or GlobalSign.
