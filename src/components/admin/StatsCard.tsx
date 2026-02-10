'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Paper, ThemeIcon, Text, Group, Stack, Badge } from '@mantine/core'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  color?: 'primary' | 'success' | 'warning' | 'info'
  delay?: number
}

const colorMap = {
  primary: { bg: 'pink', iconColor: 'pink' },
  success: { bg: 'green', iconColor: 'green' },
  warning: { bg: 'yellow', iconColor: 'yellow' },
  info: { bg: 'cyan', iconColor: 'cyan' },
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color = 'primary',
  delay = 0,
}: StatsCardProps) {
  const colorConfig = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Paper
        withBorder
        p="lg"
        radius="md"
        style={{
          transition: 'all 0.2s ease',
          cursor: 'default',
        }}
        styles={{
          root: {
            '&:hover': {
              borderColor: 'var(--mantine-color-pink-5)',
              transform: 'translateY(-2px)',
            },
          },
        }}
      >
        <Group align="flex-start" gap="md">
          <ThemeIcon
            size={48}
            radius="md"
            variant="light"
            color={colorConfig.iconColor}
          >
            <Icon size={24} />
          </ThemeIcon>

          <Stack gap={4} style={{ flex: 1 }}>
            <Text size="sm" c="dimmed">
              {title}
            </Text>
            <Text size="xl" fw={700}>
              {value}
            </Text>
            {change !== undefined && (
              <Badge
                size="sm"
                variant="light"
                color={change >= 0 ? 'green' : 'red'}
              >
                {change >= 0 ? '+' : ''}{change}%
              </Badge>
            )}
          </Stack>
        </Group>
      </Paper>
    </motion.div>
  )
}
