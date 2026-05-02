import { useState } from "react";
import { Box, Tabs, Tab, Typography, Badge, Button } from "@mui/material";
import { LogSheetHeader } from "./LogSheetHeader";
import { LogCanvas } from "./LogCanvas";
import type { DailyLog } from "@/types/trip";

interface ELDLogSheetProps {
  dailyLogs: DailyLog[];
}

export function ELDLogSheet({ dailyLogs }: ELDLogSheetProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const currentLog = dailyLogs[selectedDay];

  function handlePrintAll() {
    window.print();
  }

  return (
    <Box sx={{ p: 2, pt: 0 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, px: 0 }}
      >
        <Typography variant="caption" color="text.secondary">
          Daily ELD Logs
        </Typography>
        <Badge
          badgeContent={dailyLogs.length}
          color="primary"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.625rem",
              height: 16,
              minWidth: 16,
            },
          }}
        />
      </Box>

      <Tabs
        value={selectedDay}
        onChange={(_, v) => setSelectedDay(v as number)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 1.5,
          minHeight: 36,
          "& .MuiTab-root": { minHeight: 36, py: 0.5 },
          "& .MuiTabs-indicator": { bgcolor: "primary.main" },
        }}
      >
        {dailyLogs.map((log) => (
          <Tab key={log.date} label={`Day ${log.day_number}`} />
        ))}
      </Tabs>

      {currentLog && (
        <Box
          sx={{
            bgcolor: "#FAFAF5",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <LogSheetHeader log={currentLog} />
          <LogCanvas log={currentLog} />
        </Box>
      )}

      <Button
        variant="outlined"
        fullWidth
        onClick={handlePrintAll}
        sx={{ mt: 2, color: "primary.main", borderColor: "primary.main" }}
      >
        Print All Logs
      </Button>
    </Box>
  );
}
