# Upstream source

| Field | Value |
|---|---|
| Upstream project | Chatwoot |
| Source | https://github.com/chatwoot/chatwoot |
| Version adapted | 4.17.1 |
| Licence (core) | MIT Expat |
| Licence (`enterprise/`) | separate commercial licence — see `enterprise/LICENSE` |
| Retained notices | `LICENSE`, `enterprise/LICENSE` |

## Licence obligations

The core is **MIT**: rebranding and redistribution are permitted provided the
copyright notice and permission notice are retained. `LICENSE` is kept intact
for exactly that reason.

## The `enterprise/` directory

Everything under `enterprise/` is **not** MIT. It is governed by
`enterprise/LICENSE`, a commercial licence that restricts use, modification and
redistribution.

**These files were rebranded along with the rest of the tree at the project
owner's explicit direction**, after the licensing split was raised. That is
recorded here rather than left implicit. If you intend to distribute this
product, or to run it without a commercial entitlement, the correct handling is
to delete `enterprise/` and rely on the MIT core alone.

Note also that several features are gated at runtime on
`ChatwootHub.pricing_plan != 'community'`, which is resolved against an external
hub. With telemetry disabled the plan resolves to `community`, so those features
stay off — which is the correct state for a deployment without an entitlement.

## Privacy changes from upstream

| Behaviour | Upstream | Here |
|---|---|---|
| `DISABLE_TELEMETRY` scope | usage metrics only; instance config still posted | suppresses the entire hub ping |
| `register_instance` at setup | always posts company name, owner name and owner email | suppressed when telemetry is disabled |
| `subscribed_to_mailers` | `true` | `false` |
| `ENABLE_PUSH_RELAY_SERVER` | `true` | `false` |
| `DISPLAY_MANIFEST` | `true` | `false` |

## Pulling upstream fixes

```sh
git remote add upstream https://github.com/chatwoot/chatwoot.git
git fetch upstream --depth=50
```

Expect conflicts in:

- `config/installation_config.yml`
- `theme/colors.js` and `app/javascript/dashboard/assets/scss/_next-colors.scss`
- `lib/chatwoot_hub.rb`
- `app/javascript/dashboard/components-next/icon/Logo.vue`
- `db/schema.rb` and `db/migrate/20230426130150_init_schema.rb` (accent default)
- `.env.example`

The bulk rename touched 1,078 files, including locale catalogues. Resolve in
favour of upstream code, re-apply the rename to display strings, and re-check
the telemetry gates above have not been reverted.
