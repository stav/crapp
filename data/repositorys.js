import repos from './repositorys.json'

const repositorys = []

// Loop thru all repositories to attach imported file data
for (const repo of repos) {
  if (repo.xfile) {
    // Attach imported transactions
    repo.transactions = require(`~/data/${repo.xfile}`)
  }
  repositorys.push(repo)
}

export default async () => repositorys // eslint-disable-line require-await
