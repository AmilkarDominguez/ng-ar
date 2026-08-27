<#
  Generates placeholder HUD-style PNG assets for the AR business card into
  public/ar/. These are throwaway stand-ins so the scene renders end-to-end
  before real art exists - replace each file with final artwork (see
  public/ar/README.md) keeping the same filename.

  Windows PowerShell 5.1 + System.Drawing (GDI+). Run:
    powershell -ExecutionPolicy Bypass -File scripts/generate-ar-placeholders.ps1
#>

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root 'public\ar'
New-Item -ItemType Directory -Force -Path $out | Out-Null

$Cyan     = [System.Drawing.Color]::FromArgb(255, 0, 255, 204)
$CyanSoft = [System.Drawing.Color]::FromArgb(110, 0, 255, 204)
$Ink      = [System.Drawing.Color]::FromArgb(190, 6, 12, 24)
$InkSolid = [System.Drawing.Color]::FromArgb(235, 8, 16, 30)

function New-RoundedPath {
  param([single]$x, [single]$y, [single]$w, [single]$h, [single]$r)
  $d = $r * 2
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $p.AddArc($x, $y, $d, $d, 180, 90)
  $p.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $p.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $p.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $p.CloseFigure()
  return $p
}

function Save-Bitmap {
  param([System.Drawing.Bitmap]$bmp, [string]$name)
  $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "  public/ar/$name"
}

function New-Scene {
  param([int]$w, [int]$h)
  $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
  $g.Clear([System.Drawing.Color]::Transparent)
  return [pscustomobject]@{ Bitmap = $bmp; Graphics = $g }
}

Write-Host 'Generating placeholder AR assets...'

# ---------------------------------------------------------------- panel-bg.png
$s = New-Scene 1024 1024
$g = $s.Graphics
$path = New-RoundedPath 48 48 928 928 96
$g.FillPath((New-Object System.Drawing.SolidBrush($Ink)), $path)
$g.DrawPath((New-Object System.Drawing.Pen($Cyan, 9)), $path)
$inner = New-RoundedPath 84 84 856 856 72
$g.DrawPath((New-Object System.Drawing.Pen($CyanSoft, 3)), $inner)
$corner = New-Object System.Drawing.Pen($Cyan, 7)
foreach ($c in @(@(96, 96, 1), @(928, 96, -1), @(96, 928, 1), @(928, 928, -1))) {
  $g.DrawLine($corner, $c[0], $c[1], $c[0] + (90 * $c[2]), $c[1])
}
Save-Bitmap $s.Bitmap 'panel-bg.png'

# ------------------------------------------------------------------- glow.png
$s = New-Scene 512 512
$g = $s.Graphics
$gp = New-Object System.Drawing.Drawing2D.GraphicsPath
$gp.AddEllipse(0, 0, 512, 512)
$pgb = New-Object System.Drawing.Drawing2D.PathGradientBrush($gp)
$pgb.CenterColor = [System.Drawing.Color]::FromArgb(150, 0, 255, 204)
$pgb.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 255, 204))
$g.FillEllipse($pgb, 0, 0, 512, 512)
Save-Bitmap $s.Bitmap 'glow.png'

# ----------------------------------------------------------------- avatar.png
$s = New-Scene 512 512
$g = $s.Graphics
$gp = New-Object System.Drawing.Drawing2D.GraphicsPath
$gp.AddEllipse(16, 16, 480, 480)
$pgb = New-Object System.Drawing.Drawing2D.PathGradientBrush($gp)
$pgb.CenterColor = [System.Drawing.Color]::FromArgb(255, 12, 26, 46)
$pgb.SurroundColors = @([System.Drawing.Color]::FromArgb(255, 4, 10, 20))
$g.FillEllipse($pgb, 16, 16, 480, 480)
$g.DrawEllipse((New-Object System.Drawing.Pen($Cyan, 8)), 16, 16, 480, 480)
$sil = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 180, 240, 235))
$g.FillEllipse($sil, 196, 150, 120, 120)
$body = New-RoundedPath 140 300 232 150 90
$g.FillPath($sil, $body)
Save-Bitmap $s.Bitmap 'avatar.png'

