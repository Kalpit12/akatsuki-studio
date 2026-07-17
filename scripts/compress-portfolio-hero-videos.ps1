# Re-encode portfolio hero / cover videos for high-quality web delivery (~25 MB budget).
# Matches the Vishh254 / Autobox hero treatment: 1080p, two-pass x264, AAC audio.

$ErrorActionPreference = "Continue"

$TargetMB = 25
$AudioKbps = 128
$MinVideoKbps = 300
$MaxVideoKbps = 8000

function Get-VideoDuration {
    param([string]$Path)
    $d = & ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $Path 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($d)) { return 0 }
    return [double]$d
}

function Get-VideoSize {
    param([string]$Path)
    $line = & ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 $Path 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($line)) { return $null }
    $parts = $line -split ","
    return @{ Width = [int]$parts[0]; Height = [int]$parts[1] }
}

function Test-SkipHero {
    param([string]$Path)

    if (-not (Test-Path $Path)) { return $false }

    $mb = (Get-Item $Path).Length / 1MB
    if ($mb -lt 18) { return $false }

    $size = Get-VideoSize $Path
    if (-not $size) { return $false }

    $shortSide = [Math]::Min($size.Width, $size.Height)
    return $shortSide -ge 1080
}

function Get-ScaleVf {
    param([string]$Path)

    $size = Get-VideoSize $Path
    if (-not $size) {
        return "scale='if(gt(iw,ih),min(1920\,iw),-2)':'if(gt(iw,ih),-2,min(1080\,ih))'"
    }

    if ($size.Width -ge $size.Height) {
        return "scale='min(1920,iw)':-2"
    }

    return "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2"
}

function Get-TargetVideoKbps {
    param([double]$DurationSec)

    if ($DurationSec -le 0) { return $MaxVideoKbps }

    $targetBits = ($TargetMB * 1024 * 1024 * 8) * 0.93
    $totalKbps = [int]($targetBits / $DurationSec / 1000)
    $videoKbps = $totalKbps - $AudioKbps
    return [Math]::Max($MinVideoKbps, [Math]::Min($MaxVideoKbps, $videoKbps))
}

function Encode-HeroVideo {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [switch]$Force
    )

    if (-not (Test-Path $InputPath)) {
        Write-Warning "Missing source: $InputPath"
        return
    }

    if (-not $Force -and (Test-SkipHero $OutputPath)) {
        $mb = [math]::Round((Get-Item $OutputPath).Length / 1MB, 1)
        Write-Host "SKIP (already high quality): $([IO.Path]::GetFileName($OutputPath)) ($mb MB)"
        return
    }

    $duration = Get-VideoDuration $InputPath
    $videoKbps = Get-TargetVideoKbps $duration
    $maxrate = [int]($videoKbps * 1.45)
    $bufsize = [int]($videoKbps * 2)
    $vf = Get-ScaleVf $InputPath
    $posterPath = [IO.Path]::ChangeExtension($OutputPath, ".jpg")
    $tempOut = "$OutputPath.hero-encoding.mp4"
    $passlog = [IO.Path]::Combine([IO.Path]::GetDirectoryName($OutputPath), [IO.Path]::GetFileNameWithoutExtension($OutputPath))

    if (Test-Path $tempOut) { Remove-Item $tempOut -Force -ErrorAction SilentlyContinue }
    Get-ChildItem "$passlog-*.log*" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
    Get-ChildItem "ffmpeg2pass-0.log*" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

    Write-Host "ENCODE: $([IO.Path]::GetFileName($InputPath)) -> $([IO.Path]::GetFileName($OutputPath)) (${videoKbps}k, ~$([math]::Round($duration, 1))s)"

    & ffmpeg -hide_banner -loglevel error -y -i $InputPath `
        -vf $vf -an `
        -c:v libx264 -preset medium -b:v "${videoKbps}k" -maxrate "${maxrate}k" -bufsize "${bufsize}k" `
        -pass 1 -passlogfile $passlog `
        -f null NUL

    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Pass 1 failed: $OutputPath"
        return
    }

    & ffmpeg -hide_banner -loglevel error -y -i $InputPath `
        -vf $vf `
        -map 0:v:0 -map 0:a:0? `
        -c:v libx264 -preset medium -b:v "${videoKbps}k" -maxrate "${maxrate}k" -bufsize "${bufsize}k" `
        -pass 2 -passlogfile $passlog `
        -profile:v high -level 4.2 -pix_fmt yuv420p `
        -c:a aac -b:a "${AudioKbps}k" -ac 2 `
        -movflags +faststart `
        $tempOut

    Get-ChildItem "$passlog-*.log*" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
    Get-ChildItem "ffmpeg2pass-0.log*" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tempOut)) {
        Write-Warning "Pass 2 failed: $OutputPath"
        Remove-Item $tempOut -Force -ErrorAction SilentlyContinue
        return
    }

    if (Test-Path $OutputPath) { Remove-Item $OutputPath -Force -ErrorAction SilentlyContinue }
    Move-Item $tempOut $OutputPath -Force

    & ffmpeg -hide_banner -loglevel error -y -ss 00:00:01 -i $InputPath -vframes 1 -vf $vf -q:v 2 -update 1 $posterPath

    $mb = [math]::Round((Get-Item $OutputPath).Length / 1MB, 2)
    $res = Get-VideoSize $OutputPath
    Write-Host "DONE: $([IO.Path]::GetFileName($OutputPath)) ($mb MB, $($res.Width)x$($res.Height))"
}

