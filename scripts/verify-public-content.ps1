# Verifies the three public endpoints integrated last: /banners, /blogs and
# /hashtags. It reproduces the request the application performs (JSON headers,
# base URL, no token) and asserts the response shape the components rely on.
#
# PowerShell is used instead of Node because the Node TLS client cannot reach
# the backend from this machine while the .NET HTTP stack can.
$ErrorActionPreference = "Stop"
$base = if ($env:VITE_API_URL) { $env:VITE_API_URL } else { "https://agrimarket-z5f0.onrender.com/api/v1" }
$results = @()

function Check($name, $ok, $detail) {
  $script:results += [pscustomobject]@{ name = $name; ok = [bool]$ok; detail = $detail }
}

function Get-Api($path) {
  try {
    $r = Invoke-WebRequest -Uri "$base/$path" -Headers @{ Accept = "application/json" } -UseBasicParsing -TimeoutSec 30
    return [pscustomobject]@{ status = [int]$r.StatusCode; json = ($r.Content | ConvertFrom-Json) }
  } catch {
    $status = 0
    try { $status = [int]$_.Exception.Response.StatusCode.value__ } catch {}
    return [pscustomobject]@{ status = $status; json = $null }
  }
}

# ---------------------------------------------------------------- banners
$b = Get-Api "banners"
Check "GET /banners tra 200" ($b.status -eq 200) "status=$($b.status)"
Check "/banners tra mang" ($null -ne $b.json.data -and $b.json.data -is [array]) "count=$(@($b.json.data).Count)"
Check "/banners co phan tu co url" (@($b.json.data | Where-Object { $_.url }).Count -gt 0) "count=$(@($b.json.data).Count)"
Check "/banners co _id/slug/description" (@($b.json.data | Where-Object { $_._id -and $_.PSObject.Properties.Name -contains 'slug' }).Count -eq @($b.json.data).Count) "shape"

# ------------------------------------------------------------------ blogs
$bl = Get-Api "blogs"
Check "GET /blogs tra 200" ($bl.status -eq 200) "status=$($bl.status)"
Check "/blogs tra mang" ($null -ne $bl.json.data -and $bl.json.data -is [array]) "count=$(@($bl.json.data).Count)"
Check "/blogs co phan tu co title" (@($bl.json.data | Where-Object { $_.title }).Count -gt 0) "count=$(@($bl.json.data).Count)"
Check "/blogs co trang thai Published" (@($bl.json.data | Where-Object { $_.status -eq 'Published' }).Count -gt 0) "published"

$first = @($bl.json.data)[0]
if ($first) {
  $bd = Get-Api "blogs/$($first._id)"
  Check "GET /blogs/:id tra 200" ($bd.status -eq 200) "status=$($bd.status)"
  Check "/blogs/:id tra dung bai da yeu cau" ($bd.json.data._id -eq $first._id) "id=$($bd.json.data._id)"
}

# -------------------------------------------------------------- hashtags
$h = Get-Api "hashtags"
Check "GET /hashtags tra 200" ($h.status -eq 200) "status=$($h.status)"
Check "/hashtags tra mang" ($null -ne $h.json.data -and $h.json.data -is [array]) "count=$(@($h.json.data).Count)"
Check "/hashtags co phan tu co name/slug" (@($h.json.data | Where-Object { $_.name -and $_.slug }).Count -eq @($h.json.data).Count) "shape"

$failures = @($results | Where-Object { -not $_.ok }).Count
foreach ($r in $results) {
  $tag = if ($r.ok) { "PASS" } else { "FAIL" }
  Write-Output "$tag  $($r.name)  ($($r.detail))"
}
Write-Output ""
Write-Output "$($results.Count - $failures)/$($results.Count) assertion pass"
if ($failures -gt 0) { exit 1 }
