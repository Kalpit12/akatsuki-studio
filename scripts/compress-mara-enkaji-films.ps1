# Compress Mara Enkaji films for web delivery.
# Output: kebab-case .mp4 + poster .jpg in public/Mara Enkaji/

$ErrorActionPreference = "Continue"

function Get-ScaleFilter {
    return "scale='if(gt(iw,ih),min(1280\,iw),-2)':'if(gt(iw,ih),-2,min(1280\,ih))'"
}

function Test-ValidMp4 {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { return $false }
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "SilentlyContinue"
    & ffprobe -v error -LiteralPath $Path 2>$null | Out-Null
    # ffprobe may not accept -LiteralPath; fall back to positional
    if ($LASTEXITCODE -ne 0) {
        & ffprobe -v error $Path 2>$null | Out-Null
    }
    $ok = $LASTEXITCODE -eq 0
    $ErrorActionPreference = $prev
    return $ok
}

function Compress-Video {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [bool]$Poster = $true
    )

    if (Test-Path -LiteralPath $OutputPath) {
        if (-not (Test-ValidMp4 $OutputPath)) {
            Remove-Item -LiteralPath $OutputPath -Force -ErrorAction SilentlyContinue
        }
    }

    if (Test-ValidMp4 $OutputPath) {
        Write-Host "SKIP (valid): $([IO.Path]::GetFileName($OutputPath))"
        if ($Poster) {
            $posterPath = [IO.Path]::ChangeExtension($OutputPath, ".jpg")
            if (-not (Test-Path -LiteralPath $posterPath)) {
                $scale = Get-ScaleFilter
                & ffmpeg -y -ss 00:00:01 -i $OutputPath -vframes 1 -vf $scale -q:v 3 -update 1 $posterPath
            }
        }
        return
    }

    if (-not (Test-Path -LiteralPath $InputPath)) {
        Write-Warning "Missing source: $InputPath"
        return
    }

    $scale = Get-ScaleFilter
    $tempPath = "$OutputPath.encoding.mp4"
    if (Test-Path -LiteralPath $tempPath) {
        Remove-Item -LiteralPath $tempPath -Force -ErrorAction SilentlyContinue
    }

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
        Remove-Item -LiteralPath $tempPath -Force -ErrorAction SilentlyContinue
        return
    }

    if (Test-Path -LiteralPath $OutputPath) {
        Remove-Item -LiteralPath $OutputPath -Force -ErrorAction SilentlyContinue
    }
    Copy-Item -LiteralPath $tempPath -Destination $OutputPath -Force
    Remove-Item -LiteralPath $tempPath -Force -ErrorAction SilentlyContinue

    if ($Poster) {
        $posterPath = [IO.Path]::ChangeExtension($OutputPath, ".jpg")
        & ffmpeg -y -ss 00:00:01 -i $OutputPath -vframes 1 -vf $scale -q:v 3 -update 1 $posterPath
    }

    $mb = [math]::Round((Get-Item -LiteralPath $OutputPath).Length / 1MB, 1)
    Write-Host "DONE: $([IO.Path]::GetFileName($OutputPath)) ($mb MB)"
}

$folder = Join-Path $PSScriptRoot "..\public\Mara Enkaji"

$items = @(
    @{ src = "NIGHTS MARA.mp4"; out = "mara-enkaji-nights.mp4" }
    @{ src = "BUSH BREAKFAST.mp4"; out = "mara-enkaji-bush-breakfast.mp4" }
    @{ src = "LUNCH.mp4"; out = "mara-enkaji-lunch.mp4" }
    @{ src = "drink mara1.mp4"; out = "mara-enkaji-drink.mp4" }
    @{ src = "River Walk Enkaji  (1).mp4"; out = "mara-enkaji-river-walk.mp4" }
    @{ src = "room c5 .mp4"; out = "mara-enkaji-room-c5.mp4" }
)

foreach ($item in $items) {
    $input = Join-Path $folder $item.src
    $output = Join-Path $folder $item.out
    Compress-Video -InputPath $input -OutputPath $output -Poster $true
}

Write-Host "Done."
