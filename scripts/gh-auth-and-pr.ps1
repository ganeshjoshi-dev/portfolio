# Use gh from its install path (PATH may not include it in current session)
$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
  Write-Host "GitHub CLI not found at $gh"
  exit 1
}

# Step 1: Login (interactive - run this once)
Write-Host "Running: gh auth login"
& $gh auth login

# Step 2: Create PR (run after login)
Write-Host "`nAfter login succeeds, create the PR with:"
Write-Host "  & `"$gh`" pr create --base main --head portfolio --title `"Merge portfolio: Sola Haadi, Modal fix, SEO`" --body `"Sola Haadi game, Modal scroll lock, responsive, legend, Rajasthan. UI: Modal/ConfirmDialog/Accordion. Games SEO.`""
Write-Host "`nOr run this script again and uncomment the pr create line below."

# Uncomment the next 2 lines to create PR after login:
# & $gh pr create --base main --head portfolio --title "Merge portfolio: Sola Haadi, Modal fix, SEO" --body "Sola Haadi game, Modal scroll lock, responsive, legend, Rajasthan. UI: Modal/ConfirmDialog/Accordion. Games SEO."
# exit 0
