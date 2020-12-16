# claris-backend

- Backend: http://claris-backend.artisandigital.tech
- Backend [Staging]: https://claris-backend-staging.artisandigital.tech
- Portal Admin: https://claris-portal-admin.artisandigital.tech
- Adminer [Dev]: http://52.221.156.203:1000
- Adminer [Staging]: http://34.87.31.109:1000

## Database

- [back-dev.yml](_deployment/claris/dev/back-dev.yml)
- [reverse-proxy/conf.d/claris-backend.conf](_deployment/claris/reverse-proxy/conf.d/claris-backend.conf)


## Development

Configurations are in .env 
  ```
  yarn
  yarn dev
  ```

```
 TYPEORM_CONNECTION=mysql
-TYPEORM_HOST=localhost
+TYPEORM_HOST=127.0.0.1
 TYPEORM_USERNAME=root
-TYPEORM_PASSWORD=admin1234
-TYPEORM_DATABASE=claris
+TYPEORM_PASSWORD=artisanadmin
+TYPEORM_DATABASE=natdeestone
 TYPEORM_PORT=3306
 TYPEORM_DROP_SCHEMA=false
 TYPEORM_SYNCHRONIZE=true
```