$public = Join-Path $PSScriptRoot "..\public"

$heroes = @(
    @{ folder = "11 Motors"; src = "Range Rover Vogue 11 motors.mp4"; out = "11-motors-range-rover.mp4" }
    @{ folder = "Autobox"; src = "RR Main Vid.mp4"; out = "autobox-rr-main.mp4"; skipIfGood = $true }
    @{ folder = "Connect Coffee"; src = "connect-coffee-tour.mp4"; out = "connect-coffee-tour.mp4"; inPlace = $true }
    @{ folder = "Bambino"; src = "bAMBINO pASTA .mp4"; out = "bambino-pasta.mp4" }
    @{ folder = "Bao Box"; src = "bao 1 final.mp4"; out = "bao-box-final.mp4" }
    @{ folder = "INTI"; src = "iNTI sUSHI cHEF eLIAS.mp4"; out = "inti-sushi-chef.mp4" }
    @{ folder = "Stiltz Lifts"; src = "Stiltz College.mp4"; out = "stiltz-college.mp4" }
    @{ folder = "Slate"; src = "meat video finalmp4.mp4"; out = "slate-meat.mp4" }
    @{ folder = "Posh Auto Body"; src = "Defender ppf_1.mp4"; out = "posh-defender-ppf.mp4" }
    @{ folder = ""; src = "huawei-about.mp4"; out = "huawei-about.mp4"; inPlace = $true }
    @{ folder = "Craydel"; src = "DAN SCHOLARSHIP.mp4"; out = "craydel-dan-scholarship.mp4" }
    @{ folder = ""; src = "durham-x-radhika.mp4"; out = "durham-x-radhika.mp4"; inPlace = $true }
    @{ folder = "Kyra"; src = "Urus .mp4"; out = "kyra-urus.mp4" }
    @{ folder = "TVS"; src = "TVS MT SATURDAY.mp4"; out = "tvs-mt-saturday.mp4" }
    @{ folder = "Macaash"; src = "Macaash Cover.mp4"; out = "macaash-cover.mp4" }
    @{ folder = "Personal Vids"; src = "Insta on .mp4"; out = "insta-on.mp4"; skipIfGood = $true }
)

foreach ($hero in $heroes) {
    $folder = if ($hero.folder) { Join-Path $public $hero.folder } else { $public }
    $input = Join-Path $folder $hero.src
    $output = Join-Path $folder $hero.out

    if ($hero.inPlace) {
        $staging = Join-Path $folder ([IO.Path]::GetFileNameWithoutExtension($hero.out) + ".hero-source.mp4")
        if ($hero.src -eq $hero.out -and (Test-Path $input)) {
            if (-not (Test-Path $staging)) {
                Copy-Item $input $staging -Force
            }
            $input = $staging
        }
    }

    if ($hero.skipIfGood -and (Test-SkipHero $output)) {
        $mb = [math]::Round((Get-Item $output).Length / 1MB, 1)
        Write-Host "SKIP (already high quality): $($hero.out) ($mb MB)"
        continue
    }

    Encode-HeroVideo -InputPath $input -OutputPath $output
}

Write-Host "All portfolio hero encodes finished."
