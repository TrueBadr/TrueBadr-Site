import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { articles, getArticle } from './articles'

function navigate(path) {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo({ top: 0 })
}

function SiteHeader() {
    return (
        <header className="site-header">
            <a
                className="site-title"
                href="/"
                onClick={(event) => {
                    event.preventDefault()
                    navigate('/')
                }}
            >
                TrueBadr
            </a>
        </header>
    )
}

function HomePage() {
    return (
        <main>
            <div className="articles-list">
                {articles.map((article) => (
                    <article className="article-row" key={article.id}>
                        <a
                            href={`/${article.id}`}
                            onClick={(event) => {
                                event.preventDefault()
                                navigate(`/${article.id}`)
                            }}
                        >
                            <span className="article-heading">
    <span className="article-number">{article.id}</span>
    <span className="article-title">{article.title}</span>
</span>
                        </a>

                        <div className="article-meta">
                            <time dateTime={article.date}>
                                {formatDate(article.date)}
                            </time>
                            <span>قراءة {article.readingTime} دقائق</span>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    )
}

function ArticlePage({ id }) {
    const article = getArticle(id)

    useEffect(() => {
        document.title = article
            ? `${article.title} — TrueBadr`
            : 'المقال غير موجود — TrueBadr'

        return () => {
            document.title = 'TrueBadr'
        }
    }, [article])

    if (!article) {
        return (
            <main>
                <h1>المقال غير موجود</h1>
                <p>
                    <a
                        href="/"
                        onClick={(event) => {
                            event.preventDefault()
                            navigate('/')
                        }}
                    >
                        ارجع إلى المقالات
                    </a>
                </p>
            </main>
        )
    }

    return (
        <main>
            <article>
                <header className="article-header">
                    <p className="article-id">{article.id}</p>
                    <h1>{article.title}</h1>

                    <div className="article-meta">
                        <time dateTime={article.date}>
                            {formatDate(article.date)}
                        </time>
                        <span>قراءة {article.readingTime} دقائق</span>
                    </div>
                </header>

                <div className="markdown-body">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
            </article>
        </main>
    )
}

function formatDate(date) {
    return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(`${date}T00:00:00`))
}

function App() {
    const [path, setPath] = useState(window.location.pathname)

    useEffect(() => {
        const handleNavigation = () => setPath(window.location.pathname)
        window.addEventListener('popstate', handleNavigation)

        return () => window.removeEventListener('popstate', handleNavigation)
    }, [])

    const articleMatch = path.match(/^\/(\d+)\/?$/)

    return (
        <div className="page-shell">
            <SiteHeader />

            {path === '/' ? (
                <HomePage />
            ) : articleMatch ? (
                <ArticlePage id={Number(articleMatch[1])} />
            ) : (
                <main>
                    <h1>الصفحة غير موجودة</h1>
                </main>
            )}
        </div>
    )
}

export default App