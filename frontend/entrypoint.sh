#!/bin/sh

# Create the env-config.js file
CONFIG_FILE="/usr/share/nginx/html/env-config.js"
echo "window._env_ = {" > $CONFIG_FILE

echo "🛠️ Generating dynamic environment config..."
# Use while read for robustness, filtering for VITE_ prefixed variables
env | grep VITE_ | while read -r line; do
  key=$(echo $line | cut -d '=' -f 1)
  value=$(echo $line | cut -d '=' -f 2-)
  echo "  $key: \"$value\"," >> $CONFIG_FILE
  echo "  ✅ Injected: $key"
done

echo "};" >> $CONFIG_FILE
echo "console.log('🌐 Kubernetes Environment Injected Successfully');" >> $CONFIG_FILE

echo "📄 Final Config File Content:"
cat $CONFIG_FILE

# Start Nginx
exec "$@"
