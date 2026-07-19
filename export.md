# Wallet fixture exports — host access

`corptools` writes purged NPC wallet journal fixtures to `wallet_exports`
under its media root (`corptools/task_helpers/wallet_export.py`,
`_export_root()`). In the AllianceAuth docker stack, `MEDIA_ROOT` isn't set
in `local.py`/`base.py`, so it defaults to `''`, and the path resolves
relative to `working_dir: /home/allianceauth/myauth/` — landing at
`/home/allianceauth/myauth/wallet_exports` inside the container.

To get these files onto the host, add a bind mount to the services in the
stack's `docker-compose.yml` that actually touch them: `allianceauth_gunicorn`
(serves the admin listing page, `wallet_export_list` view) and
`allianceauth_worker` (runs the export/purge tasks). `beat` and
`worker_services` don't need it.

`<<: [*allianceauth-base]` merge does **not** concatenate list-valued keys —
a `volumes:` block added directly on a service **replaces** the anchor's
`volumes:`, it doesn't merge with it. So copy the base list and append the
new line rather than just adding one line.

```yaml
  allianceauth_gunicorn:
    container_name: allianceauth_gunicorn
    <<: [*allianceauth-base]
    entrypoint: ["gunicorn", "myauth.wsgi", "--bind=0.0.0.0:8000", "--workers=3", "--timeout=120", "--max-requests=500", "--max-requests-jitter=50"]
    expose:
      - 8000
    volumes:
      - ./conf/local.py:/home/allianceauth/myauth/myauth/settings/local.py
      - ./conf/celery.py:/home/allianceauth/myauth/myauth/celery.py
      - ./conf/urls.py:/home/allianceauth/myauth/myauth/urls.py
      - ./conf/memory_check.sh:/memory_check.sh
      - ./templates:/home/allianceauth/myauth/myauth/templates/
      - static-volume:/var/www/myauth/static
      - ./wallet_exports:/home/allianceauth/myauth/wallet_exports

  allianceauth_worker:
    <<: [*allianceauth-base, *allianceauth-health-checks]
    entrypoint: ["celery", "-A", "myauth", "worker", "--pool=threads", "--concurrency=5", "-n", "worker_%n"]
    volumes:
      - ./conf/local.py:/home/allianceauth/myauth/myauth/settings/local.py
      - ./conf/celery.py:/home/allianceauth/myauth/myauth/celery.py
      - ./conf/urls.py:/home/allianceauth/myauth/myauth/urls.py
      - ./conf/memory_check.sh:/memory_check.sh
      - ./templates:/home/allianceauth/myauth/myauth/templates/
      - static-volume:/var/www/myauth/static
      - ./wallet_exports:/home/allianceauth/myauth/wallet_exports
    deploy:
      replicas: 2
```

## Permissions

The container runs as uid/gid `61000` (`allianceauth` user, set in the
stack's `Dockerfile`). Docker auto-creates bind-mount source directories as
root on first `up`, which that user can't write into. Create it first:

```bash
mkdir -p ./wallet_exports && sudo chown 61000:61000 ./wallet_exports
```

(run from the stack's `docker/` directory)

## TODO

- Add `wallet_exports/` to the stack's `.gitignore` so exported files don't
  get committed.
