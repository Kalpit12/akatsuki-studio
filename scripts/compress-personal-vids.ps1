# Compress Vishh254 personal videos for fast web delivery.
# Output: kebab-case .mp4 + poster .jpg in public/Personal Vids/

$ErrorActionPreference = "Continue"

function Get-ScaleFilter {
    return "scale='if(gt(iw,ih),min(1280\,iw),-2)':'if(gt(iw,ih),-2,min(1280\,ih))'"
}

function Test-ValidMp4 {
    param([string]$Path)
    if (-not (Test-Path $Path)) { return $false }
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    & ffprobe -v error $Path 2>$null | Out-Null
    $ok = $LASTEXITCODE -eq 0
    $ErrorActionPreference = $prev
    return $ok
}

function Compress-Video {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [bool]$Poster = $false
    )

    if (Test-Path $OutputPath) {
        if (-not (Test-ValidMp4 $OutputPath)) {
            $prev = $ErrorActionPreference
            $ErrorActionPreference = "SilentlyContinue"
            Remove-Item $OutputPath -Force
            $ErrorActionPreference = $prev
        }
    }

    if (Test-ValidMp4 $OutputPath) {
        Write-Host "SKIP (valid): $([IO.Path]::GetFileName($OutputPath))"
        if ($Poster) {
            $posterPath = [IO.Path]::ChangeExtension($OutputPath, ".jpg")
            if (-not (Test-Path $posterPath)) {
                $scale = Get-ScaleFilter
                & ffmpeg -y -ss 00:00:01 -i $OutputPath -vframes 1 -vf $scale -q:v 3 -update 1 $posterPath
            }
        }
        return
    }

    if (-not (Test-Path $InputPath)) {
        Write-Warning "Missing source: $InputPath"
        return
    }

    $scale = Get-ScaleFilter
    $tempPath = "$OutputPath.encoding.mp4"
    if (Test-Path $tempPath) { Remove-Item $tempPath -Force -ErrorAction SilentlyContinue }

    Write-Host "ENCODE: $([IO.Path]::GetFileName($InputPath)) -> $([IO.Path]::GetFileName($OutputPath))"

    & ffmpeg -y -i $InputPath `
        -vf $scale `
        -map 0:v:0 -map 0:a:0? `
        -c:v libx264 -preset veryfast -crf 28 -profile:v high -level 3.1 `
        -pix_fmt yuv420p `
        -c:a aac -b:a 128k -ac 2 `
        -movflags +faststart `
        $tempPath

    if (-not (Test-ValidMp4 $tempPath)) {
        Write-Warning "Encode failed: $OutputPath"
        Remove-Item $tempPath -Force -ErrorAction SilentlyContinue
        return
    }

    if (Test-Path $OutputPath) {
        Remove-Item $OutputPath -Force -ErrorAction SilentlyContinue
    }
    Copy-Item $tempPath $OutputPath -Force
    Remove-Item $tempPath -Force -ErrorAction SilentlyContinue

    if ($Poster) {
        $posterPath = [IO.Path]::ChangeExtension($OutputPath, ".jpg")
        & ffmpeg -y -ss 00:00:01 -i $OutputPath -vframes 1 -vf $scale -q:v 3 -update 1 $posterPath
    }

    $mb = [math]::Round((Get-Item $OutputPath).Length / 1MB, 1)
    Write-Host "DONE: $([IO.Path]::GetFileName($OutputPath)) ($mb MB)"
}

$folder = Join-Path $PSScriptRoot "..\public\Personal Vids"

$items = @(
    @{ src = "AKatsuki Vish  bike.mp4"; out = "vish-bike.mp4"; poster = $true }
    @{ src = "AKatsuki BIke chase BTSmp4.mp4"; out = "bike-chase-bts.mp4"; poster = $true }
    @{ src = "Chase scene.mp4"; out = "chase-scene.mp4"; poster = $true }
    @{ src = "C3073.mp4"; out = "vish-c3073.mp4"; poster = $true }
    @{ src = "Swap merc .mp4"; out = "swap-merc.mp4"; poster = $true }
    @{ src = "Jeep wrangler.mp4"; out = "jeep-wrangler.mp4"; poster = $true }
    @{ src = "gle400d final.mp4"; out = "gle400d.mp4"; poster = $true }
    @{ src = "C9989_1.mp4"; out = "c9989.mp4"; poster = $true }
    @{ src = "11MOTORS G63 REVIEW.mp4"; out = "g63-review.mp4"; poster = $true }
    @{ src = "POCKET CAMERA.mp4"; out = "pocket-camera.mp4"; poster = $true }
    @{ src = "C0251.mp4"; out = "vish-c0251.mp4"; poster = $true }
)

foreach ($item in $items) {
    $input = Join-Path $folder $item.src
    $output = Join-Path $folder $item.out
    Compress-Video -InputPath $input -OutputPath $output -Poster $item.poster
}

Write-Host "Done."
