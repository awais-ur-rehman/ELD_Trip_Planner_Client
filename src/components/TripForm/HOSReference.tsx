import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { HOS_RULES } from '@/constants/hos'

export function HOSReference() {
  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '10px !important',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="body2" fontWeight={500}>
          HOS Rules Quick Reference
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {HOS_RULES.map((rule) => (
            <Chip
              key={rule.label}
              label={rule.label}
              variant="outlined"
              size="small"
              sx={{ borderColor: 'divider', color: 'text.secondary' }}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
