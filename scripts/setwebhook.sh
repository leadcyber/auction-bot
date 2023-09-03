#!/bin/bash

# if [ -z ${BOT_KEY+x} ]; then
#     echo "BOT_KEY is unset";
#     exit
# fi

curl https://api.telegram.org/bot5894375023:AAHFMqqJyq-P20zE_P-IKI3cmryKrywgazo/setWebhook \
    -F "url=https://ee06-142-214-188-2.ngrok-free.app/api/telegram/updates"
