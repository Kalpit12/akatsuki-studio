# Compress Mara Enkaji stills for the client page gallery (WebP)
$ErrorActionPreference = "Stop"
$ffmpeg = "ffmpeg"
$srcDir = Join-Path $PSScriptRoot "..\public\Mara Enkaji"
$fullW = 1600
$quality = 82

$sources = @(
  "DSC00026.jpg",
  "DSC00042.jpg",
  "DSC00054-2.jpg",
  "DSC09330.jpg",
  "DSC09337.jpg",
  "DSC09341.jpg",
  "DSC09343.jpg",
  "DSC09351.jpg",
  "DSC09361.jpg",
  "DSC09370.jpg",
  "DSC09383.jpg",
  "DSC09402.jpg",
  "DSC09610.jpg",
  "DSC09620-2.jpg",
  "DSC09625-Enhanced-NR.jpg",
  "DSC09652.jpg",
  "DSC09674-Enhanced-NR.jpg",
  "DSC09679-Enhanced-NR.jpg",
  "DSC09690-Enhanced-NR.jpg",
  "DSC09710-Enhanced-NR.jpg",
  "DSC09735-Enhanced-NR.jpg"
)

$i = 1
foreach ($name in $sources) {
  $input = Join-Path $srcDir $name
  if (-not (Test-Path -LiteralPath $input)) {
    Write-Warning "Missing source: $name"
    continue
  }

  $num = "{0:D2}" -f $i
  $fullOut = Join-Path $srcDir "mara-enkaji-gallery-$num.webp"

  Write-Host "[$num] $name"

  & $ffmpeg -hide_banner -loglevel error -y `
    -i $input `
    -vf "scale='min($fullW,iw)':-2" `
    -frames:v 1 -update 1 -q:v $quality `
    $fullOut

  $i++
}

Write-Host "Done. $($i - 1) gallery images written."
