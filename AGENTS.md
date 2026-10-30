<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- The `qrcode` package must only be imported dynamically (`await import("qrcode")`) inside browser-only functions in `src/lib/qr.ts` and via `src/components/qr/qr-canvas.tsx`. A static import pulls its Node build into the SSR (workerd) bundle and breaks the published app.
- All QR payload building/validation lives in `src/lib/qr-data.ts` as pure isomorphic functions; rendering and downloads live in `src/lib/qr.ts`. Keep the two separated.
- QR history is stored in `localStorage` (key `qrify:history:v1`) via `src/lib/qr-history.ts` — no backend for v1.
- Brand/design tokens (purple #6C4CEB + blue #4776E6, lavender background, Inter) are defined only in `src/styles.css`; components must not hardcode colors.
