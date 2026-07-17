# Compress service source PNGs in public/ to web-optimized WebP in public/services/.
# Source PNGs stay gitignored; commit only the .webp outputs.

$ErrorActionPreference = "Stop"

$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpeg) {
  Write-Error "ffmpeg not found on PATH"
}

$pub = Join-Path $PSScriptRoot "..\public"
$svc = Join-Path $pub "services"

$pairs = @(
  @{ src = "Creative campaign.png"; out = "creative-campaigns.webp" },
  @{ src = "Commerical Production.png"; out = "commercial-production.webp" },
  @{ src = "Cinematic content.png"; out = "cinematic-content.webp" },
  @{ src = "SEO & Digital Growth.png"; out = "seo-digital-growth.webp" },
  @{ src = "Social Media Management.png"; out = "social-media-management.webp" },
  @{ src = "Event coverage.png"; out = "event-coverage.webp" },
  @{ src = "Website design.png"; out = "website-design.webp" }
)

New-Item -ItemType Directory -Force -Path $svc | Out-Null

foreach ($p in $pairs) {
  $in = Join-Path $pub $p.src
  $out = Join-Path $svc $p.out
  if (-not (Test-Path $in)) {
    Write-Warning "Skip missing source: $($p.src)"
    continue
  }
  Write-Host "[$($p.out)] from $($p.src)"
  & ffmpeg -y -hide_banner -loglevel error -i $in `
    -vf "scale='min(1600,iw)':-2:flags=lanczos" `
    -c:v libwebp -quality 80 -compression_level 6 $out
}

Get-ChildItem $svc -Filter "*.webp" | ForEach-Object {
  Write-Host ("  {0,-32} {1,6:N0} KB" -f $_.Name, ($_.Length / 1KB))
}
