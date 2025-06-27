param(
  [Parameter(Mandatory=$true)]
  [string]$ProjectDir
)

# Liste aller Tests
$tests = @(
  @{File='index.html';     Pattern='<script\s+src\s*=\s*"niceditor\.js"';       Desc='index.html bindet niceditor.js ein'},
  @{File='index.html';     Pattern='<textarea\s+id\s*=\s*"my-editor"';        Desc='index.html hat <textarea id="my-editor">'},
  @{File='style.css';      Pattern='\.nic-editor\s*{';                       Desc='style.css definiert .nic-editor'},
  @{File='style.css';      Pattern='\.nic-toolbar\s*{';                      Desc='style.css definiert .nic-toolbar'},
  @{File='niceditor.js';   Pattern='class\s+NicEditor';                       Desc='niceditor.js enthält Klasse NicEditor'},
  @{File='niceditor.js';   Pattern='document\.execCommand';                  Desc='niceditor.js nutzt execCommand'},
  @{File='README.md';      Pattern='#\s*niceditor\.js';                       Desc='README.md hat Titel # niceditor.js'},
  @{File='package.json';   Pattern='"name"\s*:\s*"niceditor-js"';             Desc='package.json hat korrekten name'},
  @{File='package.json';   Pattern='"license"\s*:\s*"MIT"';                   Desc='package.json Lizenz=MIT'},
  @{File='LICENSE';        Pattern='MIT License';                             Desc='LICENSE enthält "MIT License"'},
  @{File='.gitignore';     Pattern='node_modules/';                           Desc='.gitignore ignoriert node_modules'}
)

Write-Host "== Prüfe Projekt in $ProjectDir =="

# Tests ausführen
foreach ($test in $tests) {
  $path = Join-Path $ProjectDir $test.File
  if (!(Test-Path $path)) {
    Write-Host "MISSING: $($test.File)" -ForegroundColor Red
    continue
  }

  $content = Get-Content $path -Raw
  if ($content -match $test.Pattern) {
    Write-Host "OK:     $($test.Desc)" -ForegroundColor Green
  }
  else {
    Write-Host "FAILED: $($test.Desc)" -ForegroundColor Yellow
  }
}

# JSON-Syntax prüfen
$pkg = Join-Path $ProjectDir "package.json"
try {
  Get-Content $pkg -Raw | ConvertFrom-Json > $null
  Write-Host "OK:     package.json ist gültiges JSON" -ForegroundColor Green
}
catch {
  Write-Host "FAILED: package.json ist ungültiges JSON" -ForegroundColor Red
}