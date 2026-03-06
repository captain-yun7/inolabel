'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Plus, X, Save } from 'lucide-react'
import { DataTable, Column } from '@/components/admin'
import { useAdminCRUD, useAlert } from '@/lib/hooks'
import styles from '../shared.module.css'

interface ScheduleItem {
  id: number
  title: string
  description: string | null
  unit: 'excel' | 'crew' | null
  eventType: string
  startDatetime: string
  endDatetime: string | null
  location: string | null
  isAllDay: boolean
  color: string | null
  createdAt: string
}

const EVENT_TYPE_OPTIONS = [
  { value: 'broadcast', label: '방송' },
  { value: 'collab', label: '콜라보' },
  { value: 'event', label: '이벤트' },
  { value: 'notice', label: '공지' },
  { value: '休', label: '휴방' },
]

const UNIT_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'excel', label: '엑셀부' },
  { value: 'crew', label: '스타부' },
]

export default function SchedulesPage() {
  const alertHandler = useAlert()

  const {
    items: schedules,
    isLoading,
    isModalOpen,
    isNew,
    editingItem: editingSchedule,
    setEditingItem: setEditingSchedule,
    openAddModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
  } = useAdminCRUD<ScheduleItem>({
    tableName: 'schedules',
    defaultItem: {
      title: '',
      description: null,
      unit: null,
      eventType: 'broadcast',
      startDatetime: new Date().toISOString().slice(0, 16),
      endDatetime: null,
      location: null,
      isAllDay: false,
      color: null,
    },
    orderBy: { column: 'start_datetime', ascending: false },
    fromDbFormat: (row) => ({
      id: row.id as number,
      title: row.title as string,
      description: row.description as string | null,
      unit: row.unit as 'excel' | 'crew' | null,
      eventType: row.event_type as string,
      startDatetime: row.start_datetime as string,
      endDatetime: row.end_datetime as string | null,
      location: row.location as string | null,
      isAllDay: row.is_all_day as boolean,
      color: row.color as string | null,
      createdAt: row.created_at as string,
    }),
    toDbFormat: (item) => ({
      title: item.title,
      description: item.description || null,
      unit: item.unit || null,
      event_type: item.eventType,
      start_datetime: item.startDatetime,
      end_datetime: item.endDatetime || null,
      location: item.location || null,
      is_all_day: item.isAllDay ?? false,
      color: item.color || null,
    }),
    validate: (item) => {
      if (!item.title?.trim()) return '제목을 입력하세요.'
      if (!item.startDatetime) return '시작 일시를 입력하세요.'
      return null
    },
    alertHandler,
  })

  const getEventTypeLabel = (type: string) => {
    return EVENT_TYPE_OPTIONS.find(o => o.value === type)?.label || type
  }

  const formatDatetime = (dt: string | null | undefined) => {
    if (!dt) return '-'
    try {
      return new Date(dt).toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
    } catch { return dt }
  }

  const columns: Column<ScheduleItem>[] = [
    {
      key: 'eventType',
      header: '유형',
      width: '80px',
      render: (item) => (
        <span style={{ fontSize: '0.8rem' }}>{getEventTypeLabel(item.eventType)}</span>
      ),
    },
    {
      key: 'title',
      header: '제목',
      render: (item) => <span style={{ fontWeight: 600 }}>{item.title}</span>,
    },
    {
      key: 'unit',
      header: '소속',
      width: '80px',
      render: (item) => (
        <span style={{ fontSize: '0.8rem' }}>
          {item.unit === 'excel' ? '엑셀부' : item.unit === 'crew' ? '스타부' : '전체'}
        </span>
      ),
    },
    {
      key: 'startDatetime',
      header: '시작일시',
      width: '160px',
      render: (item) => (
        <span style={{ fontSize: '0.8rem' }}>{formatDatetime(item.startDatetime)}</span>
      ),
    },
    {
      key: 'isAllDay',
      header: '종일',
      width: '60px',
      render: (item) => item.isAllDay ? '✓' : '',
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <CalendarDays size={24} />
          <h1>일정 관리</h1>
        </div>
        <button className={styles.addButton} onClick={openAddModal}>
          <Plus size={18} />
          일정 추가
        </button>
      </div>

      <DataTable
        columns={columns}
        data={schedules}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={handleDelete}

      />

      <AnimatePresence>
        {isModalOpen && editingSchedule && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modal}
              style={{ maxWidth: '600px' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>{isNew ? '일정 추가' : '일정 수정'}</h2>
                <button onClick={closeModal} className={styles.closeButton}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>제목 *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingSchedule.title || ''}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, title: e.target.value })}
                    placeholder="일정 제목"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label>일정 유형</label>
                    <select
                      className={styles.input}
                      value={editingSchedule.eventType || 'broadcast'}
                      onChange={(e) => setEditingSchedule({ ...editingSchedule, eventType: e.target.value })}
                    >
                      {EVENT_TYPE_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label>소속</label>
                    <select
                      className={styles.input}
                      value={editingSchedule.unit || ''}
                      onChange={(e) => setEditingSchedule({ ...editingSchedule, unit: e.target.value as 'excel' | 'crew' | null || null })}
                    >
                      {UNIT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label>시작 일시 *</label>
                    <input
                      type="datetime-local"
                      className={styles.input}
                      value={editingSchedule.startDatetime?.slice(0, 16) || ''}
                      onChange={(e) => setEditingSchedule({ ...editingSchedule, startDatetime: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup} style={{ margin: 0 }}>
                    <label>종료 일시</label>
                    <input
                      type="datetime-local"
                      className={styles.input}
                      value={editingSchedule.endDatetime?.slice(0, 16) || ''}
                      onChange={(e) => setEditingSchedule({ ...editingSchedule, endDatetime: e.target.value || null })}
                      disabled={editingSchedule.isAllDay}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={editingSchedule.isAllDay || false}
                      onChange={(e) => setEditingSchedule({
                        ...editingSchedule,
                        isAllDay: e.target.checked,
                        endDatetime: e.target.checked ? null : editingSchedule.endDatetime,
                      })}
                    />
                    종일 일정
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label>장소</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingSchedule.location || ''}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, location: e.target.value || null })}
                    placeholder="장소 (선택)"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>설명</label>
                  <textarea
                    className={styles.input}
                    rows={3}
                    value={editingSchedule.description || ''}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, description: e.target.value || null })}
                    placeholder="일정 설명 (선택)"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>컬러</label>
                  <input
                    type="color"
                    value={editingSchedule.color || '#fd68ba'}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, color: e.target.value })}
                    style={{ width: '60px', height: '36px', padding: '2px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button onClick={closeModal} className={styles.cancelButton}>
                  취소
                </button>
                <button onClick={handleSave} className={styles.saveButton}>
                  <Save size={16} />
                  {isNew ? '추가' : '저장'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
