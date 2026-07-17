# Compress Kyra studio stills for the work page gallery (WebP + thumb srcset)
$ErrorActionPreference = "Stop"
$ffmpeg = "ffmpeg"
$srcDir = Join-Path $PSScriptRoot "..\public\Kyra"
$fullW = 1600
$thumbW = 720
$quality = 82

$sources = @(
  "DSC00215.jpg",
  "DSC00231.jpg",
  "DSC00234.jpg",
  "DSC03186.jpg",
  "DSC03191.jpg",
  "DSC03202-2.jpg",
  "DSC03206.jpg",
  "DSC03218.jpg",
  "DSC03234.jpg",
  "DSC08967.jpg",
  "DSC08973.jpg",
  "DSC08995.jpg",
  "DSC09002-2.jpg",
  "DSC09006.jpg"
)

$i = 1
foreach ($name in $sources) {
  $input = Join-Path $srcDir $name
  if (-not (Test-Path $input)) {
    Write-Warning "Missing source: $name"
    continue
  }

  $num = "{0:D2}" -f $i
  $fullOut = Join-Path $srcDir "kyra-gallery-$num.webp"
  $thumbOut = Join-Path $srcDir "kyra-gallery-$num-thumb.webp"

  Write-Host "[$num] $name -> kyra-gallery-$num.webp"

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

Write-Host "Done. $($i - 1) gallery sets written to $srcDir"
