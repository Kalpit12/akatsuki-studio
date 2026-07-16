# Generate poster JPGs for compressed client videos missing a matching .jpg

$ErrorActionPreference = "Stop"
$scale = "scale='if(gt(iw,ih),min(1280\,iw),-2)':'if(gt(iw,ih),-2,min(1280\,ih))'"
$public = Join-Path $PSScriptRoot "..\public"

$folders = @(
    "11 Motors", "Autobox", "Connect Coffee", "Bambino", "Bao Box",
    "INTI", "Stiltz Lifts", "Slate", "Posh Auto Body"
)

foreach ($dir in $folders) {
    $folder = Join-Path $public $dir
    if (-not (Test-Path $folder)) { continue }

    Get-ChildItem $folder -Filter "*.mp4" | Where-Object {
        $_.Name -match '^[a-z0-9].*\.mp4$'
    } | ForEach-Object {
        $poster = [IO.Path]::ChangeExtension($_.FullName, ".jpg")
        if (Test-Path $poster) {
            Write-Host "SKIP poster: $($_.Name)"
            return
        }
        Write-Host "POSTER: $($_.Name)"
        & ffmpeg -y -ss 00:00:01 -i $_.FullName -vframes 1 -vf $scale -q:v 3 -update 1 $poster
    }
}

Write-Host "Done."
