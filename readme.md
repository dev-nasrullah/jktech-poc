### Run Project

```
docker-compose up --build
```

Use this curl to get access to the application as an admin

```
curl --location 'http://localhost:3000/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "admin@example.com",
    "password": "password"
}'
```
