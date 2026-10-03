Write-Host "node: $(node -v)"
Write-Host "npm:  $(npm -v)"
Write-Host "--- global npm packages ---"
npm ls -g --depth=0
if (Get-Command go -ErrorAction SilentlyContinue) {
    Write-Host "go: $(go version)"
} else {
    Write-Host "go: not on PATH"
}
if (Get-Command keploy -ErrorAction SilentlyContinue) {
    Write-Host "keploy: $(keploy --version)"
} else {
    Write-Host "keploy: not on PATH"
}
