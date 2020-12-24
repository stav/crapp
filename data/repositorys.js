import repos from './repositorys.json'

const repositorys = []

// Loop thru all repositories to attach imported file data
for (const repo of repos) {

  // Add slug
  repo.slug = repo.name.split(/\s/)[0].toLowerCase()

  // Attach imported transactions
  if (repo.xfile) {
    repo.transactions = require(`~/data/${repo.xfile}`)
  }

  // Attach imported statements
  if (repo.sfile) {
    repo.statements = require(`~/data/${repo.sfile}`)
  }

  repositorys.push(repo)
}

export default async () => repositorys // eslint-disable-line require-await
