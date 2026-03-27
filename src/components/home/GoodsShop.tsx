'use client'

import { useState, useEffect } from 'react'
/* eslint-disable @next/next/no-img-element */
import { X, ShoppingBag, ExternalLink } from 'lucide-react'
import { useSupabaseContext } from '@/lib/context'
import styles from './GoodsShop.module.css'

interface GoodsItem {
  id: number
  name: string
  price: number
  image_url: string
  description: string | null
  detail_image_url: string | null
  purchase_url: string | null
  is_active: boolean
}

export default function GoodsShop() {
  const supabase = useSupabaseContext()
  const [goods, setGoods] = useState<GoodsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<GoodsItem | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [shopTitle, setShopTitle] = useState('레이블 굿즈샵')

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        // 굿즈샵 표시 설정 확인
        const { data: setting } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'goods_shop_visible')
          .single()

        if (setting && (setting.value === 'false' || setting.value === false)) {
          setIsVisible(false)
          setIsLoading(false)
          return
        }

        // 섹션 제목 로드
        const { data: titleSetting } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'goods_shop_title')
          .maybeSingle()
        if (titleSetting?.value && typeof titleSetting.value === 'string') {
          setShopTitle(titleSetting.value)
        }

        const { data, error } = await supabase
          .from('goods')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('id', { ascending: true })

        if (!error && data) {
          setGoods(data)
        }
      } catch (err) {
        // goods 테이블이 없을 수 있음 - 조용히 처리
      } finally {
        setIsLoading(false)
      }
    }

    fetchGoods()
  }, [supabase])

  if (!isVisible) return null

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ko-KR').format(price)

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <ShoppingBag size={18} className={styles.headerIcon} />
        <h3 className={styles.headerTitle}>{shopTitle}</h3>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : goods.length === 0 ? (
        <div className={styles.empty}>
          <ShoppingBag size={32} className={styles.emptyIcon} />
          <span>굿즈 상품 준비 중입니다</span>
        </div>
      ) : (
        <div className={styles.grid}>
          {goods.map((item) => (
            <div key={item.id} className={styles.card}>
              {/* Product Image */}
              <div className={styles.imageWrapper}>
                <img
                  src={item.image_url}
                  alt={item.name}
                  className={styles.productImage}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Product Info & Actions */}
              <div className={styles.cardBody}>
                <span className={styles.productName}>{item.name}</span>
                <div className={styles.actions}>
                  <span className={styles.price}>{formatPrice(item.price)}원</span>
                  <button
                    className={styles.detailBtn}
                    onClick={() => setSelectedItem(item)}
                  >
                    상세정보
                  </button>
                  {item.purchase_url && (
                    <a
                      href={item.purchase_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.buyBtn}
                    >
                      구매하기
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PIP 상세정보 - 조그마한 플로팅 창 */}
      {selectedItem && (
        <div className={styles.overlay} onClick={() => setSelectedItem(null)}>
          <div className={styles.pip} onClick={(e) => e.stopPropagation()}>
            <button className={styles.pipClose} onClick={() => setSelectedItem(null)} aria-label="닫기">
              <X size={16} />
            </button>
            <div className={styles.pipImage}>
              <img
                src={selectedItem.detail_image_url || selectedItem.image_url}
                alt={selectedItem.name}
                className={styles.productImage}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={styles.pipInfo}>
              <h4 className={styles.pipName}>{selectedItem.name}</h4>
              <span className={styles.pipPrice}>{formatPrice(selectedItem.price)}원</span>
              {selectedItem.description && (
                <p className={styles.pipDesc}>{selectedItem.description}</p>
              )}
              {selectedItem.purchase_url && (
                <a
                  href={selectedItem.purchase_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pipBuyBtn}
                >
                  <ExternalLink size={14} />
                  구매하기
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
