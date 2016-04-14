param(
    [string]$fileLocation
)

Write-Verbose "fileLocation = $fileLocation"

Write-Verbose "Looking for an HTML artifact at $fileLocation"

if ([System.IO.File]::Exists($fileLocation))
{
    Write-Verbose "Uploading the HTML artifact"
    Write-Host "##vso[task.addattachment type=JohnWalley.html_artifact;name=html_artifact]$fileLocation"
}
else
{
    Write-Warning "Could not find the HTML artifact $fileLocation"
}
