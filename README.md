# Tendzin Django CRS (Central Reservation System)

## Heroku Deploy

```
heroku create
heroku buildpacks:set heroku/python
heroku config:set TENDZIN_LOGO_URL=/static/frontend/tendzin-logo.png TENDZIN_API_KEY=xxxxx
git checkout -b deploy
yarn build
git add -f project/frontend/static/frontend/main.js
git commit -m "commit compiled js"
git push heroku deploy:master
```

## Local Development

Django:

```
export TENDZIN_LOGO_URL=/static/frontend/tendzin-logo.png
export TENDZIN_API_KEY=xxxxx
python manage.py runserver
```

React:

```
npm run build-dev
```
