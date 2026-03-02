/**
 * Edge Runtime 업로드 프록시
 * - 클라이언트에서 받은 파일을 R2 presigned URL로 스트리밍 전달
 * - Edge Runtime은 body를 버퍼링하지 않으므로 파일 크기 제한 없음
 * - 같은 도메인이므로 CORS 불필요
 */
export const runtime = 'edge'

export async function PUT(request: Request) {
  try {
    const r2Url = request.headers.get('x-upload-url')
    const contentType = request.headers.get('x-content-type') || 'application/octet-stream'

    if (!r2Url) {
      return Response.json({ error: '업로드 URL이 없습니다' }, { status: 400 })
    }

    // R2 presigned URL로 스트리밍 전달
    const r2Response = await fetch(r2Url, {
      method: 'PUT',
      body: request.body,
      headers: { 'Content-Type': contentType },
      // @ts-expect-error - duplex is needed for streaming but not in TS types
      duplex: 'half',
    })

    if (!r2Response.ok) {
      const errorText = await r2Response.text()
      console.error('R2 upload failed:', r2Response.status, errorText)
      return Response.json(
        { error: `R2 업로드 실패 (${r2Response.status})` },
        { status: 502 }
      )
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error('Upload proxy error:', error)
    return Response.json(
      { error: '업로드 프록시 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
