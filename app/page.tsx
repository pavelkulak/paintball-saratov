import { getHomeContent } from '@/lib/bitrix/home'

export default async function Home() {
  const home = await getHomeContent()

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <article className="bg-olive w-full rounded-3xl p-8 shadow-xl sm:p-12">
        <p className="text-primary text-sm tracking-[0.2em] uppercase">
          Bitrix CMS
        </p>
        <h1 className="font-display mt-4 text-6xl leading-none">
          {home.title}
        </h1>
        <p className="text-muted mt-6 max-w-2xl text-lg">{home.description}</p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-muted text-sm">Телефон</dt>
            <dd className="mt-1 text-lg">{home.phone}</dd>
          </div>
          <div>
            <dt className="text-muted text-sm">Адрес</dt>
            <dd className="mt-1 text-lg">{home.address}</dd>
          </div>
        </dl>
      </article>
    </main>
  )
}