# -------------------------------------------------------------- name-plate.png
$s = New-Scene 512 128
$g = $s.Graphics
$path = New-RoundedPath 6 6 500 116 24
$g.FillPath((New-Object System.Drawing.SolidBrush($InkSolid)), $path)
$g.DrawPath((New-Object System.Drawing.Pen($CyanSoft, 3)), $path)
$g.FillRectangle((New-Object System.Drawing.SolidBrush($Cyan)), 6, 34, 8, 60)
$g.DrawLine((New-Object System.Drawing.Pen($Cyan, 4)), 24, 116, 488, 116)
Save-Bitmap $s.Bitmap 'name-plate.png'

# ------------------------------------------------------------ progress-bar.png
$s = New-Scene 512 64
$g = $s.Graphics
$track = New-RoundedPath 4 4 504 56 20
$g.DrawPath((New-Object System.Drawing.Pen($CyanSoft, 3)), $track)
for ($i = 0; $i -lt 12; $i++) {
  $x = 18 + $i * 40
  $col = if ($i -lt 8) { $Cyan } else { $CyanSoft }
  $g.FillRectangle((New-Object System.Drawing.SolidBrush($col)), $x, 18, 26, 28)
}
Save-Bitmap $s.Bitmap 'progress-bar.png'

# ----------------------------------------------------------- hud-element-1.png
$s = New-Scene 256 256
$g = $s.Graphics
$g.DrawArc((New-Object System.Drawing.Pen($Cyan, 6)), 20, 20, 216, 216, 20, 200)
$g.DrawArc((New-Object System.Drawing.Pen($CyanSoft, 10)), 44, 44, 168, 168, 230, 120)
$g.DrawEllipse((New-Object System.Drawing.Pen($Cyan, 3)), 78, 78, 100, 100)
for ($a = 0; $a -lt 360; $a += 30) {
  $rad = $a * [Math]::PI / 180
  $x1 = 128 + [Math]::Cos($rad) * 104; $y1 = 128 + [Math]::Sin($rad) * 104
  $x2 = 128 + [Math]::Cos($rad) * 118; $y2 = 128 + [Math]::Sin($rad) * 118
  $g.DrawLine((New-Object System.Drawing.Pen($Cyan, 4)), $x1, $y1, $x2, $y2)
}
Save-Bitmap $s.Bitmap 'hud-element-1.png'

# ----------------------------------------------------------- hud-element-2.png
$s = New-Scene 256 256
$g = $s.Graphics
$pen = New-Object System.Drawing.Pen($Cyan, 5)
$pen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$g.DrawEllipse($pen, 28, 28, 200, 200)
$g.DrawEllipse((New-Object System.Drawing.Pen($CyanSoft, 3)), 60, 60, 136, 136)
for ($a = 0; $a -lt 360; $a += 90) {
  $rad = $a * [Math]::PI / 180
  $cx = 128 + [Math]::Cos($rad) * 100; $cy = 128 + [Math]::Sin($rad) * 100
  $g.FillEllipse((New-Object System.Drawing.SolidBrush($Cyan)), $cx - 8, $cy - 8, 16, 16)
}
Save-Bitmap $s.Bitmap 'hud-element-2.png'

# -------------------------------------------------------------- icon-*.png x4
$icons = @{ 'icon-wa.png' = 'W'; 'icon-li.png' = 'in'; 'icon-email.png' = '@'; 'icon-web.png' = '</>' }
foreach ($name in $icons.Keys) {
  $s = New-Scene 128 128
  $g = $s.Graphics
  $path = New-RoundedPath 8 8 112 112 28
  $g.FillPath((New-Object System.Drawing.SolidBrush($InkSolid)), $path)
  $g.DrawPath((New-Object System.Drawing.Pen($Cyan, 5)), $path)
  $font = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::Center
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString($icons[$name], $font, (New-Object System.Drawing.SolidBrush($Cyan)), (New-Object System.Drawing.RectangleF(0, 0, 128, 128)), $fmt)
  Save-Bitmap $s.Bitmap $name
}

Write-Host 'Done.'
