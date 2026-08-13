import { getHomeContent } from '@/lib/bitrix/home'

export default async function Home() {
  // The request is executed while the static page is generated at build time.
  const home = await getHomeContent()

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-primary text-sm tracking-[0.2em] uppercase">
        Проверка Bitrix API
      </p>
      <h1 className="font-display text-6xl leading-none">{home.title}</h1>
      <p className="text-muted max-w-2xl text-lg">{home.description}</p>
      <dl className="bg-olive grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
        <div>
          <dt className="text-muted text-sm">Телефон</dt>
          <dd className="mt-1 text-lg">{home.phone}</dd>
        </div>
        <div>
          <dt className="text-muted text-sm">Адрес</dt>
          <dd className="mt-1 text-lg">{home.address}</dd>
        </div>
      </dl>
    </main>
  )
}
