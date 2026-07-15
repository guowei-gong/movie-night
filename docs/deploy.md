# Deployment

The application and its static catalog are owned by this project but deployed independently.

## Local catalog

The full catalog is stored in `public/data` and ignored by Git. Bootstrap or refresh it from a compatible source:

```bash
npm run data:sync -- /path/to/source/data
npm run data:validate
```

## First deployment

Upload the catalog and code before switching Nginx:

```bash
scripts/deploy-data.sh
scripts/deploy-code.sh
scripts/bootstrap-server.sh
```

Defaults target `root@38.148.205.95:31380`, `/var/www/movie-night`, `mvnight.xyz`, and `www.mvnight.xyz`. Override them with `MOVIE_NIGHT_HOST`, `MOVIE_NIGHT_PORT`, `MOVIE_NIGHT_USER`, `MOVIE_NIGHT_REMOTE_ROOT`, `MOVIE_NIGHT_DOMAIN`, and `MOVIE_NIGHT_WWW_DOMAIN`. The `www` host redirects permanently to the apex domain.

## Routine updates

Code-only update:

```bash
scripts/deploy-code.sh
```

Catalog-only update:

```bash
scripts/deploy-data.sh
```

Both deployments use timestamped releases and atomic symlink switches. Code keeps five releases and data keeps three. The former `/var/www/mvnight` deployment is retained as a manual rollback source.
