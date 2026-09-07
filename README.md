# Zeshan Desk

Customer support and engagement: shared inboxes across live chat, email, social
and messaging channels, contacts, help centre, canned responses, automations,
reports and an AI assistant.

## Architecture

| Layer | Technology |
|---|---|
| Backend | Ruby on Rails (Ruby 3.4) |
| Dashboard | Vue 3 + Vite |
| Embeddable widget | separate Vite bundle (`app/javascript/widget`) |
| Website SDK | `app/javascript/sdk` |
| Database | PostgreSQL with `pgvector` |
| Cache, queues, realtime | Redis + Sidekiq + ActionCable |

`enterprise/` holds features under a separate commercial licence — see
[UPSTREAM.md](./UPSTREAM.md).

## Local setup

```sh
cp .env.example .env
bundle install
pnpm install
bundle exec rails db:setup
foreman start -f Procfile.dev
```

Or with containers:

```sh
docker compose up -d
```

See [OPERATIONS.md](./OPERATIONS.md) for environment variables, ports and
deployment requirements.

## Branding

This product has a **first-class white-label surface**, so most branding is
configuration rather than code. The values in `config/installation_config.yml`
seed the database on first run and remain editable at runtime from
Super Admin → Settings.

| Key | Set to |
|---|---|
| `INSTALLATION_NAME` | `Zeshan Desk` — used in the dashboard, page titles and, via the `useBranding` composable, substituted into any remaining upstream product text |
| `BRAND_NAME` | `Zeshan Desk` — used in emails and the widget |
| `LOGO`, `LOGO_DARK`, `LOGO_THUMBNAIL` | replaced in `public/brand-assets/` |
| `BRAND_URL`, `WIDGET_BRAND_URL` | the "Powered By" target in emails and the widget |
| `TERMS_URL`, `PRIVACY_URL` | **point these at documents you publish** — the sign-up page asks users to accept them |
| `DISPLAY_MANIFEST` | `false` — upstream default is `true`, which shows upstream favicons and in-app upgrade prompts |

Code-level changes:

| Surface | Where |
|---|---|
| Dashboard accent ramp | `theme/colors.js` — the `woot` ramp now derives from Radix **indigo** instead of blue |
| Newer design-system accent | `app/javascript/dashboard/assets/scss/_next-colors.scss` — the 12-step `--blue-*` ramp retinted, light and dark |
| Default widget / label / portal colour | `#1f93ff` → `#6366f1` in the models, `db/schema.rb` and the initial migration, kept in sync |
| Inline logo fallback | `app/javascript/dashboard/components-next/icon/Logo.vue` |
| Favicons, PWA and Android icons | `public/` — the two apple-touch icons were **0-byte files upstream** and are now real images |
| Unread-badge favicons | regenerated, keeping the unread dot affordance |

### Three upstream behaviours were changed

- **`DISABLE_TELEMETRY=true` is now the default**, and it does more than upstream.
  Upstream applied the flag only to usage *metrics* and still posted the instance
  config; here it suppresses the whole hub ping. It also now suppresses
  `register_instance`, which otherwise transmits the company name and the
  owner's real name and email address to an external hub at setup — and opted
  them into its mailing list. `subscribed_to_mailers` is now `false` regardless.
- **`ENABLE_PUSH_RELAY_SERVER=false`.** Mobile push is relayed through an
  upstream service. Turn it back on only with your own push credentials.
- **Remote content fetches repointed.** The dashboard pulled a changelog feed, a
  testimonials JSON file and a status page from upstream hosts.

### Deliberately left unchanged

- **`Chatwoot*` CamelCase identifiers** — `ChatwootApp` (59 files),
  `ChatwootExceptionTracker` (52), `ChatwootHub` (17), `ChatwootCaptcha`,
  `ChatwootMarkdownRenderer`. Real Ruby constants.
- **`LICENSE` and `enterprise/LICENSE`**, and the `Copyright (c) 2017-2026
  Chatwoot Inc.` notice. Required by the MIT terms.
- **The `send_push` hub endpoint** is a functional push relay, not telemetry.
  It is disabled by configuration rather than removed.
- **Lowercase `chatwoot` package and gem names**, and the `@chatwoot/chatwoot`
  npm package name — dependency resolution identifiers.

### Not covered

Specs, Storybook stories, swagger examples and test fixtures still contain
upstream names and domains. None ship in the running product.

## Provenance and licence

MIT for the core, with `enterprise/` under a separate commercial licence.
See [UPSTREAM.md](./UPSTREAM.md).
