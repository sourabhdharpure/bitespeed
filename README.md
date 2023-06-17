# command to run (make sure docker is running on the system)

docker-compose up
git
# Curl to test the app

curl --location 'localhost:4000/identify' \
--header 'Content-Type: application/json' \
--data '{
"email":"d",
"phoneNumber":3
}
'


