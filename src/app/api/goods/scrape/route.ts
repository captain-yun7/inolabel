import { NextRequest, NextResponse } from 'next/server'

interface ScrapedProduct {
  name: string
  price: number
  image_url: string
  url: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  let url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL 파라미터가 필요합니다.' }, { status: 400 })
  }

  // URL에 프로토콜 없으면 추가
  if (!url.startsWith('http')) {
    url = 'https://' + url
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `페이지 로드 실패 (${res.status})` }, { status: 400 })
    }

    const html = await res.text()
    const products = parseProducts(html, url)

    return NextResponse.json({ products, source: url })
  } catch (err) {
    const message = err instanceof Error ? err.message : '크롤링 실패'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function parseProducts(html: string, baseUrl: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = []

  // 일반적인 상품 패턴 매칭 (다양한 쇼핑몰 대응)
  // Pattern 1: Open Graph 기반 단일 상품
  const ogTitle = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]+)"/i)?.[1]
  const ogImage = html.match(/<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"/i)?.[1]
  const ogPrice = html.match(/<meta\s+(?:property|name)="(?:product:price:amount|og:price:amount)"\s+content="([^"]+)"/i)?.[1]

  // Pattern 2: JSON-LD 상품 데이터
  const jsonLdMatches = html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)
  for (const match of jsonLdMatches) {
    try {
      const data = JSON.parse(match[1])
      const items = Array.isArray(data) ? data : [data]
      for (const item of items) {
        if (item['@type'] === 'Product' || item['@type'] === 'IndividualProduct') {
          const price = item.offers?.price || item.offers?.lowPrice || 0
          products.push({
            name: item.name || '',
            price: typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, '')) : price,
            image_url: item.image || (Array.isArray(item.image) ? item.image[0] : ''),
            url: item.url || baseUrl,
          })
        }
      }
    } catch { /* ignore parse errors */ }
  }

  // Pattern 3: 상품 리스트 패턴 (카드형)
  // 일반적인 상품 목록 패턴: .product-item, .goods-item 등
  const productPatterns = [
    // <a>나 <div> 안에 이미지 + 이름 + 가격
    /<(?:a|div)[^>]*class="[^"]*(?:product|goods|item|card)[^"]*"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[\s\S]*?<\/(?:a|div)>/gi,
  ]

  // OG 태그 기반 단일 상품이 있고 JSON-LD에서 못 찾았으면
  if (ogTitle && ogImage && products.length === 0) {
    products.push({
      name: decodeHTMLEntities(ogTitle),
      price: ogPrice ? parseInt(ogPrice.replace(/[^0-9]/g, '')) : 0,
      image_url: ogImage,
      url: baseUrl,
    })
  }

  // 가격 패턴 매칭 (한국 쇼핑몰)
  if (products.length === 0) {
    // 간단한 가격+이미지+제목 매칭
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)?.[1]
    const imgMatch = html.match(/<img[^>]+src="(https?:\/\/[^"]+(?:jpg|jpeg|png|webp)[^"]*)"/i)?.[1]
    const priceMatch = html.match(/(?:가격|price|판매가)[^<]*?(\d{1,3}(?:,\d{3})*)\s*원/i)?.[1]

    if (titleMatch && imgMatch) {
      products.push({
        name: decodeHTMLEntities(titleMatch).replace(/\s*[-|].*$/, ''),
        price: priceMatch ? parseInt(priceMatch.replace(/,/g, '')) : 0,
        image_url: imgMatch,
        url: baseUrl,
      })
    }
  }

  return products
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec)))
}
