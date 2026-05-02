import { Snackbar, Alert } from '@mui/material'

interface ErrorSnackbarProps {
  error: string | null
  onClose: () => void
}

export function ErrorSnackbar({ error, onClose }: ErrorSnackbarProps) {
  return (
    <Snackbar
      open={Boolean(error)}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert severity="error" variant="filled" onClose={onClose}>
        {error}
      </Alert>
    </Snackbar>
  )
}
