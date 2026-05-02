import { Box, Skeleton } from '@mui/material'

interface LoadingStateProps {
  variant: 'left-panel' | 'right-panel'
}

export function LoadingState({ variant }: LoadingStateProps) {
  if (variant === 'left-panel') {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2, mb: 1.5 }} />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 1.5 }} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="70%" />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3, mb: 1.5 }} />
      <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 3, flex: 1 }} />
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 3, flex: 1 }} />
      </Box>
      <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2 }} />
    </Box>
  )
}
