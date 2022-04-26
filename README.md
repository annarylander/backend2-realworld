# RealWorld API

Utgå från det här projektet när ni gör er gruppuppgift.

Projektet innehåller en server som levererar frontenden för er uppgift, samt ett skal för en Express-backend där ni får fylla på med era egna routes.

Starta servern genom att köra kommandot `node app.js` - ni bör nu kunna komma åt ett färdigt frontend på http://localhost:3000,

## Postman

Projektet innehåller även en [Postman-collection](api/RealWorld.postman_collection.json) som ni kan använda för att

För att köra alla Postman-tester kan ni använda:

```sh
npx newman run api/RealWorld.postman_collection.json \
  --delay-request 500 \
  --global-var "APIURL=$APIURL" \
  --global-var "USERNAME=$USERNAME" \
  --global-var "EMAIL=$EMAIL" \
  --global-var "PASSWORD=$PASSWORD" \
  "$@"
```

- `$APIURL` ska vara URL:en till ert API, e.g. `http://localhost:3000`
- `$USERNAME` ska vara ett unikt användarnamn
- `$PASSWORD` ska vara ett lösenord
- `$EMAIL` ska vara en email-address

Det finns även ett shell-script som kör alla tester: [run-api-tests.sh](api/run-api-tests.sh)

För att köra scriptet (i MacOS/Linux):

```sh
cd api
./run-api-tests.sh
```

Som standard kommer scriptet att gå mot RealWorld-demo-API:t, så då bör alla
tester passera. När ni ska köra mot er egen server (givet att den är igång på
port 3000) kör ni scriptet så här:

```sh
APIURL=http://localhost:3000 ./run-api-tests.sh
```

Scriptet skapar automatiskt nya värden för `USERNAME` och `EMAIL`, vilket gör det lättare att köra upprepade gånger.
