-- Per-recording settings for record-scenario.lua. Edit `name` (and usually
-- `description`) before each recording session; the rest is per-game.
return {
    -- this recording session
    name = "my-recording",
    description = "",

    -- this game
    game = "Spider-Man 3: Invasion of the Spider-Slayers",
    console = "GB",              -- "GBA" | "GB" | "GBC" | "FDS" | "SMS" | "GG" | "PSX" | "raw"

    -- optional (defaults shown)
    -- memory_domain = nil,       -- BizHawk domain, only for console = "raw"
    -- screenshots = "interval",  -- "interval" | "changes" | "off"
    -- screenshot_interval = 30,  -- frames between screenshots
    -- out_root = nil,            -- default: scenarios/ next to the script
}
