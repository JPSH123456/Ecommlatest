#!/bin/sh

# Create the env-config.js file
CONFIG_FILE="/usr/share/nginx/html/env-config.js"
echo "window._env_ = {" > $CONFIG_FILE

# Use while read for robustness
env | grep VITE_ | while read -r line; do
  key=$(echo $line | cut -d '=' -f 1)
  value=$(echo $line | cut -d '=' -f 2-)
  echo "  $key: \"$value\"," >> $CONFIG_FILE
done

echo "};" >> $CONFIG_FILE

# Add a browser console confirmation
echo "console.log('🌐 Environment config injected successfully!');" >> $CONFIG_FILE

# Start Nginx
exec "$@"
