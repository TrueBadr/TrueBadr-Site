const articleFiles = import.meta.glob('../articles/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function calculateReadingTime(content) {
  const words = content
      .replace(/[#>*_`~\-]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length

  const minutes = Math.max(1, Math.ceil(words / 180))

  return minutes
}

function parseArticle(raw) {
  const normalized = raw.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) {
    throw new Error('كل مقال لازم يبدأ ببيانات بين --- و ---')
  }

  const metadata = Object.fromEntries(
      match[1]
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const separator = line.indexOf(':')

            if (separator === -1) {
              return [line, '']
            }

            return [
              line.slice(0, separator).trim(),
              line.slice(separator + 1).trim(),
            ]
          }),
  )

  const id = Number(metadata.id)
  const content = match[2].trim()

  if (!Number.isInteger(id)) {
    throw new Error('id لازم يكون رقمًا صحيحًا')
  }

  if (!metadata.title) {
    throw new Error(`المقال رقم ${id} بلا عنوان`)
  }

  if (!metadata.date) {
    throw new Error(`المقال رقم ${id} بلا تاريخ`)
  }

  return {
    id,
    title: metadata.title,
    date: metadata.date,
    content,
    readingTime: calculateReadingTime(content),
  }
}

export const articles = Object.values(articleFiles)
    .map(parseArticle)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

export function getArticle(id) {
  return articles.find((article) => article.id === id)
}