# Example curls

- Dev: `localhost:3000/api/v1/`
- Prod: `https://happy-body-tools.herokuapp.com/api/v1/`

```bash
# Get users
curl localhost:3000/api/v1/users

# Get a user
curl localhost:3000/api/v1/users/1

# Create/update user
curl -H 'Content-Type: application/json' localhost:3000/api/v1/users/1 -d '{ "id": "1", "idealWeight": 79.5, "measurementSystem": "imperial", "baseDumbbellWeight": 10 }'

# Get measurements for a user
curl localhost:3000/api/v1/users/1/measurements | json_pp

# Delete table
curl -X DELETE localhost:3000/api/v1/db/users
```
