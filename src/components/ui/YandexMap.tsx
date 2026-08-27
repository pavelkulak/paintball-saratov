'use client'

import { useEffect, useRef } from 'react'

import { siteContact } from '@/lib/site-contact'

type Coordinates = [number, number]

type YandexMapInstance = {
  behaviors: {
    disable: (behavior: 'scrollZoom' | 'drag') => void
  }
  geoObjects: {
    add: (placemark: YandexPlacemarkInstance) => void
  }
}

type YandexPlacemarkInstance = object

type YandexMapsApi = {
  ready: (callback: () => void) => void
  Map: new (
    element: HTMLElement,
    options: {
      center: Coordinates
      zoom: number
      controls: string[]
    },
  ) => YandexMapInstance
  Placemark: new (
    coordinates: Coordinates,
    properties: {
      balloonContent: string
      hintContent: string
    },
  ) => YandexPlacemarkInstance
}

declare global {
  interface Window {
    ymaps?: YandexMapsApi
  }
}

const YANDEX_MAPS_URL = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU'

function loadYandexMaps(): Promise<YandexMapsApi> {
  return new Promise((resolve, reject) => {
    const finish = () => {
      if (!window.ymaps) {
        reject(new Error('Yandex Maps API is unavailable'))
        return
      }

      window.ymaps.ready(() => resolve(window.ymaps as YandexMapsApi))
    }

    if (window.ymaps) {
      finish()
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-yandex-maps]',
    )

    if (existingScript) {
      existingScript.addEventListener('load', finish, { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Yandex Maps script failed to load')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = YANDEX_MAPS_URL
    script.async = true
    script.dataset.yandexMaps = 'true'
    script.addEventListener('load', finish, { once: true })
    script.addEventListener(
      'error',
      () => reject(new Error('Yandex Maps script failed to load')),
      { once: true },
    )
    document.head.appendChild(script)
  })
}

export function YandexMap() {
  const mapElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isCancelled = false
    let map: YandexMapInstance | undefined

    loadYandexMaps()
      .then((ymaps) => {
        if (isCancelled || !mapElementRef.current) return

        const point: Coordinates = [55.41584, 37.786051]
        const routeUrl =
          'https://yandex.ru/maps/?rtext=~55.41584,37.786051&rtt=auto'
        const isMobileViewport = window.matchMedia('(max-width: 576px)').matches

        map = new ymaps.Map(mapElementRef.current, {
          center: point,
          zoom: 16,
          controls: ['zoomControl'],
        })

        map.behaviors.disable('scrollZoom')

        if (isMobileViewport) {
          map.behaviors.disable('drag')
        }

        const placemark = new ymaps.Placemark(point, {
          balloonContent: `
            <div class="paintball-map-balloon">
              <strong class="paintball-map-balloon__title">Пейнтбол для всех</strong>
              <a href="${siteContact.phone.href}" class="paintball-map-balloon__phone">${siteContact.phone.label}</a>
              <div class="paintball-map-balloon__address">${siteContact.address}</div>
              <a href="${routeUrl}" target="_blank" rel="noopener noreferrer" class="paintball-map-balloon__route">Построить маршрут</a>
            </div>
          `,
          hintContent: siteContact.address,
        })

        map.geoObjects.add(placemark)
      })
      .catch(() => undefined)

    return () => {
      isCancelled = true
      map = undefined
    }
  }, [])

  return (
    <div
      ref={mapElementRef}
      className="size-full"
      aria-label="Карта проезда к площадке для пейнтбола"
      role="region"
    />
  )
}
