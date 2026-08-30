# QCObjects UI Kit — Playground

Lab app: a reusable QCObjects **component kit** plus an interactive playground
that renders each widget and live-dumps its component tree from the shadow
roots. Built on the verified 2.4-line recipe
(`qcobjects@2.4.99` + `qcobjects-sdk@2.4.66`) with esbuild ESM bundling —
every widget was verified in headless Chromium (see "Verification").

## Run

```bash
npm install
npm run build        # copies src + templates into browser/, bundles JS with esbuild
npm start            # build + serve browser/ on :8080
```

The playground is at `http://localhost:8080/`. Use the **Logger** toggle to turn
on `window.logger.debugEnabled` (default `false`) and watch the framework trace
in the console; **Re-dump** re-inspects every widget tree.

## The widgets

| Widget | Pattern demonstrated |
|--------|---------------------|
| `kit-card` | External `.tpl.html` template + **class `data`** bound with `{{...}}`; class resolved via `componentClass` |
| `kit-counter` | **Interactivity through shadow DOM** — delegated clicks, no re-render |
| `kit-tabset` | **Base `Component`**, `tplsource="default"` (no `componentClass` needed) |
| `kit-panel` | **Nested components** — its template contains `<quick-component>`s built recursively by `__buildSubComponents__`; values passed via `data-*` attributes |

Each `.tpl.html` carries its own scoped `<style>` because template content
renders into a **native shadow root** (page CSS cannot reach it).

## Structure

```
src/
  index.html                  # playground page + scoped styles
  js/
    init.js                   # ESM entry: imports, RegisterWidgets(...), CONFIG
    components/
      card.js counter.js statchip.js tabset.js panel.js   # one class each
    playground.js             # inspector: tree dump + logger toggle + delegated clicks
  templates/components/
    card.tpl.html counter.tpl.html statchip.tpl.html tabset.tpl.html panel.tpl.html
```

## Key mechanics (verified)

- Smart widget (`<kit-card>`) → generic component (`<quick-component>`) → XHR
  `templates/components/<name>.tpl.html` → rendered into `.shadowHost`'s shadow
  root. `parseTemplate`/`DefaultTemplateHandler` substitute `{{data-key}}`
  placeholders for keys present in `data` (QCObjects.js:2952-2978).
- **Class resolution** needs one namespace per component:
  `Package("com.qcobjects.components.card", [Card])` with
  `componentClass="com.qcobjects.components.card.Card"`. Registering several
  classes in one namespace makes `ClassFactory` resolve them all to the **last**
  registered class, because its fallback predicate matches *any* named function
  (QCObjects.js:1141-1146).
- **Nested components + data**: the base constructor merges a component
  element's `data-*` attributes into `data` (QCObjects.js:2220-2221), so a
  nested `<quick-component ... data-stat="14">` gets `{stat: "14"}`. **Do not**
  declare a `data` field on a class that wants attr-provided values — the field
  initializes after `super()` and clobbers the merged attributes.
- **Events from shadow roots retarget**: a `document` listener receives
  `event.target` as the *host*, not the button. Use `event.composedPath()[0]`
  to get the real target (see `playground.js`).

## Verification

Headless Chromium + CDP probes asserted:

- All four widgets reach `loaded="true"` with populated shadow roots; zero
  `Runtime.exceptionThrown`; zero network failures.
- Bindings render: card `{{title}}` → "The Card component", counter `{{count}}`
  → `7`, panel `{{bearer}}` → "QCObjects Labs".
- Nested chips render their attribute data: `14 smart widgets`,
  `42 templates served`.
- Interactions: counter `7→9 (after +2) →8 (after −1)`; tabset switches active
  panel/data.

## Lab provenance

Archived from the QCObjects discovery labs into `QCObjects-Labs`. Findings and
verification tooling live in [`labs-docs`](https://github.com/QCObjects-Labs/labs-docs);
the condensed recipe is the
[`qcobjects-scaffolding`](https://github.com/qcobjects-skills/scaffolding)
skill. Blocks were tracked upstream in
[`QuickCorp/QCObjects#120`](https://github.com/QuickCorp/QCObjects/issues/120).