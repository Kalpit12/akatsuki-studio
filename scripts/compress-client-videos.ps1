# Compress client page videos for fast web delivery.
# Output: kebab-case .mp4 + poster .jpg alongside sources in each client folder.

$ErrorActionPreference = "Stop"

function Get-ScaleFilter {
    return "scale='if(gt(iw,ih),min(1280\,iw),-2)':'if(gt(iw,ih),-2,min(1280\,ih))'"
}

function Compress-Video {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [bool]$Poster = $false
    )

    if (Test-Path $OutputPath) {
        Write-Host "SKIP (exists): $OutputPath"
        return
    }

    if (-not (Test-Path $InputPath)) {
        Write-Warning "Missing source: $InputPath"
        return
    }

    $scale = Get-ScaleFilter
    Write-Host "ENCODE: $([IO.Path]::GetFileName($InputPath)) -> $([IO.Path]::GetFileName($OutputPath))"

    & ffmpeg -y -i $InputPath `
        -vf $scale `
        -map 0:v:0 -map 0:a:0? `
        -c:v libx264 -preset veryfast -crf 28 -profile:v high -level 3.1 `
        -pix_fmt yuv420p `
        -c:a aac -b:a 128k -ac 2 `
        -movflags +faststart `
        $OutputPath

    if ($Poster) {
        $posterPath = [IO.Path]::ChangeExtension($OutputPath, ".jpg")
        & ffmpeg -y -ss 00:00:01 -i $InputPath -vframes 1 -vf $scale -q:v 3 -update 1 $posterPath
    }
}

$jobs = @(
    @{
        dir = "Bambino"
        items = @(
            @{ src = "bAMBINO pASTA .mp4"; out = "bambino-pasta.mp4"; poster = $true }
            @{ src = "C0648_1.mp4"; out = "bambino-c0648.mp4"; poster = $false }
            @{ src = "dIFFERENT dISHES bAMBINO.mp4"; out = "bambino-dishes.mp4"; poster = $false }
            @{ src = "ICED COFFEE BAMBINO & MESO.mp4"; out = "bambino-iced-coffee.mp4"; poster = $false }
            @{ src = "tIPSY tHURSDAYS REDONE.mp4"; out = "bambino-tipsy-thursdays.mp4"; poster = $false }
        )
    }
    @{
        dir = "Bao Box"
        items = @(
            @{ src = "bao 1 final.mp4"; out = "bao-box-final.mp4"; poster = $true }
        )
    }
    @{
        dir = "INTI"
        items = @(
            @{ src = "bENTO bOX mp4.mp4"; out = "inti-bento-box.mp4"; poster = $true }
            @{ src = "iNTI sUSHI cHEF eLIAS.mp4"; out = "inti-sushi-chef.mp4"; poster = $false }
        )
    }
    @{
        dir = "Stiltz Lifts"
        items = @(
            @{ src = "Stiltz College.mp4"; out = "stiltz-college.mp4"; poster = $true }
            @{ src = "Stiltz Event .mp4"; out = "stiltz-event.mp4"; poster = $false }
            @{ src = "Stiltz Home 1.mp4"; out = "stiltz-home.mp4"; poster = $false }
        )
    }
    @{
        dir = "Slate"
        items = @(
            @{ src = "lUNCH RESET .mp4"; out = "slate-lunch-reset.mp4"; poster = $true }
            @{ src = "meat video finalmp4.mp4"; out = "slate-meat.mp4"; poster = $false }
            @{ src = "sLATE kITCHEN aND bAR .mp4"; out = "slate-kitchen-bar.mp4"; poster = $false }
        )
    }
    @{
        dir = "Posh Auto Body"
        items = @(
            @{ src = "Defender ppf_1.mp4"; out = "posh-defender-ppf.mp4"; poster = $true }
            @{ src = "Defender Windscreen.mp4"; out = "posh-defender-windscreen.mp4"; poster = $false }
            @{ src = "Final Version 1  Aston .mp4"; out = "posh-aston.mp4"; poster = $false }
            @{ src = "PPF Re Edited Range Rover Sv.mp4"; out = "posh-range-rover-ppf.mp4"; poster = $false }
        )
    }
)

$public = Join-Path $PSScriptRoot "..\public"

foreach ($group in $jobs) {
    $folder = Join-Path $public $group.dir
    foreach ($item in $group.items) {
        $input = Join-Path $folder $item.src
        $output = Join-Path $folder $item.out
        Compress-Video -InputPath $input -OutputPath $output -Poster $item.poster
    }
}

Write-Host "Done."
