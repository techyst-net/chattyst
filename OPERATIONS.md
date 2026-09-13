# Chatyst Desk — Operations

> Shared infrastructure (Postgres, Redis, S3, SMTP, LLM …) is wired in
> already — see [../INFRA.md](../INFRA.md). This app runs at http://localhost:3010.

## Generated configuration

A ready-to-run configuration has been generated in this directory:

- `.env`

Signing and encryption secrets in it are **real random values**, generated
per-file. Anything only you can supply — API keys, OAuth credentials — is
marked `CHANGE_ME`. Search for it:

```sh
grep -rn CHANGE_ME .
```

These files are gitignored and must not be committed.

## Processes and ports

| Process | Command | Port |
|---|---|---|
| Rails web | `bundle exec rails s` | `3000` |
| Sidekiq worker | `bundle exec sidekiq` | — |
| Vite dev server | `pnpm dev` | `3036` (development only) |
| PostgreSQL (+`pgvector`) | | `5432` |
| Redis | | `6379` |

Runtime: Ruby `3.4.4` (`.ruby-version`), Node per `.nvmrc`.

## Required

| Variable | Purpose |
|---|---|
| `SECRET_KEY_BASE` | Rails signing/encryption base. **Generate a long random hex value.** Rotating it invalidates all sessions. |
| `FRONTEND_URL` | Absolute public origin. Used to build every link in outbound email and the widget script. |
| `POSTGRES_HOST`, `POSTGRES_USERNAME`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE` | Database connection |
| `REDIS_URL` | Cache, Sidekiq queue and ActionCable |
| `RAILS_ENV` | `development` or `production` |

`REDIS_PASSWORD`, `REDIS_SENTINELS`, `REDIS_SENTINEL_MASTER_NAME` cover
password-protected and Sentinel setups.

## Email

Outbound:

| Variable | Purpose |
|---|---|
| `MAILER_SENDER_EMAIL` | Default From header, in `Name <address>` form |
| `SMTP_ADDRESS`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_DOMAIN` | SMTP relay. **If `SMTP_ADDRESS` is empty it falls back to local sendmail**, which usually means mail is silently not delivered. |
| `SMTP_AUTHENTICATION`, `SMTP_ENABLE_STARTTLS_AUTO`, `SMTP_OPENSSL_VERIFY_MODE` | TLS and auth behaviour |

Inbound (reply-by-email into conversations):

`MAILER_INBOUND_EMAIL_DOMAIN`, `RAILS_INBOUND_EMAIL_SERVICE`,
`RAILS_INBOUND_EMAIL_PASSWORD`, plus provider keys
`MAILGUN_INGRESS_SIGNING_KEY`, `MANDRILL_INGRESS_API_KEY`,
`ACTION_MAILBOX_SES_SNS_TOPIC`.

## File storage

| Variable | Purpose |
|---|---|
| `ACTIVE_STORAGE_SERVICE` | `local`, `amazon`, `azure` or `gcs` |
| `S3_BUCKET_NAME`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` | S3 storage |
| `DIRECT_UPLOADS_ENABLED` | Browser-to-bucket uploads |
| `VIPS_BLOCK_UNTRUSTED` | Keep at `1` — hardens image processing against untrusted input |

With `local`, attachments live on the filesystem and **need a persistent volume**.

## Access and security

| Variable | Purpose |
|---|---|
| `ENABLE_ACCOUNT_SIGNUP` | `true`, `false`, or `api_only`. **Leave `false`** unless you intend open registration. |
| `FORCE_SSL` | Redirect to HTTPS and set secure cookies |
| `ASSET_CDN_HOST` | Serve compiled assets from a CDN |
| `RAILS_MAX_THREADS` | Puma thread count |

## Channel integrations

All optional; each channel stays hidden until its credentials are set.

- **Facebook / Instagram** — `FB_APP_ID`, `FB_APP_SECRET`, `FB_VERIFY_TOKEN`, `IG_VERIFY_TOKEN`
- **Slack** — `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_SIGNING_SECRET`
- **Twitter/X** — `TWITTER_APP_ID`, `TWITTER_CONSUMER_KEY`, `TWITTER_CONSUMER_SECRET`, `TWITTER_ENVIRONMENT`
- **Google sign-in** — `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_CALLBACK_URL`
- **Microsoft** — `AZURE_APP_ID`, `AZURE_APP_SECRET`
- **Billing** — `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

## Mobile apps

`IOS_APP_ID`, `ANDROID_BUNDLE_ID`, `ANDROID_SHA256_CERT_FINGERPRINT` serve the
Apple app-site-association and Android asset-links files. They are **blank by
default here** — upstream shipped its own app's identifiers, which would point
your deep links at someone else's application. Fill them in only if you publish
your own builds.

## Privacy — changed from upstream

| Variable | Default here | Effect |
|---|---|---|
| `DISABLE_TELEMETRY` | `true` | Suppresses the periodic instance ping **and** the setup-time registration call. See `UPSTREAM.md` — upstream's flag only covered part of this. |
| `ENABLE_PUSH_RELAY_SERVER` | `false` | Mobile push otherwise relays through an upstream service |

Optional and off unless configured: `NEW_RELIC_*` (APM), `SENTRY_DSN`.

## Runtime configuration (not environment variables)

Branding, feature flags and many limits live in the **database**, seeded from
`config/installation_config.yml` and editable at Super Admin → Settings. Editing
that YAML only affects a fresh install; on an existing instance change the
values through the admin UI.

## Deployment requirements

- **PostgreSQL with the `pgvector` extension.** The AI assistant features fail
  to migrate without it.
- **Sidekiq must run as a separate process.** Without it no email is delivered,
  no webhook fires, no automation runs and no report is generated — silently.
- Persistent storage for attachments unless using S3/Azure/GCS.
- Run `bundle exec rails db:migrate` before each release.
- Set `FRONTEND_URL` to the real HTTPS origin, `FORCE_SSL=true`, and a strong
  `SECRET_KEY_BASE`.
- Point `TERMS_URL` and `PRIVACY_URL` at documents you publish before enabling
  sign-up.
- If you have no commercial entitlement, delete `enterprise/` — see
  `UPSTREAM.md`.
