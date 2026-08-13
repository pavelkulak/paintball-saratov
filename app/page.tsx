import { getHomeContent } from '@/lib/bitrix/home'

export default async function Home() {
  // The request is executed while the static page is generated at build time.
  await getHomeContent()

  return null
}
