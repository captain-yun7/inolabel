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
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'ko-KR,ko;q=0.9',
    }

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) })

    if (!res.ok) {
      return NextResponse.json({ error: `페이지 로드 실패 (${res.status})` }, { status: 400 })
    }

    const html = await res.text()

    // imweb 플랫폼 감지 → AJAX API로 상품 목록 가져오기
    const imwebProducts = await tryImwebScrape(html, url, headers)
    if (imwebProducts.length > 0) {
      return NextResponse.json({ products: imwebProducts, source: url })
    }

    // 일반 HTML 파싱
    const products = parseProducts(html, url)

    return NextResponse.json({ products, source: url })
  } catch (err) {
    const message = err instanceof Error ? err.message : '크롤링 실패'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * imweb 플랫폼 상품 크롤링
 * imweb은 상품 목록을 AJAX(/ajax/get_shop_list_view.cm)로 로드함
 */
async function tryImwebScrape(
  html: string,
  pageUrl: string,
  headers: Record<string, string>,
): Promise<ScrapedProduct[]> {
  // imweb 플랫폼 감지
  const isImweb = html.includes('imweb.me') || html.includes('get_shop_list_view.cm')
  if (!isImweb) return []

  // 카테고리 ID 추출
  const categoryMatch = html.match(/category['"\s:]+['"]([^'"]+)['"]/i)
  if (!categoryMatch) return []

  const categoryId = categoryMatch[1]
  const origin = new URL(pageUrl).origin

  // imweb 상품 목록 AJAX 호출
  const ajaxRes = await fetch(`${origin}/ajax/get_shop_list_view.cm`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': pageUrl,
    },
    body: `category=${encodeURIComponent(categoryId)}&page=1&product_page_no=1&per=100`,
    signal: AbortSignal.timeout(10000),
  })

  if (!ajaxRes.ok) return []

  const json = await ajaxRes.json()
  if (!json.html) return []

  // data-product-properties JSON에서 상품 정보 추출
  const products: ScrapedProduct[] = []
  const propMatches = json.html.matchAll(/data-product-properties='(\{[^']+\})'/g)

  for (const match of propMatches) {
    try {
      const decoded = match[1]
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
      const prop = JSON.parse(decoded)

      if (prop.name) {
        products.push({
          name: prop.name,
          price: prop.price || prop.original_price || 0,
          image_url: prop.image_url || '',
          url: prop.idx ? `${pageUrl}?idx=${prop.idx}` : pageUrl,
        })
      }
    } catch { /* ignore parse error */ }
  }

  return products
}

function parseProducts(html: string, baseUrl: string): ScrapedProduct[] {
  const products: ScrapedProduct[] = []

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
