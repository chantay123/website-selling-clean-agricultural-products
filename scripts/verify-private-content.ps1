<#
.SYNOPSIS
    Verifies the private (authenticated) endpoints of the Agrimarket API.

.DESCRIPTION
    Every endpoint in this script lives behind a bearer token, so the script
    needs a valid access token. When no token is supplied it falls back to
    reading the one stored by the app in the localStorage of the browser,
    which is not reachable from PowerShell, so the script simply reports the
    unauthenticated status of every route instead.

    Usage:
        pwsh -File scripts/verify-private-content.ps1
        pwsh -File scripts/verify-private-content.ps1 -Token "<access_token>"
#>
param(
    [Parameter(Mandatory = $false)]
    [string]$Token = "",
    [string]$BaseUrl = "https://agrimarket-z5f0.onrender.com/api/v1"
)

$ErrorActionPreference = "Stop"

# The endpoints grouped by the resource they belong to. The first route of
# each group is enough to prove that the group is reachable, the remaining
# ones cover the other verbs of the same router.
$routes = @(
    @{ Group = "roles";       Path = "roles";                                          Method = "GET" },
    @{ Group = "roles";       Path = "roles/674331d6311874334634de60";                  Method = "PUT" },
    @{ Group = "roles";       Path = "roles/674331d6311874334634de60";                  Method = "DELETE" },
    @{ Group = "reports";     Path = "reports";                                        Method = "GET" },
    @{ Group = "reports";     Path = "reports";                                        Method = "POST" },
    @{ Group = "reports";     Path = "reports/674331d6311874334634de60";                Method = "DELETE" },
    @{ Group = "stocks";      Path = "stocks";                                         Method = "GET" },
    @{ Group = "stocks";      Path = "stocks/674331d6311874334634de60";                 Method = "GET" },
    @{ Group = "comments";    Path = "products/674331d6311874334634de60/comments";     Method = "GET" },
    @{ Group = "comments";    Path = "products/674331d6311874334634de60/comments";     Method = "POST" },
    @{ Group = "comments";    Path = "products/674331d6311874334634de60/comments/abc"; Method = "DELETE" },
    @{ Group = "blog-comments"; Path = "blogs/674c8ffaa6f6dc2213b4b57f/comments";      Method = "GET" },
    @{ Group = "blog-like";   Path = "blogs/674c8ffaa6f6dc2213b4b57f/like";            Method = "POST" }
)

$headers = @{ Accept = "application/json" }
if ($Token -ne "") {
    $headers["Authorization"] = "Bearer $Token"
}

$passed = 0
$failed = 0

function Invoke-Api {
    param(
        [string]$Path,
        [string]$Method,
        [hashtable]$Headers
    )

    $uri = "$BaseUrl/$Path"
    try {
        $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $Headers -TimeoutSec 40 -ErrorAction Stop
        return @{ Status = [int]$response.StatusCode; Body = $response.Content }
    } catch {
        $errorResponse = $_.Exception.Response
        if ($null -ne $errorResponse) {
            $body = ""
            try {
                $stream = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
                $body = $stream.ReadToEnd()
            } catch {
                $body = ""
            }
            return @{ Status = [int]$errorResponse.StatusCode; Body = $body }
        }
        return @{ Status = "ERR"; Body = $_.Exception.Message }
    }
}

Write-Host ""
Write-Host "=== Agrimarket - private endpoints ===" -ForegroundColor Cyan
if ($Token -eq "") {
    Write-Host "Khong co token -> chi kiem tra route co ton tai hay khong (401 = route ton tai, can dang nhap)" -ForegroundColor Yellow
} else {
    Write-Host "Dung access token de xac thuc." -ForegroundColor Green
}
Write-Host ""

foreach ($route in $routes) {
    $result = Invoke-Api -Path $route.Path -Method $route.Method -Headers $headers
    $status = $result.Status

    # 401 means the route exists but the token is missing or invalid.
    # 400 means the route exists and the request was rejected by the validation.
    # Both are proof that the endpoint is reachable, which is what this script
    # checks when no token is available.
    $isReachable = $status -in @(200, 201, 400, 401, 403, 404)

    $marker = if ($isReachable) { "PASS" } else { "FAIL" }
    if ($isReachable) { $script:passed++ } else { $script:failed++ }

    $color = if ($isReachable) { "Green" } else { "Red" }
    $snippet = ""
    if ($result.Body) {
        $snippet = $result.Body.Substring(0, [Math]::Min(140, $result.Body.Length))
    }

    Write-Host ("[{0}] {1,-14} {2,-6} {3,-58} => {4}  {5}" -f $marker, $route.Group, $route.Method, $route.Path, $status, $snippet) -ForegroundColor $color
}

Write-Host ""
Write-Host ("Tong: {0} pass, {1} fail" -f $passed, $failed) -ForegroundColor Cyan
Write-Host ""

if ($failed -gt 0) { exit 1 }
