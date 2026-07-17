# Compress Craydel EdTech films for fast web delivery (vertical 4K -> 720p portrait).

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
        [int]$Crf = 29,
        [bool]$Poster = $true
    )

    if (Test-ValidMp4 $OutputPath) {
        $mb = [math]::Round((Get-Item $OutputPath).Length / 1MB, 1)
        Write-Host "SKIP (valid): $([IO.Path]::GetFileName($OutputPath)) ($mb MB)"
        return
    }

    if (-not (Test-Path $InputPath)) {
        Write-Warning "Missing source: $InputPath"
        return
    }

    $scale = Get-ScaleFilter
    $tempPath = "$OutputPath.encoding.mp4"
    if (Test-Path $tempPath) { Remove-Item $tempPath -Force -ErrorAction SilentlyContinue }

    Write-Host "ENCODE: $([IO.Path]::GetFileName($InputPath)) -> $([IO.Path]::GetFileName($OutputPath)) (crf $Crf)"

    & ffmpeg -y -i $InputPath `
        -vf $scale `
        -map 0:v:0 -map 0:a:0? `
        -c:v libx264 -preset veryfast -crf $Crf -profile:v high -pix_fmt yuv420p `
        -c:a aac -b:a 96k -ac 2 `
        -movflags +faststart `
        $tempPath

    if (-not (Test-ValidMp4 $tempPath)) {
        Write-Warning "Encode failed: $OutputPath"
        Remove-Item $tempPath -Force -ErrorAction SilentlyContinue
        return
    }

    if (Test-Path $OutputPath) { Remove-Item $OutputPath -Force -ErrorAction SilentlyContinue }
    Move-Item $tempPath $OutputPath -Force

    if ($Poster) {
        $posterPath = [IO.Path]::ChangeExtension($OutputPath, ".jpg")
        & ffmpeg -y -ss 00:00:01 -i $OutputPath -vframes 1 -q:v 3 -update 1 $posterPath
    }

    $mb = [math]::Round((Get-Item $OutputPath).Length / 1MB, 1)
    Write-Host "DONE: $([IO.Path]::GetFileName($OutputPath)) ($mb MB)"
}

$folder = Join-Path $PSScriptRoot "..\public\Craydel"

$items = @(
    @{
        src = "DAN SCHOLARSHIP.mp4"
        out = "craydel-dan-scholarship.mp4"
        crf = 29
    }
    @{
        src = "EMI PROGRAMMES.mp4"
        out = "craydel-emi-programmes.mp4"
        crf = 29
    }
)

foreach ($item in $items) {
    $input = Join-Path $folder $item.src
    $output = Join-Path $folder $item.out
    Compress-Video -InputPath $input -OutputPath $output -Crf $item.crf
}

Write-Host "Done."
