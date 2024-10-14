# Deploy

- .env change url server
- run bash install script
  ```
  bash ./script/install.sh
  ```
- copy nginx
  ```
  cp ../nginx/default.conf:/etc/nginx/conf.d/default.conf
  ```
- config upload nginx
  ```
    http {
    ...
    client_max_body_size 100M;
    ...
    server {
      ...
    }
    }
  ```
- run pm2
- restart nginx
