# epso-prep

Expo/React Native app for EPSO EU exam preparation.

## PM2 Services

| Port | Name | Type |
|------|------|------|
| 8081 | epso-prep-8081 | Expo (Metro bundler) |

**Terminal Commands:**
```bash
pm2 start ecosystem.config.cjs   # First time
pm2 start all                    # After first time
pm2 stop all / pm2 restart all
pm2 start epso-prep-8081 / pm2 stop epso-prep-8081
pm2 logs / pm2 status / pm2 monit
pm2 save                         # Save process list
pm2 resurrect                    # Restore saved list
```
