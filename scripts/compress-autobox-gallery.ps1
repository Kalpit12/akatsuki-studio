# Compress Autobox showroom stills for the client page gallery (WebP + thumb srcset)
$ErrorActionPreference = "Stop"
$ffmpeg = "ffmpeg"
$srcDir = Join-Path $PSScriptRoot "..\public\Autobox"
$fullW = 1600
$thumbW = 720
$quality = 82

$sources = @(
  "DSC02331.jpg",
  "DSC02356.jpg",
  "DSC02361.jpg",
  "DSC02366.jpg",
  "DSC02367.jpg",
  "DSC02372.jpg",
  "DSC02891.jpg",
  "DSC02902.jpg",
  "DSC02905.jpg",
  "DSC03203.jpg",
  "DSC03207.jpg",
  "DSC03217.jpg",
  "DSC03229.jpg",
  "DSC03231.jpg",
  "DSC08677.jpg",
  "DSC08681.jpg",
  "DSC08690.jpg",
  "DSC08692.jpg"
)

$i = 1
foreach ($name in $sources) {
  $input = Join-Path $srcDir $name
  if (-not (Test-Path $input)) {
    Write-Warning "Missing source: $name"
    continue
  }

  $num = "{0:D2}" -f $i
  $fullOut = Join-Path $srcDir "autobox-gallery-$num.webp"
  $thumbOut = Join-Path $srcDir "autobox-gallery-$num-thumb.webp"

  Write-Host "[$num] $name"

  & $ffmpeg -hide_banner -loglevel error -y `
    -i $input `
    -vf "scale='min($fullW,iw)':-2" `
    -frames:v 1 -update 1 -q:v $quality `
    $fullOut

  & $ffmpeg -hide_banner -loglevel error -y `
    -i $input `
    -vf "scale='min($thumbW,iw)':-2" `
    -frames:v 1 -update 1 -q:v $quality `
    $thumbOut

  $i++
}

Write-Host "Done. $($i - 1) gallery sets written."
