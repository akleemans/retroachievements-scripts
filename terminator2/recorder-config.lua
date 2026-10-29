-- Per-recording settings for record-scenario.lua. Edit `name` (and usually
-- `description`) before each recording session; the rest is per-game.
return {
    -- this recording session
    name = "level1-finished",
    description = "",

    -- this game
    game = "Terminator 2: Judgment Day",
    console = "GB",              -- "GBA" | "GB" | "GBC" | "FDS" | "SMS" | "GG" | "raw"

    -- optional (defaults shown)
    -- memory_domain = nil,       -- BizHawk domain, only for console = "raw"
    -- screenshots = "interval",  -- "interval" | "changes" | "off"
    -- screenshot_interval = 30,  -- frames between screenshots
    -- out_root = nil,            -- default: scenarios/ next to the script
}
