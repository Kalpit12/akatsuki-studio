# Compress studio reel videos for fast web delivery.
# Output: kebab-case .mp4 + poster .jpg alongside sources in each client folder.

$ErrorActionPreference = "Stop"

function Get-ScaleFilter {
    return "scale='if(gt(iw,ih),min(1280\,iw),-2)':'if(gt(iw,ih),-2,min(1280\,ih))'"
}

function Compress-Video {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [string]$PosterPath
    )

    if (Test-Path $OutputPath) {
        Write-Host "SKIP (exists): $OutputPath"
        return
    }

    $scale = Get-ScaleFilter
    Write-Host "ENCODE: $([IO.Path]::GetFileName($InputPath)) -> $([IO.Path]::GetFileName($OutputPath))"

    & ffmpeg -y -i $InputPath `
        -vf $scale `
        -c:v libx264 -preset veryfast -crf 28 -profile:v high -level 3.1 `
        -pix_fmt yuv420p -movflags +faststart -an `
        $OutputPath

    if ($PosterPath) {
        & ffmpeg -y -ss 00:00:01 -i $InputPath -vframes 1 -vf $scale -q:v 3 -update 1 $PosterPath
    }
}

$jobs = @(
    @{
        dir = "Connect Coffee"
        items = @(
            @{ src = "Connect Tour (South Korean Guest).mp4 Video 3"; out = "connect-coffee-tour.mp4"; poster = $true }
            @{ src = "Coffee tasting Testimonial .mp4"; out = "connect-coffee-testimonial.mp4"; poster = $false }
        )
    }
    @{
        dir = "Autobox"
        items = @(
            @{ src = "x6 short .mp4"; out = "autobox-x6.mp4"; poster = $true }
            @{ src = "CROWN V2.mp4"; out = "autobox-crown-v2.mp4"; poster = $false }
            @{ src = "lC30 aUTO.mp4"; out = "autobox-lc30.mp4"; poster = $false }
            @{ src = "Lexus VIP Black .mp4"; out = "autobox-lexus-vip.mp4"; poster = $false }
            @{ src = "Vogue 2023 Autobox.mp4"; out = "autobox-vogue-2023.mp4"; poster = $false }
        )
    }
    @{
        dir = "BTS Vids"
        items = @(
            @{ src = "Suction Dont know  (1).mp4"; out = "bts-suction.mp4"; poster = $true }
            @{ src = "Airball.mp4"; out = "bts-airball.mp4"; poster = $false }
            @{ src = "Akatsuki AUtobox.mp4"; out = "bts-akatsuki-autobox.mp4"; poster = $false }
            @{ src = "C1295_2.mp4"; out = "bts-c1295.mp4"; poster = $false }
            @{ src = "Rollers m8 .mp4"; out = "bts-rollers-m8.mp4"; poster = $false }
        )
    }
    @{
        dir = "11 Motors"
        items = @(
            @{ src = "Gle53 1.mp4"; out = "11-motors-gle53.mp4"; poster = $true }
            @{ src = "11MOTORS G63 REVIEW.mp4"; out = "11-motors-g63.mp4"; poster = $false }
            @{ src = "CX5 SHADES (Logo).mp4"; out = "11-motors-cx5.mp4"; poster = $false }
            @{ src = "Range Rover Vogue 11 motors.mp4"; out = "11-motors-range-rover.mp4"; poster = $false }
        )
    }
)

$public = Join-Path $PSScriptRoot "..\public"

foreach ($group in $jobs) {
    $folder = Join-Path $public $group.dir
    foreach ($item in $group.items) {
        $input = Join-Path $folder $item.src
        $output = Join-Path $folder $item.out
        $poster = if ($item.poster) { [IO.Path]::ChangeExtension($output, ".jpg") } else { $null }
        if (-not (Test-Path $input)) {
            Write-Warning "Missing source: $input"
            continue
        }
        Compress-Video -InputPath $input -OutputPath $output -PosterPath $poster
    }
}

Write-Host "Done."
