# CrApp - The Crypto App

Keep track of your crypto portfolio with exchange APIs and local text files.

![Chart](https://raw.githubusercontent.com/stav/stav.github.io/master/images/crapp/chart.png)

![Chart](https://raw.githubusercontent.com/stav/stav.github.io/master/images/crapp/minis.png)

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Deploy

My host does not have enough available memory to build the app so I have to build
it on the dev machine and copy the files over manually.

	stav@varan ~/Work/Crypto/crapp$ cp -r .nuxt/ cowboy:/~/crapp/

## Remote

	stav@cowboy:/srv/~/crapp$ pm2 start 'yarn start' --name CrApp
	[PM2] Starting /usr/bin/bash in fork_mode (1 instance)
	[PM2] Done.
	┌─────┬──────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
	│ id  │ name     │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
	├─────┼──────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
	│ 0   │ CrApp    │ default     │ N/A     │ fork    │ 25117    │ 0s     │ 0    │ online    │ 0%       │ 696.0kb  │ stav     │ disabled │
	└─────┴──────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘

## Credits

https://coindashboards.com/currency/uniswap
https://drive.google.com/drive/folders/1efGfjrsYQVB4sBiZ11YgDnTDi9zXVVnb
https://github.com/AllienWorks/cryptocoins
https://github.com/spothq/cryptocurrency-icons
https://monolith.xyz
https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png
