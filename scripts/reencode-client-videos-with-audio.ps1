# Re-encode client page videos with audio for sound playback.
# Overwrites existing compressed copies. Homepage reel cuts can stay muted/no-audio.

$ErrorActionPreference = "Stop"

function Get-ScaleFilter {
    return "scale='if(gt(iw,ih),min(1280\,iw),-2)':'if(gt(iw,ih),-2,min(1280\,ih))'"
}

function Compress-VideoWithAudio {
    param(
        [string]$InputPath,
        [string]$OutputPath
    )

    if (-not (Test-Path $InputPath)) {
        Write-Warning "Missing source: $InputPath"
        return
    }

    $scale = Get-ScaleFilter
    Write-Host "ENCODE+AUDIO: $([IO.Path]::GetFileName($InputPath)) -> $([IO.Path]::GetFileName($OutputPath))"

    & ffmpeg -y -i $InputPath `
        -vf $scale `
        -map 0:v:0 -map 0:a:0? `
        -c:v libx264 -preset veryfast -crf 28 -profile:v high -level 3.1 `
        -pix_fmt yuv420p `
        -c:a aac -b:a 128k -ac 2 `
        -movflags +faststart `
        $OutputPath
}

$jobs = @(
    @{
        dir = "11 Motors"
        items = @(
            @{ src = "Gle53 1.mp4"; out = "11-motors-gle53.mp4" }
            @{ src = "11MOTORS G63 REVIEW.mp4"; out = "11-motors-g63.mp4" }
            @{ src = "CX5 SHADES (Logo).mp4"; out = "11-motors-cx5.mp4" }
            @{ src = "Range Rover Vogue 11 motors.mp4"; out = "11-motors-range-rover.mp4" }
        )
    }
    @{
        dir = "Autobox"
        items = @(
            @{ src = "x6 short .mp4"; out = "autobox-x6.mp4" }
            @{ src = "CROWN V2.mp4"; out = "autobox-crown-v2.mp4" }
            @{ src = "lC30 aUTO.mp4"; out = "autobox-lc30.mp4" }
            @{ src = "Lexus VIP Black .mp4"; out = "autobox-lexus-vip.mp4" }
            @{ src = "Vogue 2023 Autobox.mp4"; out = "autobox-vogue-2023.mp4" }
        )
    }
    @{
        dir = "Connect Coffee"
        items = @(
            @{ src = "Connect Tour (South Korean Guest).mp4 Video 3"; out = "connect-coffee-tour.mp4" }
            @{ src = "Coffee tasting Testimonial .mp4"; out = "connect-coffee-testimonial.mp4" }
        )
    }
    @{
        dir = "Bambino"
        items = @(
            @{ src = "bAMBINO pASTA .mp4"; out = "bambino-pasta.mp4" }
            @{ src = "C0648_1.mp4"; out = "bambino-c0648.mp4" }
            @{ src = "dIFFERENT dISHES bAMBINO.mp4"; out = "bambino-dishes.mp4" }
            @{ src = "ICED COFFEE BAMBINO & MESO.mp4"; out = "bambino-iced-coffee.mp4" }
            @{ src = "tIPSY tHURSDAYS REDONE.mp4"; out = "bambino-tipsy-thursdays.mp4" }
        )
    }
    @{
        dir = "Bao Box"
        items = @(
            @{ src = "bao 1 final.mp4"; out = "bao-box-final.mp4" }
        )
    }
    @{
        dir = "INTI"
        items = @(
            @{ src = "bENTO bOX mp4.mp4"; out = "inti-bento-box.mp4" }
            @{ src = "iNTI sUSHI cHEF eLIAS.mp4"; out = "inti-sushi-chef.mp4" }
        )
    }
    @{
        dir = "Stiltz Lifts"
        items = @(
            @{ src = "Stiltz College.mp4"; out = "stiltz-college.mp4" }
            @{ src = "Stiltz Event .mp4"; out = "stiltz-event.mp4" }
            @{ src = "Stiltz Home 1.mp4"; out = "stiltz-home.mp4" }
        )
    }
    @{
        dir = "Slate"
        items = @(
            @{ src = "lUNCH RESET .mp4"; out = "slate-lunch-reset.mp4" }
            @{ src = "meat video finalmp4.mp4"; out = "slate-meat.mp4" }
            @{ src = "sLATE kITCHEN aND bAR .mp4"; out = "slate-kitchen-bar.mp4" }
        )
    }
    @{
        dir = "Posh Auto Body"
        items = @(
            @{ src = "Defender ppf_1.mp4"; out = "posh-defender-ppf.mp4" }
            @{ src = "Defender Windscreen.mp4"; out = "posh-defender-windscreen.mp4" }
            @{ src = "Final Version 1  Aston .mp4"; out = "posh-aston.mp4" }
            @{ src = "PPF Re Edited Range Rover Sv.mp4"; out = "posh-range-rover-ppf.mp4" }
        )
    }
)

$public = Join-Path $PSScriptRoot "..\public"

foreach ($group in $jobs) {
    $folder = Join-Path $public $group.dir
    foreach ($item in $group.items) {
        $input = Join-Path $folder $item.src
        $output = Join-Path $folder $item.out
        Compress-VideoWithAudio -InputPath $input -OutputPath $output
    }
}

Write-Host "Done."
