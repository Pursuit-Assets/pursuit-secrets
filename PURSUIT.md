# Pursuit Secrets

Pursuit Secrets is Pursuit's branded deployment of
[PrivateBin](https://privatebin.info/), a zero-knowledge paste service. Message
contents are encrypted and decrypted in the browser; the server stores only the
encrypted payload. The decryption key is carried in the URL fragment and is not
sent to the server.

## Deployment shape

- PrivateBin release: `2.0.5`
- Runtime: the official `privatebin/nginx-fpm-alpine` image, pinned by release
  and multi-platform digest
- Render service: Docker web service, Starter plan, Oregon region, one instance
- Persistent storage: 1 GB disk mounted at `/srv/data`
- Encrypted payload limit: 50 MB (approximately 35-40 MB for typical binary
  attachments after browser-side encoding and encryption)
- Health check: `GET /`
- Container port: `8080`

The child image overlays only the Pursuit configuration, adapted Bootstrap 5
template, CSS, and mark. It does not rebuild or modify PrivateBin's JavaScript or
encryption implementation.

The persistent disk is required. Without it, encrypted pastes, server salt,
traffic-limiter state, and purge state disappear on restart or deploy. Render
disks also make this a single-instance service and disable zero-downtime deploys.

The child image raises Nginx and PHP request ceilings to 64 MB and PHP's memory
limit to 256 MB. Keep those ceilings above `main.sizelimit` in `cfg/conf.php`.
The 50 MB PrivateBin limit is deliberately below the proxy and runtime limits;
larger attachments should use a storage flow designed for chunked uploads.

## Local verification

```sh
docker build --tag pursuit-secrets:local .
docker volume create pursuit-secrets-data
docker run --rm --name pursuit-secrets \
  --publish 8080:8080 \
  --volume pursuit-secrets-data:/srv/data \
  pursuit-secrets:local
```

Open `http://localhost:8080`. The insecure-context warning is expected locally;
production must use HTTPS so the browser Web Crypto API and PrivateBin threat
model remain valid.

## Render

`render.yaml` documents the complete production shape and can be checked with:

```sh
render blueprints validate render.yaml
```

The installed Render CLI creates and deploys the web service, but version 2.21
does not expose persistent-disk creation. The disk must therefore be attached
through the Render API or dashboard before the instance is treated as
production-ready. Its mount path must be exactly `/srv/data`.

After a deploy:

1. Confirm the service reports `live` and `GET /` returns 200 over HTTPS.
2. Confirm HTTP redirects to HTTPS.
3. Confirm `Strict-Transport-Security` is present.
4. Create a short-lived paste, open it from its complete URL, and delete it.
5. Restart the service and confirm an unexpired test paste remains readable.

Do not enable Render's "cache all files" option. Dynamic PrivateBin responses
must not be cached. Default edge caching off is safe.

## Security notes

- Users must keep the complete generated link private; its fragment contains
  the decryption key.
- Password protection adds defense when a link may be exposed.
- The configured request limiter reads `X-Forwarded-For` so users do not all
  appear as Render's proxy. This is abuse throttling, not an authentication or
  authorization boundary; edge enforcement is required if stronger rate
  limiting becomes necessary.
- Do not add analytics, third-party scripts, remote fonts, or tag managers. A
  modified frontend can exfiltrate document keys, so same-origin asset delivery
  is part of the security model.

## Updating PrivateBin

The organization fork is `origin`; the official project is `upstream`.

```sh
git fetch upstream
git merge upstream/master
```

For each upstream release:

1. Review PrivateBin's changelog and container release notes.
2. Update both the version and manifest digest in `Dockerfile`.
3. Rebase the adapted `tpl/bootstrap5.php` changes onto the released template.
4. Run the PHP, container, and browser checks.
5. Deploy from a reviewed commit and repeat the live paste/persistence smoke
   test.

PrivateBin and its original Bootstrap 5 template remain under the bundled
zlib/libpng license. Pursuit's template modifications are identified in the
template header, and the original project notices remain intact.
