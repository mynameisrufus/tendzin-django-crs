# Tendzin Django CRS (Central Reservation System)

## Heroku Initial Deploy

```
heroku create
heroku buildpacks:set heroku/python
heroku config:set TENDZIN_LOGO_URL=/static/frontend/tendzin-logo.png TENDZIN_API_KEY=xxxxx
git checkout -b deploy
npm install
npm run build
git add -f project/frontend/static/frontend/main.js
git commit -m "commit compiled js"
git push heroku deploy:master
```

## Heroku Deploy

```
git checkout deploy
git reset --hard master
npm run build
git add -f project/frontend/static/frontend/main.js
git commit -m "commit compiled js"
git push heroku deploy:master -f
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
