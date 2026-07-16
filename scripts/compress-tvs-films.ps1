# Compress TVS case-study films (~10 MB each) for fast web playback.
# Uses veryfast preset + CRF (faster than medium + bitrate; avoids long faststart stalls).

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

function Get-FileMB {
    param([string]$Path)
    return [math]::Round((Get-Item $Path).Length / 1MB, 1)
}

function Compress-Video {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$TargetMB = 10,
        [int]$Crf = 28
    )

    if (Test-ValidMp4 $OutputPath) {
        Write-Host "SKIP (valid): $([IO.Path]::GetFileName($OutputPath)) ($(Get-FileMB $OutputPath) MB)"
        return
    }

    if (-not (Test-Path $InputPath)) {
        Write-Warning "Missing source: $InputPath"
        return
    }

    $scale = Get-ScaleFilter
    $tempPath = "$OutputPath.encoding.mp4"
    if (Test-Path $tempPath) { Remove-Item $tempPath -Force -ErrorAction SilentlyContinue }

    Write-Host "ENCODE: $([IO.Path]::GetFileName($InputPath)) -> $([IO.Path]::GetFileName($OutputPath)) (crf $Crf, target ~${TargetMB}MB)"

    # Encode without faststart first (faststart second pass can look hung on long clips).
    & ffmpeg -nostats -loglevel error -y -i $InputPath `
        -vf $scale `
        -map 0:v:0 -map 0:a:0? `
        -c:v libx264 -preset veryfast -crf $Crf -profile:v high -pix_fmt yuv420p `
        -c:a aac -b:a 64k -ac 2 `
        $tempPath

    if (-not (Test-ValidMp4 $tempPath)) {
        Write-Warning "Encode failed: $OutputPath"
        Remove-Item $tempPath -Force -ErrorAction SilentlyContinue
        return
    }

    $mb = Get-FileMB $tempPath
    if ($mb -gt ($TargetMB + 2)) {
        Write-Host "  Re-encode with higher CRF ($($Crf + 2)) — was ${mb}MB"
        Remove-Item $tempPath -Force -ErrorAction SilentlyContinue
        & ffmpeg -nostats -loglevel error -y -i $InputPath `
            -vf $scale `
            -map 0:v:0 -map 0:a:0? `
            -c:v libx264 -preset veryfast -crf $($Crf + 2) -profile:v high -pix_fmt yuv420p `
            -c:a aac -b:a 64k -ac 2 `
            $tempPath
        $mb = Get-FileMB $tempPath
    }

    Write-Host "  faststart..."
    if (Test-Path $OutputPath) { Remove-Item $OutputPath -Force -ErrorAction SilentlyContinue }
    & ffmpeg -nostats -loglevel error -y -i $tempPath -c copy -movflags +faststart $OutputPath
    Remove-Item $tempPath -Force -ErrorAction SilentlyContinue

    if (-not (Test-ValidMp4 $OutputPath)) {
        Write-Warning "faststart failed: $OutputPath"
        return
    }

    $posterPath = [IO.Path]::ChangeExtension($OutputPath, ".jpg")
    & ffmpeg -nostats -loglevel error -y -ss 00:00:01 -i $OutputPath -vframes 1 -q:v 3 -update 1 $posterPath

    Write-Host "DONE: $([IO.Path]::GetFileName($OutputPath)) ($(Get-FileMB $OutputPath) MB)"
}

$folder = Join-Path $PSScriptRoot "..\public\TVS"

$items = @(
    @{ src = "tvs meru day.mp4"; out = "tvs-meru-day.mp4" }
    @{ src = "TVS MT SATURDAY.mp4"; out = "tvs-mt-saturday.mp4" }
    @{ src = "MEA AWARDS 2 REVIEW VERSION.mp4"; out = "tvs-mea-awards.mp4" }
    @{ src = "motor show tiktok linked in fb .mp4"; out = "tvs-motor-show.mp4"; crf = 30 }
)

foreach ($item in $items) {
    $input = Join-Path $folder $item.src
    $output = Join-Path $folder $item.out
    $crf = if ($item.crf) { $item.crf } else { 28 }
    Compress-Video -InputPath $input -OutputPath $output -TargetMB 10 -Crf $crf
}

Write-Host "Done."
