CF_API_TOKEN="vONYIPvVmX2c6yV0OaKkCwIlCz2XtONIQgNJkznY"
CF_EMAIL="royceaden@gmail.com"
DOMAIN="gitfile.tech"

c3 api instance create \
  --api-token $CF_API_TOKEN \
  --email $CF_EMAIL \
  --name $DOMAIN \
  --zone $DOMAIN \
  --plan "free" \
  --type "full"